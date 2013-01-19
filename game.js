
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


// Animation functions

function startAnim(){
  reDrawSheep(1);
  if (sheep.xPos < Math.round(ctx.canvas.width*.35)){
  	setTimeout(startAnim, 10);
  }
  else{
    window.startGame = true;
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

function redrawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    fencesJumped(fences, canvas, ctx);
    timeLeft(time, canvas, ctx);
    fenceGoal(goal, canvas, ctx);
    drawMoon(canvas, ctx);
    drawSheep(sheep.xPos,sheep.yPos);

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



