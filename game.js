
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


 // Initialize Variables

var intervalId;
var timerDelay = 100;
var fences = 99;
var time = 200;
var goal = 20;
var sheep = new Object();
sheep.xPos = 0;
sheep.lane = 1;
sheep.onGround = true;
sheep.image = 1;
window.startGame=false;


// Fence factory

var fenceFactory = (function () {
	var exports = {};
		
	
	exports.newRandomFence = function () {
	  var lane = Math.floor((Math.random()*3));
	  
	  //create fence
	  var fence = new Object();
    fence.xPos = 0;
    fence.lane = lane;
    fence.hit = false;
    
    return fence;    
	};
	
	return exports;
}());

var laneFences0 = Array();
var laneFences1 = Array();
var laneFences2 = Array();




// Load Images

spriteSheet = new Image();
spriteSheet.src = "SpriteSheet.png";

background = new Image();
background.src = "background.png"

// Resize canvas and sheep with window size
// And start the game after animation

sizeCanvas();
startAnim();

window.addEventListener('resize', sizeCanvas);

function sizeCanvas(){
	var curWidth = window.innerWidth
	if (curWidth > 640){
  	ctx.canvas.width  = window.innerWidth-50;
  }
  else {ctx.canvas.width  = 590}
  ctx.canvas.height = Math.round(ctx.canvas.width*.75);
	sheepSizePosition();
	
}

function sheepSizePosition(){
  if (window.startGame){
    sheep.xPos = Math.round(ctx.canvas.width*.35);
  }
  switch (sheep.lane){
    case 0:
      sheep.curWidth = Math.round(ctx.canvas.width*.21);
      sheep.curHeight = sheep.curWidth*.75;
      sheep.yPos = Math.round(ctx.canvas.height*.98)-sheep.curHeight;
      break;
    case 1:
      sheep.curWidth = Math.round(ctx.canvas.width*.16);
      sheep.curHeight = sheep.curWidth*.75;
      sheep.yPos = Math.round(ctx.canvas.height*.86)-sheep.curHeight;
      break;
    case 2:
      sheep.curWidth = Math.round(ctx.canvas.width*.11);
      sheep.curHeight = sheep.curWidth*.75;
      sheep.yPos = Math.round(ctx.canvas.height*.76)-sheep.curHeight;
      break;
  }
}

// Draw Functions (also text)

function drawSheep(x,y){
  var img = new Image();   // Create new img element
  if (x === undefined) x = 10;
  if (y === undefined) y = Math.floor(ctx.canvas.height*.8);
  var width = sheep.curWidth;
  var height =	sheep.curHeight;
  if (!sheep.onGround){
  	ctx.drawImage(spriteSheet,1594,75,530,348, x, y, width, height);}
  else if (sheep.image === 1){
  	ctx.drawImage(spriteSheet,1011,72,504,350, x, y, width, height);}
  else if (sheep.image === 2){
  	ctx.drawImage(spriteSheet,464,70, 490,352, x, y, width, height);}
  }



function reDrawSheep(x,y){
	if (y === undefined) y = 0;
  var width = sheep.curWidth;
  var height = sheep.curHeight;
	sheep.xPos += x;
	sheep.yPos += y;
	drawSheep(sheep.xPos,sheep.yPos);
  redrawAll();
}


