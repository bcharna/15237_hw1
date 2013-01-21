

//Note 'Board' is a 2D array
//Board below has 3 rows ( bottom row is 0, top is 2)
//and 5 columns (this value can be changed) (leftmost is 0, rightmost is 4)
// F means means fence in cell, 0 means nothing in cell

//0 0 0 0 0
//F F F F 0
//0 F 0 F 0

// function Dog(name, age) {
//     this.name = name;
//     this.age = age;
//     this.sayName = function(times) {
//         for (var i=0; i<times; i++)
//             document.write(this.name + "! ");
//         document.write("<br>\n");
//     };
// }

// var d = new Dog("Rocky", 8);
// d.sayName(4);


function Piece(row, col, type, color) {
  this.row = row;
  this.col = col;
  this.color = color;
  this.type = type;
  this.moveUp = function() {
    if (this.row < ROWS - 1)
    {
      this.row++;
    }
  };

  this.moveDown = function() {
    if (this.row > 0)
    {
      this.row--;
    }
  };
  
  this.moveLeft = function() {
    if (this.col > 0)
    {
      this.col--;
    }
  };

  this.moveRight = function() {
    if (this.col < COLS - 1)
    {
      this.col++;
    }
  };
  
  this.draw = function(ctx) { //not sure about this method yet...
    
    var imageObj = new Image();

    imageObj.onload = function() {
      ctx.drawImage(imageObj, 69, 50);
    };
    imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
    
  }
    
};


// change move functions to in board
// 
// moveUp(row,col)
// moveDown(row,col)
// moveRight(row,col)
// moveLeft(row,col)

function Board(rows, cols) {
  this.rows = rows;
  this.cols = cols;
  this.grid = Array(rows);
  
  for (var i = 0; i < this.grid.length; i++)
  {
    this.grid[i] = Array(cols);
  }

}


//Run


// Globals (where to put these...?)

var ROWS = 3;
var WIDTH = 900;
var HEIGHT = 400;
var COLS = 5;





var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var intervalId;
var timerDelay = 100;
var rectLeft = 0;
var quit = false;

var board = new Board(3, 5);
var fence = new Piece(0,0, "Fence","blue");

board.grid[0][0] = fence;

function drawGrid(ctx) //not done...
{
  var element;
  var leftOffset;
  for (var row = 0; row < board.rows; row++)
  {
    for (var col = 0; col < board.cols; col++)
    {
      element = board.grid[row][col];
      
      if (element != null)
      {
        leftOffset = (element.col / 5) * WIDTH; // TODO convert to int..
        ctx.fillRect(leftOffset, 180, 40, 40);
        
      }
    }
  }
}

function redrawAll() {
    // erase everything -- not efficient, but simple!
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillRect(rectLeft, 180, 50, 40);
    ctx.font = "20px Arial";
    ctx.fillText("Press 'q' to quit.", 20, 40);
}

function onTimer() {
    if (quit) return;
    rectLeft = (rectLeft + 10) % WIDTH;
    redrawAll();
}

function onKeyDown(event) {
    if (quit) return;
    var qCode = 81;
    if (event.keyCode === qCode) {
        clearInterval(intervalId);
        // ctx.clearRect(0, 0, 400, 400);
        ctx.fillStyle = "rgba(128,128,128,0.75)";
        ctx.fillRect(0, 0, 400, 400);
        quit = true;
    }
}

function run() {
    canvas.addEventListener('keydown', onKeyDown, false);
    // make canvas focusable, then give it focus!
    canvas.setAttribute('tabindex','0');
    canvas.focus();
    intervalId = setInterval(onTimer, timerDelay);
}

run();
