// @ts-check

import { drawMap } from "./map.js";
import { getPosition } from "./utils.js";
import { updatePlayerPosition } from "./movement.js";
import PakMan from "./objects/Pakman.js";

const canvasWidth = 800;
const canvasHeight = 600;
const tileSize = 40;
const spawn = getPosition(5, 1, tileSize);

const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("pakman")
);

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const canvasMap = /** @type {HTMLCanvasElement} */ (
  document.getElementById("pakman-map")
);
canvasMap.width = canvasWidth;
canvasMap.height = canvasHeight;

document.documentElement.style.setProperty("--game-width", `${canvasWidth}px`);
document.documentElement.style.setProperty(
  "--game-height",
  `${canvasHeight}px`
);

/**
 * @type {Direction}
 */
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
      break;
  }
});

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {PakMan} player
 * @param {GameMap} map
 */
function render(ctx, player, map) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  player.draw(ctx, "yellow");
  player.setRequestedDirection(requestedDirection);
  player.setPosition(updatePlayerPosition(map, player));
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {PakMan} player
 * @param {GameMap} map
 */
function gameLoop(ctx, player, map) {
  render(ctx, player, map);
  requestAnimationFrame(() => gameLoop(ctx, player, map));
}

function getCtx() {
  const gameCtx = canvas.getContext("2d");
  const bgCtx = canvasMap.getContext("2d");
  if (!gameCtx || !bgCtx) {
    throw new Error("Could not get canvas context");
  }
  return { gameCtx, bgCtx };
}

function startGame() {
  const { gameCtx, bgCtx } = getCtx();
  const map = drawMap(bgCtx, {
    width: canvasWidth,
    height: canvasHeight,
    tileSize,
    includeGrid: true,
  });
  const player = new PakMan(spawn, 1, tileSize);
  requestAnimationFrame(() => gameLoop(gameCtx, player, map));
}

startGame();