// return true if fence is touching sheep
function sheepTouchingFence(fence)
{
  var fenceX = canvas.width - fence.xPos;
  var fenceY;
  
  var fenceWidth;
  var fenceHeight;
  
  
  if (fence.lane === 0)
  {
    fenceY = Math.round(canvas.height * .80);
    fenceWidth = Math.round(canvas.width * .18);
    fenceHeight = Math.round(canvas.height * .18);
  }
  else if (fence.lane === 1)
  {
    fenceY = Math.round(canvas.height * .725);
    fenceWidth = Math.round(canvas.width * .13);
    fenceHeight = Math.round(canvas.height * .13);
    
    
  }
  else
  {
    fenceY = Math.round(canvas.height * .72);
    fenceWidth = Math.round(canvas.width * .06);
    fenceHeight = Math.round(canvas.height * .06);
  }
  
  
  var sheepWidth = sheep.curWidth;
  var sheepHeight = sheep.curHeight;
  var sheepY = sheep.yPos;
  var sheepX = sheep.xPos;
  
  //http://leetcode.com/2011/05/determine-if-two-rectangles-overlap.html
  
  var p1 = {x: sheepX,
            y: sheepY};

  var p2 = {x: sheepX + sheepWidth,
            y: sheepY + sheepHeight};
  var p3 = {x: fenceX,
            y: fenceY};
  var p4 = {x: fenceX + fenceWidth,
            y: fenceY + fenceHeight};
  
  // var intersect = ((p2.y <= p3.y) && (p1.y >= p4.y) && (p2.x >= p3.x) && (p1.x <= p4.x));
  
  // TODO add hit attr to fence. if already hit, return false!!!
  var intersect = ! ( p2.y < p3.y || p1.y > p4.y || p2.x < p3.x || p1.x > p4.x )
  var inLane = (sheep.lane === fence.lane);
  console.log(intersect && inLane);
  
  if (intersect && inLane)
  {
    if (!fence.hit)
    {
      fence.hit = true;
      return true;
    }
  }
  else return false;
  // return  ;
}


// Animation functions
function advanceFences() {
  
  var xDelta = Math.round(canvas.width/23);
  for (var i = 0; i < laneFences0.length; i++)
  {
    laneFences0[i].xPos += xDelta;
    if (sheepTouchingFence(laneFences0[i]))
    {
      time += 1000;
    }
    
  }
  
  for (var i = 0; i < laneFences1.length; i++)
  {
    laneFences1[i].xPos += xDelta;
    if (sheepTouchingFence(laneFences1[i]))
    {
      time += 1000;
    }
  }
  
  for (var i = 0; i < laneFences2.length; i++)
  {
    laneFences2[i].xPos += xDelta;
    if (sheepTouchingFence(laneFences2[i]))
    {
      time += 1000;
    }
  }
  
  
  
  
}


function startAnim(){
  reDrawSheep(1);
  if (sheep.xPos < Math.round(ctx.canvas.width*.35)){
  	setTimeout(startAnim, 10);
  }
  else{
    window.startGame = true;
    setInterval(generateFence, 2000);
    setInterval(advanceFences, timerDelay);
  }
}


function jumpUpAnim(startYPos,jumpDist){
  var delay = 1000/120;
  reDrawSheep(0,-jumpDist/50);
  if (sheep.yPos > startYPos-jumpDist){
    setTimeout(function(){jumpUpAnim(startYPos,jumpDist);}, delay);
  }
  else{jumpDownAnim(startYPos,delay,jumpDist);}
}

function jumpDownAnim(startYPos,delay,jumpDist){
  reDrawSheep(0,jumpDist/50);
  if (sheep.yPos < startYPos){
    setTimeout(function(){jumpDownAnim(startYPos,delay,jumpDist)}, delay);
  }
  else{
    sheep.onGround = true;
    sheep.yPos = startYPos;
  }
}

function jumpAnim(){
    var startYPos = sheep.yPos;
    sheep.onGround = false;
    var jumpDist = (2*sheep.curHeight);
    jumpUpAnim(startYPos,jumpDist);
}

function animateSheep(){
    if (sheep.image === 1){sheep.image = 2;}
    else if(sheep.image===2){sheep.image = 1;}
}

// User Input
function onKeyDown(event){
    var spaceBarCode = 32;
    var upCode = 38;
    var downCode = 40;
    if (sheep.onGround && window.startGame){
      if (event.keyCode === spaceBarCode){jumpAnim();}
      else if(sheep.lane < 2 && event.keyCode === upCode){
      	sheep.lane++;
        sheepSizePosition();
      }
      else if(sheep.lane > 0 && event.keyCode === downCode){
      	sheep.lane--;
        sheepSizePosition();
      }
    }
}

// Rendered Text
function fencesJumped(fences, canvas, ctx){
	var fontSize = canvas.width*.07
	ctx.font = fontSize+"px Showcard Gothic";
	ctx.fillStyle = 'rgb(244, 233, 108)'
	ctx.fillText(""+fences, canvas.width*.51, canvas.height*.175);
}

