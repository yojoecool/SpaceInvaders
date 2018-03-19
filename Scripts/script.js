console.log("script loaded");

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

var activeKey = 0;
var gameOver = false;
var gunShot = false;

var colorArray = [
  "#092140",
  "#024959",
  "#F2C777",
  "#E6E7E8",
  "#BF2A2A"
];

function Laser(x, y, dy, width, height, enemyLaser = true) {
  this.x = x;
  this.y = y;
  this.dy = dy;
  this.width = width;
  this.height = height;
  this.color = '#ff0000';
  this.enemyLaser = enemyLaser;

  this.getY = function() {
    return this.y;
  }

  this.draw = function() {
    context.fillStyle = this.color;
    context.beginPath();
    context.fillRect(this.x, this.y, this.height, this.width);
    context.fill();
  }

  this.update = function() {
    if (this.y > 0) {
      this.y -= this.dy;
      this.draw();
    }
  }
}

function Player(x, dx, width, height) {
  this.x = x;
  this.y = canvas.height - height;
  this.dx = dx;
  this.width = width;
  this.height = height;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  this.animate = false;
  this.laserTotal = 3;
  this.lasers = [];

  this.animateOn = function() {
    this.animate = true;
  }

  this.animateOff = function() {
    this.animate = false;
  }

  this.draw = function() {
    context.fillStyle = this.color;
    context.beginPath();
    context.fillRect(this.x, this.y, this.height, this.width);
    context.fill();
  }

  this.addLaser = function() {
    if (this.lasers.length < this.laserTotal)
      this.lasers.push(new Laser(this.x + this.width / 2, this.y, 10, 10, 10, false));
  }

  this.update = function(keycode) {
    if (!gameOver) {
      if (this.animate) {
        if (keycode === 39 && this.x + this.width + this.dx <= canvas.width)
          this.x += this.dx;
        else if (keycode === 37 && this.x - this.dx >= 0)
          this.x -= this.dx;
      }
      this.draw();

      var removeLasers = [];
      var lasersToRemove = 0;
      for (var i = 0; i < this.lasers.length; i++) {
        this.lasers[i].update();

        if (this.lasers[i].y <= 0) {
          lasersToRemove++;
        }
      }

      for (var i = 0; i < lasersToRemove; i++) {
        this.lasers.shift();
      }
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
    context.fillStyle = this.color;
    context.beginPath();
    context.fillRect(this.x, this.y, this.height, this.width);
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

var gameLoop = function() {
  requestAnimationFrame(gameLoop);
  context.clearRect(0, 0, 600, 600);
  player.update(activeKey);
  enemy.update();
}

player.draw();
enemy.draw();
gameLoop();

var arrowKeyDown = false;
var spaceDown = false;
document.addEventListener("keydown", (event) => {
  if (arrowKeyDown) return;
  arrowKeyDown = true;

  activeKey = event.keyCode;
  player.animateOn();
});
document.addEventListener("keypress", (event) => {
  if (event.keyCode === 32 && spaceDown == false) {
    player.addLaser();
    spaceDown = true;
  }
});
document.addEventListener("keyup", (event) => {
  activeKey = -1;
  player.animateOff();
  arrowKeyDown = false;
  if (event.keyCode === 32) spaceDown = false;
});
