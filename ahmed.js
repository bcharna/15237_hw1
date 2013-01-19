var sheep = new Object();
sheep.lane = 0;
sheep.onGround = true;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
sizeCanvas();

window.addEventListener('resize', sizeCanvas);

function sizeCanvas(){
  var curWidth = window.innerWidth
	if (curWidth > 640){
  	ctx.canvas.width  = window.innerWidth-50;
  }
  else {ctx.canvas.width  = 590}
  ctx.canvas.height = Math.round(ctx.canvas.width*.75);
  
	sheep.xPos = Math.round(ctx.canvas.width*.5);
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
      sheep.yPos = Math.round(ctx.canvas.height*.77)-sheep.curHeight;
      break;
  }
  drawSheep(sheep.xPos,sheep.yPos,sheep.curWidth,sheep.curHeight);
}



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

   img.onload = function(){ctx.drawImage(img,x,y,width,height);}
   img.src = 'sheep.png'; // Set source path
}

drawSheep(sheep.xPos,sheep.yPos,sheep.curWidth,sheep.curHeight);

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
    sheep.onGround = true;
    sheep.yPos = startYPos;
  }
}
function jumpAnim(){
    var startYPos = sheep.yPos;
    sheep.onGround = false;
    jumpUpAnim(startYPos);
}

function onKeyDown(event){
    var spaceBarCode = 32;
    var upCode = 38;
    var downCode = 40;
    if (sheep.onGround){
      if (event.keyCode === spaceBarCode){jumpAnim();}
      else if(sheep.lane < 2 && event.keyCode === upCode){
      	sheep.lane++;
        reDrawSheep(0,-10,sheep.curWidth*=(2/3),sheep.curHeight*=(2/3));
      }
      else if(sheep.lane > 0 && event.keyCode === downCode){
      	sheep.lane--;
        reDrawSheep(0,10,sheep.curWidth*=(3/2),sheep.curHeight*=(3/2));
      }
    }
}

function run() {
    canvas.addEventListener('keydown', onKeyDown, false);
    // make canvas focusable, then give it focus!
    canvas.setAttribute('tabindex','0');
    canvas.focus();
}

run();

function redrawAll(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