function calcTime(time){
	if (time < 0) {return 0;}
	else {
		return time;
	}
}

function timeLeft(time, canvas, ctx){
	var fontSize = canvas.width*.05
	ctx.font = fontSize+"px Showcard Gothic";
	ctx.fillStyle = 'rgb(66, 72, 119)';
	ctx.fillText("Time Left: "+calcTime(time), .63*canvas.width, canvas.height/6.4);
}

function fenceGoal(goal, canvas, ctx){
	var fontSize = canvas.width*.05
	ctx.font = fontSize+"px Showcard Gothic";
	ctx.fillStyle = 'rgb(66, 72, 119)';
	ctx.fillText("Goal: "+goal+" Fences", .03*canvas.width, canvas.height/6.4);
}

function drawMoon(canvas, ctx){
	ctx.drawImage(spriteSheet,0,0,300,350,canvas.width*.46,canvas.height*.05,
		                                  canvas.width*.13,canvas.height*.2);

}

function drawFence(fence) {
  var sx = 2259;
  var sy = 130;
  var sWidth = 198;
  var sHeight = 260;
  
  var dx = canvas.width - fence.xPos;
  var dy;
  
  var dWidth;
  var dHeight;
  
  
  if (fence.lane === 0)
  {
    dy = Math.round(canvas.height * .80);
    dWidth = canvas.width * .18;
    dHeight = canvas.height * .18;
  }
  else if (fence.lane === 1)
  {
    dy = Math.round(canvas.height * .725);
    dWidth = canvas.width * .13;
    dHeight = canvas.height * .13;
    
    
  }
  else
  {
    dy = Math.round(canvas.height * .72);
    dWidth = canvas.width * .06;
    dHeight = canvas.height * .06;
    
    
  }
  
  
  //TODO: change d width and height to depend on the lane.
  // also change dx and dy to depend on canvas.width and canvas.height
  
  // ctx.drawImage(spriteSheet, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  // console.log();
  // console.log(dWidth == canvas.width * 13);
  
  ctx.drawImage(spriteSheet,sx, sy, sWidth, sHeight,canvas.width - fence.xPos,dy,
		                                  dWidth,dHeight);
	
  
}

function drawFencesInLane(lane) {
  
  var laneFences;
  if (lane === 0)
    laneFences = laneFences0;
  else if (lane === 1)
    laneFences = laneFences1;
  else
    laneFences = laneFences2;
    
  for (var i = 0; i < laneFences.length; i++)
  {
    
    drawFence(laneFences[i]);
  }
  
  
  
  
}

function generateFence() {
  
  var thisFence = fenceFactory.newRandomFence();
  
  // console.log(thisFence.lane);
  if (thisFence.lane === 0)
    laneFences0.push(thisFence);
  else if (thisFence.lane === 1)
    laneFences1.push(thisFence);
  else
    laneFences2.push(thisFence);
    
    
    
}

function redrawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    fencesJumped(fences, canvas, ctx);
    timeLeft(time, canvas, ctx);
    fenceGoal(goal, canvas, ctx);
    drawMoon(canvas, ctx);
    
    if (sheep.lane === 0)
    {
      drawFencesInLane(0);
      drawFencesInLane(1);
      drawFencesInLane(2);
      drawSheep(sheep.xPos,sheep.yPos);
    }
    else if (sheep.lane === 1)
    {
      drawFencesInLane(1);
      drawFencesInLane(2);
      drawSheep(sheep.xPos,sheep.yPos);
      drawFencesInLane(0);
      
    }
    else
    {
      drawFencesInLane(0);
      drawFencesInLane(2);
      drawSheep(sheep.xPos,sheep.yPos);
      drawFencesInLane(1);
      
      
    }

}

function onTimer() {
    
    
    redrawAll();
    
    animateSheep(sheep.image);
    time--;
}


///call back on the resize

//function onKeyDown(event) {
//    var qCode = 81;
//   if (event.keyCode === qCode) {
//        
  //  }
//}

function run() {
    canvas.addEventListener('keydown', onKeyDown, false);
    // make canvas focusable, then give it focus!
    canvas.setAttribute('tabindex','0');
    canvas.focus();
    intervalId = setInterval(onTimer, timerDelay);
    
    
}

run();



