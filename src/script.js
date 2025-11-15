import { drawMap } from "./map.js";
import { Sprite } from "./Sprite.js";
import { getPosition } from "./utils.js";
import { updatePlayerPosition } from "./movement.js";

const canvasWidth = 800;
const canvasHeight = 600;
const tileSize = 40;

const playerSize = tileSize * 0.8;
const spawn = getPosition(5, 1, tileSize);

const canvas = document.getElementById("pakman");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const canvasMap = document.getElementById("pakman-map");
canvasMap.width = canvasWidth;
canvasMap.height = canvasHeight;

document.documentElement.style.setProperty("--game-width", `${canvasWidth}px`);
document.documentElement.style.setProperty(
  "--game-height",
  `${canvasHeight}px`
);

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

function render(ctx, player, map) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  player.drawPlayer(ctx, "yellow", playerSize);
  player.setRequestedDirection(requestedDirection);
  player.setPosition(updatePlayerPosition(map, player));
}

function gameLoop(ctx, player, map) {
  render(ctx, player, map);
  requestAnimationFrame(() => gameLoop(ctx, player, map));
}

function startGame() {
  const ctx = canvas.getContext("2d");
  const mapCtx = canvasMap.getContext("2d");
  const map = drawMap(mapCtx, {
    width: canvasWidth,
    height: canvasHeight,
    tileSize,
    includeGrid: true,
  });
  const player = new Sprite(spawn, 1, tileSize);
  requestAnimationFrame(() => gameLoop(ctx, player, map));
}

startGame();
