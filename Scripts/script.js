console.log("script loaded");

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
console.log(context);

var activeKey = 0;

var colorArray = [
  "#092140",
  "#024959",
  "#F2C777",
  "#E6E7E8",
  "#BF2A2A"
];

function Player(x, dx, dy, height, width) {
  this.x = x;
  this.y = canvas.height - height;
  this.dx = dx;
  // this.dy = dy;
  // this.radius = width;
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
    // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillRect(this.x, this.y, this.height, this.width);
    context.fillStyle = this.color;
    context.fill();
  }

  this.update = function(keycode) {
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


var player = new Player(100, 10, 10, 50, 50);
console.log(player);
var animate = function() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, 600, 600);
  player.update(activeKey);
}

player.draw();
animate();

var keydown = false;
document.addEventListener("keydown", (event) => {
  if (keydown) return;
  keydown = true;
  activeKey = event.keyCode;
  player.animateOn();
  console.log(event);
});
document.addEventListener("keyup", (event) => {
  activeKey = -1;
  player.animateOff();
  keydown = false;
});
