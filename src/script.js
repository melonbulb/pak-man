// @ts-check

/**
 * @import { Direction, GameRenderObjects } from './types.js';
 */

import { drawFoodMap, drawMap } from "./customMap.js";
import { getPosition } from "./utils/coordinate.js";
import PakMan from "./objects/Pakman.js";
import MapRenderer from "./objects/MapRenderer.js";
import Ghost from "./objects/Ghost.js";
import GameState from "./objects/GameState.js";

const tileSize = 40;
const mapColumns = 20;
const mapRows = 15;

const canvasWidth = tileSize * mapColumns;
const canvasHeight = tileSize * mapRows;

let gameState = new GameState();

const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("pakman")
);

const canvasMap = /** @type {HTMLCanvasElement} */ (
  document.getElementById("pakman-map")
);

const restartButtonElements = document.querySelectorAll("#restart-button");
restartButtonElements.forEach((button) => {
  button.addEventListener("click", () => {
    startGame();
  });
});

const continueButton = document.getElementById("continue-button");
continueButton?.addEventListener("click", () => {
  toggleMessage("paused-message", false);
  gameState.isPaused = false;
});

canvas.width = canvasWidth;
canvas.height = canvasHeight;
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
      gameState.isPaused = false;
      requestedDirection = "up";
      break;
    case "ArrowDown":
      gameState.isPaused = false;
      requestedDirection = "down";
      break;
    case "ArrowLeft":
      gameState.isPaused = false;
      requestedDirection = "left";
      break;
    case "ArrowRight":
      gameState.isPaused = false;
      requestedDirection = "right";
      break;
    case "Escape":
      // requestedDirection = "none";
      if (gameState.canResume() === false) break;
      toggleMessage("paused-message", !gameState.isPaused);
      gameState.isPaused = !gameState.isPaused;
      break;
  }
});
/**
 * Updates the score display in the DOM
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
 * @param {string} element
 */
function toggleMessage(element, show = true) {
  const messageElement = document.getElementById(element);
  if (messageElement) {
    if (show) {
      messageElement.classList.add("show");
    } else {
      messageElement.classList.remove("show");
    }
  }
}

/**
 * Gets the 2D rendering contexts for the game and background canvases
 * @returns {{ gameCtx: CanvasRenderingContext2D, bgCtx: CanvasRenderingContext2D }}
 */
function getCtx() {
  const gameCtx = canvas.getContext("2d");
  const bgCtx = canvasMap.getContext("2d");
  if (!gameCtx || !bgCtx) {
    throw new Error("Could not get canvas context");
  }
  gameCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  bgCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  return { gameCtx, bgCtx };
}

/**
 * Renders the game state on the canvas
 * @param {GameRenderObjects} gameObj
 */
function render(gameObj) {
  const { map, player, ghosts = [] } = gameObj;
  const ctx = map.gameCtx;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawFoodMap(player.map);
  player.draw(ctx);
  gameState.canResume() && player.move(requestedDirection);
  gameState.canResume() && player.eat();
  ghosts.forEach((ghost) => {
    ghost.draw(ctx);
    gameState.canResume() && ghost.move();
  });
}

/**
 * Main game loop
 * @param {GameRenderObjects} gameObj
 */
function gameLoop(gameObj) {
  const { player, ghosts } = gameObj;
  handleScoreUpdate(player.score);
  render(gameObj);
  if (gameState.checkWinCondition(player.map)) {
    toggleMessage("win-message");
    return;
  } else if (ghosts.some((ghost) => player.checkCollision(ghost))) {
    gameState.isGameOver = true;
    toggleMessage("lose-message");
    return;
  } else {
    requestAnimationFrame(() => gameLoop(gameObj));
  }
}

function startGame() {
  toggleMessage("win-message", false);
  toggleMessage("lose-message", false);
  requestedDirection = "none";
  gameState = new GameState();

  const { gameCtx, bgCtx } = getCtx();
  const map = new MapRenderer(bgCtx, gameCtx, mapColumns, mapRows, tileSize);
  drawMap(map, true);
  const player = new PakMan(map, getPosition({ x: 5, y: 1 }, tileSize), 2);
  const ali = new Ghost(
    map,
    getPosition({ x: 5, y: 5 }, tileSize),
    0.5,
    "pink"
  );
  gameLoop({ map, player, ghosts: [ali] });
}

startGame();
