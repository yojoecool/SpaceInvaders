var backgroundCanvas = document.querySelector("#background-canvas");
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

let backgroundContext = backgroundCanvas.getContext("2d");

let drawText = function() {
  backgroundContext.font = "30px 'Press Start 2P', cursive";
  backgroundContext.fillStyle = "white";
  backgroundContext.fillText("SPACE", backgroundCanvas.width - 235, backgroundCanvas.height / 2 - 25);
  backgroundContext.fillText("INVADERS", backgroundCanvas.width - 280, backgroundCanvas.height / 2 + 25);
}

let drawPageBackground = function() {
  backgroundContext.beginPath();
  backgroundContext.rect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  backgroundContext.fillStyle = "black";
  backgroundContext.fill();

  drawText();
}

drawPageBackground();

window.addEventListener("resize", (event) => {
  backgroundCanvas.width = window.innerWidth;
  backgroundCanvas.height = window.innerHeight;
  drawPageBackground();
});
