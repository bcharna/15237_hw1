//Initialize objects, events, images
//
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

window.startGame = false;
window.addEventListener('resize', sizeCanvas);
var jumpSheepId;

var cloudIntId;

var game = new Object();
	game.level = 0;
	game.over = false;
	game.timerDelay = 100;
	game.timer = 1000;
	game.goal = 10;
	game.fencesJumped = 0;
	game.timeColor = 'rgb(30, 96, 117)';
	game.grassx = 0;
	game.speed = 1;
	game.fences = {lane0:[],lane1:[],lane2:[]};


var sheep = new Object();
	sheep.xPos = 0;
	sheep.lane = 1;
	sheep.onGround = true;
	sheep.image = 1;
	sheep.hit = false;
	
	
  // Cloud module
var CLOUD = (function () {
	var exports = {};

	exports.clouds = Array();

	function drawCloud(cloud)
	{
	  var sx;
	  var sy;
	  var sWidth;
	  var sHeight;

	  if (cloud.image === 0)
	  {
	    sx = 80;
  	  sy = 565;
  	  sWidth = 243;
  	  sHeight = 161;
	  }
	  else if (cloud.image === 1)
	  {
	    sx = 419;
  	  sy = 544;
  	  sWidth = 141;
  	  sHeight = 104;   
	  }
	  else if (cloud.image === 2)
	  {
	    sx = 751;
  	  sy = 616;
  	  sWidth = 95;
  	  sHeight = 75;   
	  }
	  else
	  {
	    sx = 938;
  	  sy = 580;
  	  sWidth = 244;
  	  sHeight = 159;   
	  }

	  var dx = Math.round(canvas.width - cloud.xPos);
    var dy;

    var dWidth;
    var dHeight;

    if (cloud.lane === 0)
    {
      dy = Math.round(canvas.height * .07);
      dWidth = Math.round(canvas.width * .18);
      dHeight = Math.round(canvas.height * .18);
    }
    else if (cloud.lane === 1)
    {
      dy = Math.round(canvas.height * .2);
      dWidth = Math.round(canvas.width * .13);
      dHeight = Math.round(canvas.height * .13);      
    }
    
    if (dWidth > Math.round(sWidth * 2) 
    || dHeight > Math.round(sHeight * 2)) // we dont want to have the dWidth or height too big 
    {
      dWidth = Math.round(sWidth * 2);
      dHeight = Math.round(sHeight * 2); // prevent too much distortion
    }

    ctx.drawImage(spriteSheet, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

	}

	exports.drawClouds = function () {

	  for (var i = 0; i < exports.clouds.length; i++)
	  {
      drawCloud(exports.clouds[i]);
      var cloudWidth;
      var thisCloud = exports.clouds[i];

      if (thisCloud.lane === 0)
      {
        cloudWidth = Math.round(canvas.width * .18);
      }
      else if (thisCloud.lane === 1)
      {
        cloudWidth = Math.round(canvas.width * .13);
      }

      if (canvas.width - thisCloud.xPos < - 1 * cloudWidth) // remove this elt from array as it's off screen
      { 
        removeAt(exports.clouds, i);
        i--; //we must relook at this index as the array got shorter
      }
	  }

	}

	exports.newRandomCloud = function () {
	  var lane = Math.floor((Math.random()*2));
	  var image_num = Math.floor((Math.random()*4));

	  //create cloud
	  var cloud = new Object();
    cloud.xPos = 0;
    cloud.lane = lane;
    cloud.image = image_num;
    return cloud;    
	};

	return exports;
}());


function generateNewFence(){
  var lane = Math.floor((Math.random()*3));
  var numberOfFences = Math.floor((Math.random()*2));
  var laneTaken=[];
  for(var i=0; i<numberOfFences; i++){
    var lane = Math.floor((Math.random()*3));

    var fence = new Object();
    fence.xPos = 0;
    fence.lane = lane;
    fence.hit = false;
    switch (fence.lane){
      case 0:
        fence.yPos = Math.round(canvas.height * .75); 
        fence.curWidth = Math.round(canvas.width * .1);
        fence.curHeight = Math.round(canvas.width * .18);
        game.fences.lane0.push(fence);
        break;
      case 1:
        fence.yPos = Math.round(canvas.height * .69); 
        fence.curWidth = Math.round(canvas.width * .08);
        fence.curHeight = Math.round(canvas.width * .13); 
        game.fences.lane1.push(fence);
        break;
      case 2: 
        fence.yPos = Math.round(canvas.height * .65); 
        fence.curWidth = Math.round(canvas.width * .06);
        fence.curHeight = Math.round(canvas.width * .1);
        game.fences.lane2.push(fence);
        break;
    }
  }
}


var spriteSheet = new Image();
spriteSheet.src = "SpriteSheet.png";

var background = new Image();
background.src = "background.png"

var grass = new Image();
grass.src = "grass.png"


// Resize canvas to browser width (set ratio)

function sizeCanvas(){
	var curWidth = window.innerWidth
	if (curWidth > 640){
  	ctx.canvas.width  = window.innerWidth-50;
	}
  else {ctx.canvas.width  = 590}
  ctx.canvas.height = Math.round(ctx.canvas.width*.75);
  sheepSizePosition();	
  fenceSizePosition();
  redrawAll();
}

//////////// fences

function fenceSizePosition(){
  laneFenceSizePosition(game.fences.lane0);
  laneFenceSizePosition(game.fences.lane1);
  laneFenceSizePosition(game.fences.lane2);
}

function laneFenceSizePosition(laneFences){
  for(var f=0; f<laneFences.length; f++){
  	fence = laneFences[f];
    switch (fence.lane){
      case 0:
        fence.yPos = Math.round(canvas.height * .75); 
        fence.curWidth = Math.round(canvas.width * .1);
        fence.curHeight = Math.round(canvas.width * .18);
        break;
      case 1:
        fence.yPos = Math.round(canvas.height * .69); 
        fence.curWidth = Math.round(canvas.width * .08);
        fence.curHeight = Math.round(canvas.width * .13); 
        break;
      case 2: 
        fence.yPos = Math.round(canvas.height * .65); 
        fence.curWidth = Math.round(canvas.width * .06);
        fence.curHeight = Math.round(canvas.width * .1);
        break;
    }
  }
}

function advanceFences(){
  moveFencesInLane(game.fences.lane0);
  moveFencesInLane(game.fences.lane1);
  moveFencesInLane(game.fences.lane2);
}

function moveFencesInLane(laneFences){
  game.grassx -= game.speed;
  for(var f=0; f<laneFences.length; f++){
      fence = laneFences[f];
      fenceCenter = canvas.width - fence.xPos - (fence.curWidth/2);
      fence.xPos += game.speed*5;
      if (!fence.hit && sheep.lane === fence.lane && fenceCenter>sheep.xPos && fenceCenter<(sheep.xPos+sheep.curWidth)){
        fence.sheepGoingThrough = true;
        if (sheepTouchingFence(laneFences[f])){
      	  game.timer -= 100;
      	  game.timeColor = 'rgb(206, 10, 49)';
      	  sheep.image = 3;
        }
      }
      else if(!fence.hit && fence.sheepGoingThrough === true && fenceCenter<sheep.xPos){
        game.fencesJumped++;
        changeGoal();
        fence.sheepGoingThrough = false;
      }
   }
}

// Sheep drawing functions

function sheepSizePosition(){
  oldYPos = sheep.yPos;
	if (window.startGame){
    	sheep.xPos = Math.round(ctx.canvas.width*.2);
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
  if (!sheep.onGround){ 
    console.log('wahat');
    sheep.yPos= (sheep.yRelToCanvas*canvas.height);}
}


function drawSheep(x,y){
  	var img = new Image();   // Create new img element
  	if (x === undefined) {x = 10};
  	if (y === undefined) {y = Math.floor(ctx.canvas.height*.8)};
  	var width = sheep.curWidth;
  	var height = sheep.curHeight;
	if (!sheep.onGround){
		ctx.drawImage(spriteSheet,1594,75,530,348, x, y, width, height);}
	//else if (!sheep.onGround && sheepTouchingFence(fence)){
	//ctx.drawImage(spriteSheet, 1595, 460, 530, 348, x, y, width);}
	else if (sheep.image === 1){
		ctx.drawImage(spriteSheet,1011,72,504,350, x, y, width, height);}
	else if (sheep.image === 2){
		ctx.drawImage(spriteSheet,464,70, 490,352, x, y, width, height);}
    else if (sheep.image === 3){
    	ctx.drawImage(spriteSheet, 1594,460,530,348, x, y, width, height);}
}


function reDrawSheep(x,y){
	if (y === undefined) y = 0;
	sheep.xPos += x;
	sheep.yPos += y;
  redrawAll();
}


function jumpSheep(startYPos, jumpSpeed, acceleration){
  sheep.startYPos = startYPos;
  sheep.jumpSpeed = jumpSpeed;
  sheep.acceleration = acceleration;
  if (!sheep.onGround){
    if (sheep.yPos - jumpSpeed >= startYPos){
        sheep.yPos = startYPos;
 		sheep.onGround = true;
 		redrawAll();
    }
    else{
      sheep.yPos -= jumpSpeed;
      sheep.yRelToCanvas = (sheep.yPos/canvas.height);
      jumpSpeed += acceleration;
      jumpSheepId = setTimeout(function(){ jumpSheep(startYPos,jumpSpeed,acceleration);},20);
    }
  }
}

function jumpAnim(){
	var startYPos = sheep.yPos;
  sheep.onGround = false;
  var acceleration = -(sheep.curHeight/100);
  var jumpSpeed = Math.round(sheep.curHeight/5);
  jumpSheep(startYPos,jumpSpeed,acceleration);
}

function animateSheep(){
    if (sheep.image === 1){sheep.image = 2;}
    else {sheep.image = 1;} 
}


// User Input

function onKeyDown(event){
    var spaceBarCode = 32;
    var upCode = 38;
    var downCode = 40;
    var pCode = 80;
    var rCode = 82;
    
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
    if(event.keyCode === pCode){
      if (window.startGame) pauseGame();
      else{ unPauseGame();}
    }
    
    if(event.keyCode === rCode && game.over === true){
      location.reload(); // reload the page
    }
    
}


// Rendered Text and non-moving images

function sheepTouchingFence(fence){
  var fenceX = canvas.width - fence.xPos;
  var fenceY = fence.yPos;
  var fenceWidth = fence.curWidth;
  var fenceHeight = fence.curHeight;
  var fenceCenter = fenceX + Math.round(fenceWidth/2);
  if (!fence.hit && fence.lane === sheep.lane && fenceCenter>sheep.xPos && fenceCenter<(sheep.xPos+sheep.curWidth)){
    if (sheep.onGround || ((sheep.yPos+sheep.curHeight)>(fenceY))){
      fence.hit = true;
      return true;
    }
  }
  return false;
}

function changeGoal(){
    game.goal--;
    if (game.goal==0){
        game.goal=10;
        game.level++;
        game.speed+=.2;
    }
}


function fencesJumped(fences, canvas, ctx){
	var fontSize = canvas.width*.07
	ctx.font = fontSize+"px Impact";
	ctx.fillStyle = 'rgb(244, 223, 108)'
	ctx.fillText(""+fences, canvas.width*.51, canvas.height*.1755);
}

function calcTime(time){
	if (time < 0) {return 0;}
	else {
		return Math.round(time/10);
	}
}

function timeLeft(time, color, canvas, ctx){
	var fontSize = canvas.width*.06;
	ctx.font = fontSize+"px Impact";
	ctx.fillStyle = color;
	ctx.fillText("Time Left: "+calcTime(time), .64*canvas.width, canvas.height/6.4);
}

function fenceGoal(goal, canvas, ctx){
	var fontSize = canvas.width*.06;
	ctx.font = fontSize+"px Impact";
	ctx.fillStyle = 'rgb(30, 96, 117)';
	ctx.fillText("Next Level: "+goal, .05*canvas.width, canvas.height/6.4);
}

function drawMoon(canvas, ctx){
	ctx.drawImage(spriteSheet,0,0,300,350,canvas.width*.44, canvas.height*.05,
		                                  canvas.width*.13,canvas.height*.2);
}

function drawGrass(){
	if (game.grassx < -canvas.width) {game.grassx = 0;}
	ctx.drawImage(grass, game.grassx, 0, canvas.width, canvas.height);
	ctx.drawImage(grass, game.grassx+canvas.width, 0, canvas.width, canvas.height);
}


function drawFence(fence) {
  var dx = canvas.width - fence.xPos;
  if (fence.lane === 0){
  	if (fence.hit){ctx.drawImage(spriteSheet,2243, 537, 270, 98, dx, fence.yPos*1.15,
		                            fence.curWidth*1.4,fence.curHeight*.5);}
  	else{ctx.drawImage(spriteSheet,2259, 130, 198, 260, dx, fence.yPos,
		                            fence.curWidth,fence.curHeight);}
  }
  else if (fence.lane === 1){
  	if (fence.hit){ctx.drawImage(spriteSheet,2243, 537, 270, 98, dx, fence.yPos*1.12,
		                            fence.curWidth*1.4,fence.curHeight*.5);}
    else{ctx.drawImage(spriteSheet,2302, 697, 198, 260, dx, fence.yPos,
		                            fence.curWidth,fence.curHeight);}
  }
  else{
  	if (fence.hit){ctx.drawImage(spriteSheet,2243, 537, 270, 98, dx, fence.yPos*1.1,
		                            fence.curWidth*1.4,fence.curHeight*.5);}
    else{
  	ctx.drawImage(spriteSheet,2312, 1008, 198, 260, dx, fence.yPos,
		                            fence.curWidth,fence.curHeight);}
  }
}


function drawFencesInLane(lane) {
  var laneFences;
  var numDelete=0;
  if (lane === 0)
    laneFences = game.fences.lane0;
  else if (lane === 1)
    laneFences = game.fences.lane1;
  else
    laneFences = game.fences.lane2;  
  for (var i = 0; i < laneFences.length; i++)
  {
    drawFence(laneFences[i]);
  }
}

function gameOverMessage() {
  var fontSize = canvas.width*.06;
  ctx.textAlign = 'center';
  game.over = true;
	ctx.font = fontSize+"px Impact";
	ctx.fillStyle = 'rgb(244, 223, 108)'
	ctx.fillText("Game Over", .5 * canvas.width, .45 * canvas.height);
	fontSize = Math.round(fontSize * .6)
	ctx.fillText("press r to restart.", .5 * canvas.width, .55 * canvas.height);
	
}

// Running the Game

function redrawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    CLOUD.drawClouds();
    fencesJumped(game.fencesJumped, canvas, ctx);
    timeLeft(game.timer, game.timeColor, canvas, ctx);
    game.timeColor = 'rgb(30, 96, 117)'
    fenceGoal(game.goal, canvas, ctx);
    drawMoon(canvas, ctx);
    drawGrass();
    if (sheep.lane === 0){
      drawFencesInLane(2);
      drawFencesInLane(1);
      drawFencesInLane(0);
      drawSheep(sheep.xPos,sheep.yPos);
    }
    else if (sheep.lane === 1){
      drawFencesInLane(2);
      drawFencesInLane(1);
      drawSheep(sheep.xPos,sheep.yPos);
      drawFencesInLane(0); 
    }
    else if (sheep.lane == 2){
      drawFencesInLane(2);
      drawSheep(sheep.xPos,sheep.yPos);
      drawFencesInLane(1);
      drawFencesInLane(0); 
    }
    else{
      drawSheep(sheep.xPos,sheep.yPos);
    }
    
    if (game.timer < 0)
    {
      pauseGame();
      gameOverMessage();
    }
}

function onTimer() {
    redrawAll();
    animateSheep(sheep.image);
    game.timer--;
}

function fenceFactory(){
    generateNewFenceId = setInterval(generateNewFence, 800);
    advanceFenceId = setInterval(advanceFences, 10);
}

function pauseGame(){
  window.startGame = false;
  if (jumpSheepId !== undefined){
    window.clearTimeout(jumpSheepId);
  }
  window.clearInterval(generateNewFenceId);
  window.clearInterval(advanceFenceId);
  window.clearInterval(onTimerId);
  window.clearInterval(cloudIntId);
}

function unPauseGame(){
  window.startGame = true;
  jumpSheep(sheep.startYPos,sheep.jumpSpeed,sheep.acceleration);
  onTimerId = setInterval(onTimer, game.timerDelay);
  cloudIntId = setInterval(advanceClouds, game.timerDelay);
  fenceFactory();
}

function startAnim(){
  sizeCanvas();
  redrawAll();
  reDrawSheep(5);
  if (sheep.xPos < Math.round(ctx.canvas.width*.2)){
    setTimeout(startAnim, 40);
  }
  else{
    window.startGame = true;
    window.clearInterval(sheepAnimateId);
    run();
  }
}

//remove element at index from array in place.
function removeAt(array, index) {
  array.splice(index,1);
}


function advanceClouds () {
    for (var i = 0; i < CLOUD.clouds.length; i++)
    {
      CLOUD.clouds[i].xPos += 5; // xPos of 0 is all the way to right
    }  	  
}


function startClouds() {
  CLOUD.clouds.push(CLOUD.newRandomCloud()); //initial push
  setInterval(function () {
    CLOUD.clouds.push(CLOUD.newRandomCloud());
  }, 9000);
  
  cloudIntId = setInterval(advanceClouds, game.timerDelay);
  
}
function run() {
    canvas.addEventListener('keydown', onKeyDown, false);
    // make canvas focusable, then give it focus!
    canvas.setAttribute('tabindex','0');
    canvas.focus();
    onTimerId = setInterval(onTimer, game.timerDelay);  
    sizeCanvas();
    fenceFactory();
    startClouds();
}

spriteSheet.onload = function () { // let's start the game once the sprite is loaded
  startAnim();
}
sheepAnimateId = setInterval(animateSheep, game.timerDelay);
