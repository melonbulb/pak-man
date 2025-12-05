// @ts-check

/**
 * @import { Direction, GameRenderObjects } from './types.js';
 */

import { getPosition } from "./utils/coordinate.js";
import PakMan from "./objects/Pakman.js";
import MapRenderer from "./objects/MapRenderer.js";
import Ghost from "./objects/Ghost.js";
import GameState from "./objects/GameState.js";
import { fetchGameState, submitScore } from "./libs/lib-apis.js";

const TILE_SIZE = 40;

const KEY_TO_DIRECTION = /** @type {const} */ ({
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
});

const MESSAGE_IDS = {
  PAUSED: "paused-message",
  WIN: "win-message",
  LOSE: "lose-message",
};

const {
  map: mapConfig,
  player: playerConfig,
  enemies,
  graph,
} = await fetchGameState();
const mapColumns = mapConfig.columns;
const mapRows = mapConfig.rows;

const canvasWidth = TILE_SIZE * mapColumns;
const canvasHeight = TILE_SIZE * mapRows;

/** @type {Direction} */
let requestedDirection = "none";
let gameState = new GameState();

const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("pakman")
);

const canvasMap = /** @type {HTMLCanvasElement} */ (
  document.getElementById("pakman-map")
);

function initializeCanvases() {
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvasMap.width = canvasWidth;
  canvasMap.height = canvasHeight;
  document.documentElement.style.setProperty(
    "--game-width",
    `${canvasWidth}px`
  );
  document.documentElement.style.setProperty(
    "--game-height",
    `${canvasHeight}px`
  );
}

/**
 * Updates the score display in the DOM
 * @param {number} score
 */
function updateScoreDisplay(score) {
  const scoreElement = document.getElementById("score-value");
  if (scoreElement) {
    scoreElement.textContent = score.toString();
  }
}

/**
 * Shows or hides a message element
 * @param {string} elementId
 * @param {boolean} show
 */
function toggleMessage(elementId, show = true) {
  const element = document.getElementById(elementId);
  element?.classList.toggle("show", show);
}

/**
 * Resumes the game if currently paused
 */
function resumeIfPaused() {
  if (gameState.isPaused) {
    gameState.isPaused = false;
    toggleMessage(MESSAGE_IDS.PAUSED, false);
  }
}

/**
 * Toggles the pause state of the game
 */
function togglePause() {
  if (!gameState.isPaused && !gameState.canResume()) return;

  gameState.isPaused = !gameState.isPaused;
  toggleMessage(MESSAGE_IDS.PAUSED, gameState.isPaused);
}

/**
 * Handles keyboard input for game controls
 * @param {KeyboardEvent} e
 */
function handleKeyDown(e) {
  const direction =
    KEY_TO_DIRECTION[/** @type {keyof typeof KEY_TO_DIRECTION} */ (e.key)];

  if (direction) {
    resumeIfPaused();
    requestedDirection = direction;
    return;
  }

  if (e.key === "Escape") {
    togglePause();
  }
}

function setupEventListeners() {
  window.addEventListener("keydown", handleKeyDown);

  document.querySelectorAll("#restart-button").forEach((button) => {
    button.addEventListener("click", () => startGame(playerConfig));
  });

  document.getElementById("continue-button")?.addEventListener("click", () => {
    toggleMessage(MESSAGE_IDS.PAUSED, false);
    gameState.isPaused = false;
  });
}

/**
 * Gets the 2D rendering contexts for the game and background canvases
 * @returns {{ gameCtx: CanvasRenderingContext2D, bgCtx: CanvasRenderingContext2D }}
 */
