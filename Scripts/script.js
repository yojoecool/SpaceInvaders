console.log("script loaded");

let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");

let spriteSheet = "Images/invaders.gif";

let ded = "  _____" + "\n" +
" /     \\" + "\n" +
"| () () |" + "\n" +
" \\  ^  /" + "\n" +
"  |||||" + "\n" +
"  |||||" + "\n";

let colorArray = [
  "#124e78",
  "#f0f0c9",
  "#f2bb05",
  "#d74e09",
  "#6e0e0a"
];

let enemySprites = [
  {
    char: "SmaInv",
    x1: 312,
    y1: 14,
    x2: 428,
    y2: 14,
    height: 80,
    width: 80,
    animate: 35,
    hits: 1
  },
  {
    char: "MedInv",
    x1: 19,
    y1: 14,
    x2: 165,
    y2: 14,
    height: 80,
    width: 110,
    animate: 70,
    hits: 2
  },
  {
    char: "LarInv",
    x1: 19,
    y1: 134,
    x2: 160,
    y2: 134,
    height: 80,
    width: 120,
    animate: 100,
    hits: 3
  },
];

let activeKey = 0;
let gameOver = false;
let moveDownNextTick = false;
let gameStart = false;
let score = 0;
let numOfEnemies = 0;
let level = 1;

let drawBackground = function() {
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fill();
}

