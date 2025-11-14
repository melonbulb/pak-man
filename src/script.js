import { drawMap } from "./map.js";
import { drawPlayer, getPosition } from "./sprite.js";

const canvasWidth = 800;
const canvasHeight = 600;
const tileSize = 40;
const playerSize = tileSize * 0.8;

const canvas = document.getElementById("pakman");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const ctx = canvas.getContext("2d");

let direction = "none";
const { x: spawnX, y: spawnY } = getPosition(5, 1, tileSize);
const currentPosition = { x: spawnX, y: spawnY };

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
    case "Escape":
      direction = "none";
      break;
  }
});

function updatePlayerPosition() {
  const speed = 2;
  switch (direction) {
    case "up":
      currentPosition.y -= speed;
      break;
    case "down":
      currentPosition.y += speed;
      break;
    case "left":
      currentPosition.x -= speed;
      break;
    case "right":
      currentPosition.x += speed;
      break;
  }
}

function render() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawMap(ctx, { width: canvasWidth, height: canvasHeight, tileSize });
  drawPlayer(ctx, currentPosition.x, currentPosition.y, playerSize, "yellow");
  updatePlayerPosition();
}

function gameLoop() {
  render();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  requestAnimationFrame(gameLoop);
}

startGame();
