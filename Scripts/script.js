console.log("script loaded");

let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");

let activeKey = 0;
let gameOver = false;
let gunShot = false;
let enemyInterval = 0;

let colorArray = [
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
  this.hit = false;

  this.getY = function() {
    return this.y;
  }

  this.getX = function() {
    return this.x;
  }

  this.getWidth = function() {
    return this.width;
  }

  this.getHeight = function() {
    return this.height;
  }

  this.getHit = function() {
    return this.hit;
  }

  this.setHit = function(hit) {
    this.hit = hit;
  }

  this.setY = function(y) {
    this.y = y;
  }

  this.setX = function(x) {
    this.x = x;
  }

  this.draw = function() {
    context.fillStyle = this.color;
    context.beginPath();
    context.fillRect(this.x, this.y, this.height, this.width);
    context.fill();
  }

  this.update = function() {
      if (!this.enemyLaser) {
        if (this.y > 0)
          this.y -= this.dy;
      }
      else this.y += this.dy;

      if (!this.hit)
        this.draw();
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
  this.lives = 3;

  this.getY = function() {
    return this.y;
  }

  this.getX = function() {
    return this.x;
  }

  this.getWidth = function() {
    return this.width;
  }

  this.getHeight = function() {
    return this.height;
  }

  this.getLasers = function() {
    return this.lasers;
  }

  this.getLives = function() {
    return this.lives;
  }

  this.animateOn = function() {
    this.animate = true;
  }

  this.animateOff = function() {
    this.animate = false;
  }

  this.loseLife = function() {
    this.lives--;
    if (this.lives === 0)
      gameOver = true;
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

      let removeLasers = [];
      let lasersToRemove = 0;
      for (let i = 0; i < this.lasers.length; i++) {
        this.lasers[i].update();

        if (this.lasers[i].getY() <= 0) {
          lasersToRemove++;
        }
      }

      for (let i = 0; i < lasersToRemove; i++) {
        this.lasers.shift();
      }
    }
  }
}

function Enemy(x, y, dx, dy, height, width, shotFreq) {
  this.x = x;
  this.currX = x;
  this.y = y;
  this.currY = y;
  this.dx = dx;
  this.dy = dy;
  this.width = width;
  this.height = height;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  this.frame = 0;
  this.hit = false;
  this.lasers = [];
  this.laserTotal = 4;
  this.shotFreq = shotFreq;

  this.getY = function() {
    return this.y;
  }

  this.getX = function() {
    return this.x;
  }

  this.getWidth = function() {
    return this.width;
  }

  this.getHeight = function() {
    return this.height;
  }

  this.getLasers = function() {
    return this.lasers;
  }

  this.setHit = function(hit) {
    this.hit = hit;
  }

  this.clear = function() {
    this.hit = true;
    this.x = -500;
    this.y = -500;
  }

  this.addLaser = function() {
    if (this.lasers.length < this.laserTotal)
      this.lasers.push(new Laser(this.x + this.width / 2, this.y, 7, 10, 10, true));
  }

  this.draw = function() {
    context.fillStyle = this.color;
    context.beginPath();
    context.fillRect(this.x, this.y, this.height, this.width);
    context.fill();
  }

  this.update = function() {
    if (!gameOver && !this.hit) {
      this.x += this.dx;

      if (this.x + this.width >= canvas.width || this.x <= 0) {
        this.dx = -this.dx;
        this.y += this.dy;
      }

      this.frame++;
      if (this.frame === this.shotFreq) {
        this.frame = 0;
        this.addLaser();
      }

      let lasersToRemove = 0;
      for (let i = 0; i < this.lasers.length; i++) {
        this.lasers[i].update();

        if (this.lasers[i].getY() >= canvas.height) {
          lasersToRemove++;
        }
      }

      for (let i = 0; i < lasersToRemove; i++) {
        this.lasers.shift();
      }

      if (this.y > canvas.height - (this.height * 2)) gameOver = true;

      this.draw();
    }
  }
}

let player, enemy;
let init = function() {
  player = new Player(0, 10, 50, 50);
  enemy = new Enemy(0, 0, 5, 25, 50, 50, 109);

  player.draw();
  enemy.draw();
}

let getDistance = function(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}

function laserHitCheck() {
  let playerLasers = player.getLasers();
  let enemyLasers = enemy.getLasers();

  for (let i = 0; i < playerLasers.length; i++) {
    if (playerLasers[i].getX() >= enemy.getX() && playerLasers[i].getX() + playerLasers[i].getWidth() <= enemy.getX() + enemy.getWidth() &&
        playerLasers[i].getY() >= enemy.getY() && playerLasers[i].getY() + playerLasers[i].getHeight() <= enemy.getY() + enemy.getHeight()) {
      playerLasers[i].setHit(true);
      enemy.clear();
    }
  }

  for (let i = 0; i < enemyLasers.length; i++) {
    if (enemyLasers[i].getX() >= player.getX() && enemyLasers[i].getX() + enemyLasers[i].getWidth() <= player.getX() + player.getWidth() &&
      enemyLasers[i].getY() >= player.getY() && enemyLasers[i].getY() + enemyLasers[i].getHeight() <= player.getY() + player.getHeight()) {
        enemyLasers[i].setHit(true);
        enemyLasers[i].setX(-500);
        enemyLasers[i].setY(-500);

        player.loseLife();
    }
  }
}

let gameLoop = function() {
  requestAnimationFrame(gameLoop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.update(activeKey);
  enemy.update();
  laserHitCheck();
}

init();
gameLoop();

let arrowKeyDown = false;
let spaceDown = false;
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
