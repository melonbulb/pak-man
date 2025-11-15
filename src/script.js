import { drawMap } from "./map.js";
import { Sprite } from "./Sprite.js";
import { getPosition } from "./utils.js";
import { updatePlayerPosition } from "./movement.js";

const canvasWidth = 800;
const canvasHeight = 600;
const tileSize = 40;

const playerSize = tileSize * 0.8;
const speed = 1;
const spawn = getPosition(5, 1, tileSize);

const canvas = document.getElementById("pakman");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let requestedDirection = "none";

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      requestedDirection = "up";
      break;
    case "ArrowDown":
      requestedDirection = "down";
      break;
    case "ArrowLeft":
      requestedDirection = "left";
      break;
    case "ArrowRight":
      requestedDirection = "right";
      break;
    case "Escape":
      requestedDirection = "none";
      direction = "none";
      break;
  }
});

function render(ctx, sprite) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const map = drawMap(ctx, {
    width: canvasWidth,
    height: canvasHeight,
    tileSize,
    includeGrid: true,
  });
  sprite.drawPlayer(ctx, "yellow", playerSize);
  sprite.setRequestedDirection(requestedDirection);
  sprite.setPosition(updatePlayerPosition(map, sprite, tileSize, canvasWidth));
}

function gameLoop(ctx, sprite) {
  render(ctx, sprite);
  requestAnimationFrame(() => gameLoop(ctx, sprite));
}

function startGame() {
  const ctx = canvas.getContext("2d");
  const sprite = new Sprite(spawn, 1);
  requestAnimationFrame(() => gameLoop(ctx, sprite));
}

startGame();
