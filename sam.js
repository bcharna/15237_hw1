
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


 // Initialize Variables

var intervalId;
var timerDelay = 0;
var fences = 99;
var time = 200;
var goal = 20;
var sheep = new Object();
var sheepLane = 0;
var onGround = true;
var sheepImage = 1;



// Load Images

spriteSheet = new Image();
spriteSheet.src = "SpriteSheet.png";

background = new Image();
background.src = "background.png"

// Resize canvas and sheep with window size

sizeCanvas();

window.addEventListener('resize', sizeCanvas);

function sizeCanvas(){
  var curWidth = window.innerWidth
	if (curWidth > 640){
  	ctx.canvas.width  = window.innerWidth-50;
  }
  else {ctx.canvas.width  = 590}
  ctx.canvas.height = Math.round(ctx.canvas.width*.75);
  
	sheep.xPos = Math.round(ctx.canvas.width*.35);
	switch (sheepLane){
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
      sheep.yPos = Math.round(ctx.canvas.height*.77)-sheep.curHeight;
      break;
  }

}

// Draw Functions (also text)

function drawSheep(x,y,width,height){
   var img = new Image();   // Create new img element
   if (x === undefined) x = 10;
   if (y === undefined) y = Math.floor(ctx.canvas.height*.8);
   if (width === undefined){
   		width = Math.floor(ctx.canvas.width*.2);
   		sheep.curWidth = width;
   	}

   if (height === undefined){
			height = Math.floor(ctx.canvas.height*.2);
			sheep.curHeight = height;
		}
    if (sheepImage === 1){
    	ctx.drawImage(spriteSheet,1000,75,515,340, x, y, width, height);}
    else if (sheepImage === 2){
    	ctx.drawImage(spriteSheet,1000,75,515,340, x, y, width, height);}
    else if (sheepImage === 3){
    	ctx.drawImage(spriteSheet,1000,75,515,340, x, y, width, height);}
    }



//drawSheep(sheep.xPos,sheep.yPos,sheep.curWidth,sheep.curHeight);

function reDrawSheep(x,y,width,height){
	if (y === undefined) y = 0;
    if (width === undefined) width = sheep.curWidth;
    if (height === undefined) height = sheep.curHeight;
	sheep.xPos += x;
	sheep.yPos += y;
	redrawAll();
	drawSheep(sheep.xPos,sheep.yPos,width,height);
}

function startAnim() {
    reDrawSheep(1);
    if (sheep.xPos < Math.floor(canvas.width/3)){
    	setTimeout(startAnim, 10);
    }
}

function jumpUpAnim(startYPos){
  var delay = 1000/120;
  var jumpDist = (2*sheep.curHeight);
  reDrawSheep(0,-jumpDist/50);
  if (sheep.yPos > startYPos-jumpDist){
    setTimeout(function(){jumpUpAnim(startYPos);}, delay);
  }
  else{jumpDownAnim(startYPos,delay,jumpDist);}
}

function jumpDownAnim(startYPos,delay,jumpDist){
  reDrawSheep(0,jumpDist/50);
  if (sheep.yPos < startYPos){
    setTimeout(function(){jumpDownAnim(startYPos,delay,jumpDist)}, delay);
  }
  else{
    onGround = true;
    sheep.yPos = startYPos;
  }
}

function jumpAnim(){
    var startYPos = sheep.yPos;
    onGround = false;
    jumpUpAnim(startYPos);
}

function onKeyDown(event){
    var spaceBarCode = 32;
    var upCode = 38;
    var downCode = 40;
    if (onGround){
      if (event.keyCode === spaceBarCode){jumpAnim();}
      else if(sheepLane < 2 && event.keyCode === upCode){
      	sheepLane++;
        reDrawSheep(0,-10,sheep.curWidth*=(2/3),sheep.curHeight*=(2/3));
      }
      else if(sheepLane > 0 && event.keyCode === downCode){
      	sheepLane--;
        reDrawSheep(0,10,sheep.curWidth*=(3/2),sheep.curHeight*=(3/2));
      }
    }
}


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

function animateSheep(sheepImage){
    if (sheepImage === 1){sheepImage = 2;}
    if(sheepImage===2){console.log("o");}
}

function redrawAll(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    fencesJumped(fences, canvas, ctx);
    timeLeft(time, canvas, ctx);
    fenceGoal(goal, canvas, ctx);
    drawMoon(canvas, ctx);
    drawSheep(sheep.xPos,sheep.yPos,sheep.curWidth,sheep.curHeight);

}

function onTimer() {
    redrawAll(canvas, ctx);
    animateSheep(sheepImage);
        console.log(sheepImage);
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


