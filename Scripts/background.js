var backgroundCanvas = document.querySelector("#background-canvas");

//make sure canvas is the size of the screen
backgroundCanvas.width = window.screen.width;
backgroundCanvas.height = window.screen.height;

let backgroundContext = backgroundCanvas.getContext("2d");

//draw "Space Invaders" text. to be slightly responsive, move the text to a different location depending on screen size
let drawText = function() {
  backgroundContext.font = "25px 'Press Start 2P', cursive";
  backgroundContext.fillStyle = "white";

  if (window.innerWidth >= 1200) {
    backgroundContext.fillText("SPACE", backgroundCanvas.width - 210, backgroundCanvas.height / 2 - 20);
    backgroundContext.fillText("INVADERS", backgroundCanvas.width - 247, backgroundCanvas.height / 2 + 20);
  }
  else {
    backgroundContext.fillText("SPACE", backgroundCanvas.width / 2 - 60, backgroundCanvas.height - 50);
    backgroundContext.fillText("INVADERS", backgroundCanvas.width / 2 - 97, backgroundCanvas.height - 10);
  }
}

/* Classes */
class Star {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.ogX = x;
    this.y = y;
    this.ogY = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
  }

  //draw star
  draw() {
    backgroundContext.beginPath();
    backgroundContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    backgroundContext.fillStyle = "white";
    backgroundContext.fill();
  }

  //update star's location
  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x <= 0 || this.x >= backgroundCanvas.width || this.y <= 0 || this.y >= backgroundCanvas.height) {
      this.x = this.ogX;
      this.y = this.ogY;
    }

    this.draw();
  }
}

/* Animation logic */
//create all of the stars that will be displayed
let stars = [];
let createStars = function() {
  stars = [];
  for (let i = 0; i < 250; i++) {
    let x = Math.floor(Math.random() * backgroundCanvas.width);
    while (x >= backgroundCanvas.width - 100 || x <= 100) x = Math.floor(Math.random() * backgroundCanvas.width);

    let y = Math.floor(Math.random() * backgroundCanvas.height);
    while (y >= backgroundCanvas.height - 100 || y <= 100) y = Math.floor(Math.random() * backgroundCanvas.height);

    let dx = Math.round(Math.random() * 4) - 2;
    while (dx === 0) dx = Math.round(Math.random() * 2) - 1;

    let dy = Math.round(Math.random() * 4) - 2;
    while (dy === 0) dy = Math.round(Math.random() * 2) - 1;

    let radius = Math.ceil(Math.random() * 3);
    stars.push(new Star(x, y, dx, dy, radius));
  }
}

// update all of the stars
let drawStars = function() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
  }
}

//create background for page
let drawPageBackground = function() {
  backgroundContext.beginPath();
  backgroundContext.rect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  backgroundContext.fillStyle = "black";
  backgroundContext.fill();

  drawStars();
  drawText();
}

//animation loop
let backgroundLoop = function() {
  requestAnimationFrame(backgroundLoop);
  drawPageBackground();
}

/* Begin Animations */
createStars();
backgroundLoop();

/* Event Listeners */
//redraw everything when the screen is resized
window.addEventListener("resize", (event) => {
  backgroundCanvas.width = window.screen.width;
  backgroundCanvas.height = window.screen.height;
  createStars();
  drawPageBackground();
});
