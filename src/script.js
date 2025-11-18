// @ts-check
// @ts-ignore

/**
 * @import { Direction } from './types.js';
 */

import { drawFoodMap, drawMap } from "./customMap.js";
import { getPosition } from "./utils/coordinate.js";
import PakMan from "./objects/Pakman.js";
import Map from "./objects/Map.js";
import Sprite from "./objects/Sprite.js";
import MapRenderer from "./objects/MapRenderer.js";
import Ghost from "./objects/Ghost.js";

const canvasWidth = 800;
const canvasHeight = 600;
const tileSize = 40;
const spawn = getPosition({ x: 5, y: 1 }, tileSize);

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
 * @param {number} score
 */
function handleScoreUpdate(score) {
  const scoreElement = document.getElementById("score-value");
  if (scoreElement) {
    scoreElement.textContent = score.toString();
  }
}

/**
 * Updates the status message in the DOM
 * @param {string} message
 */
function updateStatus(message) {
  const winElement = document.getElementById("win");
  if (winElement) {
    winElement.textContent = message;
  }
}

/**
 * Checks if the win condition is met and updates the DOM accordingly.
 * @param {PakMan} player
 * @param {Map} map
 */
function checkWinCondition(player, map) {
  handleScoreUpdate(player.score);
  if (player.foodEaten >= map.numberOfFoodPallets() + map.numberOfPowerUps) {
    updateStatus("You Win!");
    return true;
  }
  return false;
}

/**
 *
 * @param {PakMan} player
 * @param {Array<Ghost>} ghosts
 */
function render(player, ghosts = []) {
  player.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawFoodMap(player.map);
  player.draw();
  player.move(requestedDirection);
  player.eat();
  ghosts.forEach((ghost) => {
    ghost.draw();
    ghost.move();
  });
}

/**
 *
 * @param {PakMan} player
 * @param {Array<Ghost>} ghosts
 */
function gameLoop(player, ghosts = []) {
  render(player, ghosts);
  if (checkWinCondition(player, player.map)) {
    return;
  } else if (ghosts.some((ghost) => player.checkCollision(ghost))) {
    updateStatus("You died!");
    return;
  } else {
    requestAnimationFrame(() => gameLoop(player, ghosts));
  }
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
  const map = new MapRenderer(
    bgCtx,
    gameCtx,
    canvasWidth,
    canvasHeight,
    tileSize
  );
  drawMap(map, true);
  const player = new PakMan(gameCtx, map, spawn, 2);
  const ali = new Ghost(
    gameCtx,
    map,
    getPosition({ x: 5, y: 5 }, tileSize),
    0.1,
    "pink"
  );
  gameLoop(player, [ali]);
}

startGame();
