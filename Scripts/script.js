console.log("script loaded");

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
console.log(context);

var activeKey = 0;
var gameOver = false;

var colorArray = [
  "#092140",
  "#024959",
  "#F2C777",
  "#E6E7E8",
  "#BF2A2A"
];

function Player(x, dx, height, width) {
  this.x = x;
  this.y = canvas.height - height;
  this.dx = dx;
  this.width = width;
  this.height = height;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  this.animate = false;

  this.animateOn = function() {
    this.animate = true;
  }

  this.animateOff = function() {
    this.animate = false;
  }

  this.draw = function() {
    context.beginPath();
    context.fillRect(this.x, this.y, this.height, this.width);
    context.fillStyle = this.color;
    context.fill();
  }

  this.update = function(keycode) {
    if (!gameOver) {
      if (this.animate) {
        console.log("update position of player");
        if (keycode === 39 && this.x + this.width + this.dx <= canvas.width)
          this.x += this.dx;
        else if (keycode === 37 && this.x - this.dx >= 0)
          this.x -= this.dx;
      }
      this.draw();
    }
  }
}

function Enemy(x, y, dx, dy, height, width) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.width = width;
  this.height = height;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  this.frame = 0;

  this.draw = function() {
    context.beginPath();
    context.fillRect(this.x, this.y, this.height, this.width);
    context.fillStyle = this.color;
    context.fill();
  }

  this.update = function() {
    if (!gameOver) {
      this.x += this.dx;

      if (this.x + this.width >= canvas.width || this.x <= 0) {
        this.dx = -this.dx;
        this.y += this.dy;
      }

      if (this.y > canvas.height - (this.height * 2)) gameOver = true;

      this.draw();
    }
  }
}


var player = new Player(0, 10, 50, 50);
var enemy = new Enemy(0, 0, 7, 25, 50, 50);

var animate = function() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, 600, 600);
  player.update(activeKey);
  enemy.update();
}

player.draw();
enemy.draw();
animate();

var keydown = false;
document.addEventListener("keydown", (event) => {
  if (keydown) return;
  keydown = true;
  activeKey = event.keyCode;
  player.animateOn();
});
document.addEventListener("keyup", (event) => {
  activeKey = -1;
  player.animateOff();
  keydown = false;
});