function getCanvasContexts() {
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
 * Draws all consumables on the map
 * @param {MapRenderer} mapRenderer
 * @param {CanvasRenderingContext2D} ctx
 */
function drawConsumables(mapRenderer, ctx) {
  for (const tile in graph) {
    const [x, y] = tile.split(",").map((coord) => parseInt(coord, 10));
    mapRenderer.drawConsumables(ctx, { x, y });
  }
}

/**
 * Updates player and ghosts if game is active
 * @param {PakMan} player
 * @param {Ghost[]} ghosts
 */
function updateEntities(player, ghosts) {
  if (!gameState.canResume()) return;

  player.move(requestedDirection);
  player.eat();
  ghosts.forEach((ghost) => ghost.move());
}

/**
 * Renders the game state on the canvas
 * @param {GameRenderObjects} gameObj
 */
function render(gameObj) {
  const { map: mapRenderer, player, ghosts = [] } = gameObj;
  const ctx = mapRenderer.gameCtx;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawConsumables(mapRenderer, ctx);

  player.draw(ctx);
  ghosts.forEach((ghost) => ghost.draw(ctx));

  updateEntities(player, ghosts);
}

/**
 * Checks for game-ending conditions
 * @param {PakMan} player
 * @param {Ghost[]} ghosts
 * @returns {boolean} True if game should end
 */
function checkGameEndConditions(player, ghosts) {
  if (gameState.checkWinCondition(player.map.map)) {
    toggleMessage(MESSAGE_IDS.WIN);
    document.getElementById("save-button")?.addEventListener("click", () => {
      const input = /** @type {HTMLInputElement} */ (
        document.getElementById("player-name")
      );
      const playerName = input.value || "Anonymous";

      submitScore(playerName, player.score)
        .then(() => {
          alert("Score for " + playerName + " submitted successfully!");
          startGame(playerConfig);
        })
        .catch(() => {
          alert("Failed to submit score.");
        });
    });
    return true;
  }

  if (ghosts.some((ghost) => player.checkCollision(ghost))) {
    gameState.isGameOver = true;
    toggleMessage(MESSAGE_IDS.LOSE);
    return true;
  }

  return false;
}

/**
 * Main game loop
 * @param {GameRenderObjects} gameObj
 */
function gameLoop(gameObj) {
  const { player, ghosts } = gameObj;

  updateScoreDisplay(player.score);
  render(gameObj);

  if (!checkGameEndConditions(player, ghosts)) {
    requestAnimationFrame(() => gameLoop(gameObj));
  }
}

/**
 * Creates game entities (player and ghosts)
 * @param {MapRenderer} mapRenderer
 * @param {{ spawnPosition: { x: number, y: number } }} playerConfig
 * @returns {{ player: PakMan, ghosts: Ghost[] }}
 */
function createGameEntities(mapRenderer, playerConfig) {
  const playerInstance = new PakMan(
    mapRenderer,
    getPosition(playerConfig.spawnPosition, TILE_SIZE),
    2
  );

  // const ghosts = [
  //   new Ghost(mapRenderer, getPosition({ x: 5, y: 5 }, TILE_SIZE), 0.5, "pink"),
  // ];

  const ghosts = enemies.map((ghostConfig) => {
    return new Ghost(
      mapRenderer,
      getPosition(ghostConfig.spawnPosition, TILE_SIZE),
      0.5,
      ghostConfig.name
    );
  });

  return { player: playerInstance, ghosts };
}

/**
 * Resets game state and UI for a new game
 */
function resetGameState() {
  toggleMessage(MESSAGE_IDS.WIN, false);
  toggleMessage(MESSAGE_IDS.LOSE, false);
  requestedDirection = "none";
  gameState = new GameState();
}

/**
 * Initializes and starts a new game
 * @param {{ spawnPosition: { x: number, y: number } }} playerConfig
 */
function startGame(playerConfig) {
  resetGameState();

  const { gameCtx, bgCtx } = getCanvasContexts();

  const mapRenderer = new MapRenderer(bgCtx, gameCtx, TILE_SIZE, mapConfig);

  mapRenderer.drawWalls(bgCtx);
  mapRenderer.drawGrid(bgCtx);

  const { player: playerInstance, ghosts } = createGameEntities(
    mapRenderer,
    playerConfig
  );

  gameLoop({ map: mapRenderer, player: playerInstance, ghosts });
}

initializeCanvases();
setupEventListeners();
startGame(playerConfig);