class GamePiece {
  constructor(x, y, dx, dy, width, height, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  getY() {
    return this.y;
  }

  getDy() {
    return this.dy;
  }

  getX() {
    return this.x;
  }

  getDx() {
    return this.dx;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  setY(y) {
    this.y = y;
  }

  setX(x) {
    this.x = x;
  }

  setDx(dx) {
    this.dx = dx;
  }

  setDy(dy) {
    this.dy = dy;
  }

  draw() {
    context.fillStyle = this.color;
    context.beginPath();
    context.fillRect(this.x, this.y, this.height, this.width);
    context.fill();
  }
}

class Character extends GamePiece {
  constructor(x, y, dx, dy, width, height, color, laserTotal, enemy, bulletSpeed, imgSrc = "", srcX = 0, srcY = 0, srcWidth = 0, srcHeight = 0) {
    super(x, y, dx, dy, width, height, color);

    this.laserTotal = laserTotal;
    this.lasers = [];
    this.enemy = enemy;
    this.bulletSpeed = bulletSpeed;
    this.sprite = null;
    if (imgSrc != "") {
      this.sprite = new Image();
      this.sprite.src = imgSrc;
    }
    this.srcX = srcX;
    this.srcY = srcY;
    this.srcWidth = srcWidth;
    this.srcHeight = srcHeight;
    this.lives = 0;
  }

  setSrcX(srcX) {
    this.srcX = srcX;
  }

  setSrcY(srcY) {
    this.srcY = srcY;
  }

  setSrcWidth(srcWidth) {
    this.srcWidth = srcWidth;
  }

  setSrcHeight(srcHeight) {
    this.srcHeight = srcHeight;
  }

  getLasers() {
    return this.lasers;
  }

  getLives() {
    return this.lives;
  }

  setLives(lives) {
    this.lives = lives;
  }

  addLaser() {
    if (this.lasers.length < this.laserTotal)
      this.lasers.push(new Laser(Math.floor(this.x + this.width / 2) - 5, this.y, this.bulletSpeed, 10, 10, this.enemy));
  }

  removeLasers() {
    let removeLasers = [];
    let lasersToRemove = 0;
    for (let i = 0; i < this.lasers.length; i++) {
      this.lasers[i].update();

      if ((!this.enemy && this.lasers[i].getY() <= 50) ||
          (this.enemy && this.lasers[i].getY() >= canvas.height)) {

        lasersToRemove++;
      }
    }

    for (let i = 0; i < lasersToRemove; i++) {
      this.lasers.shift();
    }
  }

  draw() {
    if (this.sprite === null) {
      super.draw();
    }
    else {
      context.drawImage(this.sprite, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.x, this.y, this.width, this.height);
    }
  }
}

class Laser extends GamePiece {
  constructor(x, y, dy, width, height, enemyLaser) {
    super(x, y, 0, dy, width, height, '#ff0000');
    this.enemyLaser = enemyLaser;
    this.hit = false;
  }

  getHit() {
    return this.hit;
  }

  setHit(hit) {
    this.hit = hit;
  }

  update() {
      if (!this.enemyLaser) {
        if (this.y > 0)
          this.y -= this.dy;
      }
      else this.y += this.dy;

      if (!this.hit)
        this.draw();
  }
}

class Player extends Character {
  constructor(x, dx, width, height, imgSrc = "", srcX = 0, srcY = 0, srcWidth = 0, srcHeight = 0) {
    let color = colorArray[Math.floor(Math.random() * colorArray.length)];
    let y = canvas.height - height;

    super(x, y, dx, 0, width, height, color, 2, false, 12, imgSrc, srcX, srcY, srcWidth, srcHeight);

    this.animate = false;
    this.lives = 5;
  }

  animateOn() {
    this.animate = true;
  }

  animateOff() {
    this.animate = false;
  }

  loseLife() {
    console.log("You've been hit!");
    this.lives--;
    if (this.lives === 0) {
      console.log(ded);
      gameOver = true;
    }
  }

  update(keycode) {
    if (!gameOver) {
      if (this.animate) {
        if (keycode === 39 && this.x + this.width + this.dx <= canvas.width)
          this.x += this.dx;
        else if (keycode === 37 && this.x - this.dx >= 0)
          this.x -= this.dx;
      }
      this.draw();

      this.removeLasers();
    }
  }
}

class Enemy extends Character {
  constructor(x, y, dx, dy, width, height, shotFreq, imgSrc = "", enemyType = 0) {
    let color = colorArray[Math.floor(Math.random() * colorArray.length)];
    let spriteInfo = enemySprites[enemyType];

    let srcX = spriteInfo.x1;
    let srcY = spriteInfo.y1;
    let srcWidth = spriteInfo.width;
    let srcHeight = spriteInfo.height;

    super(x, y, dx, dy, width, height, color, 4, true, 7, imgSrc, srcX, srcY, srcWidth, srcHeight);

    this.enemyType = enemyType;
    this.shotFrame = 0;
    this.hit = false;
    this.shotFreq = shotFreq;
    this.animationFrame = 0;
    this.animationFreq = enemySprites[enemyType].animate;
    this.firstAniFrame = true;
    this.spriteInfo = spriteInfo;
    this.lives = enemyType + 1 > level ? level : enemyType + 1;
  }

  setHit(hit) {
    this.hit = hit;
  }

  getEnemyType() {
    return this.enemyType;
  }

  clear() {
    this.lives--;
    if (this.lives === 0) {
      this.hit = true;
      this.x = -500;
      this.y = -500;
      numOfEnemies--;
    }
  }

  update() {
    if (!gameOver && !this.hit) {
      this.x += this.dx;

      if ((this.x + this.width >= canvas.width || this.x <= 0)) {
        moveDownNextTick = true;
      }

      this.shotFrame++;
      if (this.shotFrame === this.shotFreq) {
        this.shotFrame = 0;
        this.addLaser();
      }

      this.animationFrame++;
      if (this.animationFrame === this.animationFreq) {
        this.srcWidth = this.spriteInfo.width;
        this.srcHeight = this.spriteInfo.height;

        if (this.firstAniFrame) {
          this.srcX = this.spriteInfo.x2;
          this.srcY = this.spriteInfo.y2;
          this.firstAniFrame = false;
        }
        else {
          this.srcX = this.spriteInfo.x1;
          this.srcY = this.spriteInfo.y1;
          this.firstAniFrame = true;
        }

        this.animationFrame = 0
      }

      this.removeLasers();

      if (this.y > canvas.height - (this.height * 2)) {
        gameOver = true;
        player.setLives(0);
        console.log(ded);
      }

      this.draw();
    }
  }
}

let player;
let enemies = [];
let levels = [];
let enemyWidth = 38;
let enemyHeight = 32;

let createEnemies = function(speed) {
  numOfEnemies = 0;
  enemies = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      let enemyType = j % 3;
      let fireRate = Math.floor(Math.random() * 1000) + 250;
      let x = i * (2 * enemyWidth);
      let y = j * (1.5 * enemyHeight) + 55;

      enemies.push(new Enemy(x, y, speed, 23, enemyWidth, enemyHeight, fireRate, spriteSheet, enemyType));
      numOfEnemies++;
    }
  }
}

let level1 = function() {
  level = 1;
  let speed = 2;
  createEnemies(speed);
}

let level2 = function() {
  level = 2;
  let speed = 3;
  createEnemies(speed);
}

let level3 = function() {
  level = 3;
  let speed = 4;
  createEnemies(speed);
}

levels.push(level1);
levels.push(level2);
levels.push(level3);

let init = function() {
  levels[0]();
  level = 1;
  score = 0;
  player = new Player((canvas.width / 2) - 25, 10, 55, 40, spriteSheet, 150, 637, 73, 53);
}

let laserHitCheck = function() {
  let playerLasers = player.getLasers();
  let enemyLasers = [];

  for (let i = 0; i < enemies.length; i++) {
    enemyLasers = enemyLasers.concat(enemies[i].getLasers());
  }

  for (let i = 0; i < playerLasers.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (playerLasers[i].getX() >= enemies[j].getX() && playerLasers[i].getX() + playerLasers[i].getWidth() <= enemies[j].getX() + enemies[j].getWidth() &&
          playerLasers[i].getY() >= enemies[j].getY() && playerLasers[i].getY() + playerLasers[i].getHeight() <= enemies[j].getY() + enemies[j].getHeight()) {
        playerLasers[i].setHit(true);
        playerLasers[i].setX(-500);

        score += 100;
        enemies[j].clear();
      }
    }
  }

  for (let i = 0; i < enemyLasers.length; i++) {
    if (enemyLasers[i].getX() >= player.getX() && enemyLasers[i].getX() + enemyLasers[i].getWidth() <= player.getX() + player.getWidth() &&
      enemyLasers[i].getY() >= player.getY() && enemyLasers[i].getY() + enemyLasers[i].getHeight() <= player.getY() + player.getHeight()) {
        enemyLasers[i].setHit(true);
        enemyLasers[i].setX(-500);

        score -= 1100;
        player.loseLife();
    }
  }
}

function moveAllEnemiesDownCheck() {
  if (moveDownNextTick) {
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].setY(enemies[i].getY() + enemies[i].getDy());
      enemies[i].setDx(enemies[i].getDx() * -1);
    }
    moveDownNextTick = false;
  }
}

var flash = true;
let drawStart = function() {
  drawBackground();
  if (flash) {
    context.font = "30px 'Press Start 2P', cursive";
    context.fillStyle = "white";
    context.fillText("Press Enter To Start", 95, canvas.height / 2);
    flash = false;
  }
  else flash = true;
}

let drawRestart = function() {
  context.font = "15px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText("Press Enter to restart game", canvas.width / 2 - 200, canvas.height / 2 + 100);
}

let life = new Image();
life.src = spriteSheet;
let drawLives = function() {
  context.beginPath();
  context.moveTo(0, 45);
  context.lineTo(canvas.width, 45);
  context.strokeStyle = "white";
  context.stroke();

  context.font = "15px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText("Lives", canvas.width - 350, 31);

  for (let i = 0; i < player.getLives(); i++) {
    context.drawImage(life, 150, 637, 73, 53, canvas.width - 250 + (i * 50), 8, 30, 25);
  }
}

let drawScore = function() {
  context.font = "15px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText(`Score: ${score}`, 30, 30);
}

let drawNextLevel = function() {
  let levelDisplayed = level + 1;
  context.font = "30px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText(`Level ${levelDisplayed}`, canvas.width / 2 - 110, canvas.height / 2);
}

let youWin = function() {
  context.font = "40px 'Press Start 2P', cursive";
  context.fillStyle = "white";
  context.fillText("You Win!!!", canvas.width / 2 - 190, canvas.height / 2);
  drawRestart();
}

let checkGameOver = function() {
  if (gameOver) {
    context.font = "40px 'Press Start 2P', cursive";
    context.fillStyle = "white";
    context.fillText("Game Over", canvas.width / 2 - 175, canvas.height / 2);
    drawRestart();
  }
}

let nextLevelDelay = 0;
let endOfLevelCheck = function() {
  if (numOfEnemies === 0) {
    if (level < levels.length) {
      nextLevelDelay++;
      if (nextLevelDelay === 250) {
        level++;
        nextLevelDelay = 0;
        levels[level - 1]();
      }
      else drawNextLevel();
    }
    else {
      youWin();
    }
  }
}

let gameLoop = function() {
  requestAnimationFrame(gameLoop);
  drawBackground();
  player.update(activeKey);
  moveAllEnemiesDownCheck();
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
  }
  laserHitCheck();
  drawScore();
  drawLives();
  endOfLevelCheck();
  checkGameOver();
}


// Before starting game
drawStart();
var preStart = setInterval(drawStart, 400);


// Listener Events
let arrowKeyDown = false;
let spaceDown = false;
document.addEventListener("keydown", (event) => {
  if (arrowKeyDown) return;
  arrowKeyDown = true;

  activeKey = event.keyCode;
  if (player != undefined) player.animateOn();
});

document.addEventListener("keypress", (event) => {
  if (event.keyCode === 32 && spaceDown == false && player != undefined) {
    player.addLaser();
    spaceDown = true;
  }
  else if (event.keyCode === 13) {
    if (!gameStart) {
      clearInterval(preStart);
      init();
      gameLoop();
      gameStart = true;
    }
    else if (gameOver || level >= levels.length) {
      gameOver = false;
      init();
    }
  }
});

document.addEventListener("keyup", (event) => {
  activeKey = -1;
  if (player != undefined) player.animateOff();
  arrowKeyDown = false;
  if (event.keyCode === 32) spaceDown = false;
});
