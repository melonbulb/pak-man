// @ts-check
// @ts-ignore
/** @typedef {import("./types.js")} */

import { drawCircle, drawLine } from "./draw.js";
import Map from "./objects/Map.js";
import { calculateDistance, getPosition } from "./utils.js";

const neonPurple =
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-neon-purple-400")
    .trim() || "blue";

const neonPurpleDark =
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-neon-purple-600")
    .trim() || "darkblue";

/**
 * Function to draw a wall with neon purple outline
 * @param {Map} map
 * @param {number} gridX - starting X position using grid coordinate
 * @param {number} gridY - starting Y position using grid coordinate
 * @param {number} gridX2 - ending X position using grid coordinate
 * @param {number} gridY2 - ending Y position using grid coordinate
 */
function drawWall(map, gridX, gridY, gridX2, gridY2) {
  const x = calculateDistance(gridX, map.tileSize);
  const y = calculateDistance(gridY, map.tileSize);
  const width = calculateDistance(gridX2 - gridX, map.tileSize);
  const height = calculateDistance(gridY2 - gridY, map.tileSize);

  if (x < 0 || y < 0) {
    throw new Error("drawWall: must be positive values.");
  }

  if (
    width > map.width ||
    height > map.height ||
    x > map.width ||
    y > map.height
  ) {
    throw new Error("drawWall: exceeds canvas boundaries.");
  }

  for (let i = gridY; i < gridY2; i++) {
    for (let j = gridX; j < gridX2; j++) {
      map.addWall(j, i);
    }
  }

  const ctx = map.ctx;
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = neonPurpleDark;
  ctx.fillRect(x, y, width, height);

  ctx.globalAlpha = 1;
  ctx.lineWidth = 2;
  ctx.strokeStyle = neonPurple;
  ctx.strokeRect(x, y, width, height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = neonPurple;
  ctx.strokeRect(x + 10, y + 10, width - 20, height - 20);
}
/**
 * Draws a cubed wall (3x3 tiles) on the given canvas context.
 * @param {Map} map
 * @param {number} tileX - starting X position using grid coordinate
 * @param {number} tileY - starting Y position using grid coordinate
 */
function drawCubedWall(map, tileX, tileY) {
  drawWall(map, tileX, tileY, tileX + 3, tileY + 3);
}

/**
 * Draws the outer walls on the given canvas context.
 * @param {Map} map
 */
function drawOuterWalls(map) {
  //top wall and boottom wall
  drawWall(map, 1, 0, map.columns - 1, 1);
  drawWall(map, 1, map.rows - 1, map.columns - 1, map.rows);

  //left wall
  drawWall(map, 0, 0, 1, 7);
  drawWall(map, 0, 8, 1, map.rows);
  // left entrance wall
  drawWall(map, 1, 6, 3, 7);
  drawWall(map, 1, 8, 3, 9);

  //right wall
  drawWall(map, map.columns - 1, 0, map.columns, 7);
  drawWall(map, map.columns - 1, 8, map.columns, map.rows);

  // right entrance wall
  drawWall(map, map.columns - 3, 6, map.columns - 1, 7);
  drawWall(map, map.columns - 3, 8, map.columns - 1, 9);
}

/**
 * Draws a grid on the given canvas context.
 * @param {Map} map
 */
function drawGrid(map) {
  const ctx = map.ctx;
  ctx.globalAlpha = 0.2;
  for (let i = 0; i <= map.columns; i++) {
    const x = calculateDistance(i, map.tileSize);
    drawLine(ctx, x, 0, x, map.height, neonPurple);
  }
  for (let j = 0; j <= map.rows; j++) {
    const y = calculateDistance(j, map.tileSize);
    drawLine(ctx, 0, y, map.width, y, neonPurple);
  }
  ctx.globalAlpha = 1;
}

/**
 * Draw and add a power up to map
 * @param {CanvasRenderingContext2D} ctx
 * @param {Map} map
 * @param {GridCoordinate} gridPosition
 */
function drawPowerUp(ctx, map, gridPosition) {
  const added = map.tryToAddPowerUp(gridPosition);
  if (!added) return;
  drawCircle(
    ctx,
    "orange",
    getPosition(gridPosition, map.tileSize),
    map.tileSize * 0.2
  );
}

/**
 * Draw and add food pallets to map
 * @param {CanvasRenderingContext2D} ctx
 * @param {Map} map
 * @returns {number} count of food pallets drawn
 */
function drawFoodPallets(ctx, map) {
  let count = 0;
  for (let column = 0; column < map.columns; column++) {
    for (let row = 0; row < map.rows; row++) {
      if (map.map[row][column] === 2) {
        drawCircle(
          ctx,
          "white",
          getPosition({ x: column, y: row }, map.tileSize),
          map.tileSize * 0.1
        );
        count++;
      }
    }
  }
  return count;
}

/**
 *
 * @param {Map} map
 */
function drawMap(map, includeGrid = false) {
  drawOuterWalls(map);

  // left cubed walls
  drawCubedWall(map, 2, 2); //top
  drawCubedWall(map, 2, 10); //bottom
  drawCubedWall(map, 4, 6); //infront entrance

  // right cubed walls
  drawCubedWall(map, 15, 2); //top
  drawCubedWall(map, 15, 10); //bottom
  drawCubedWall(map, 13, 6); //infront entrance

  // Top U bend shape walls
  drawWall(map, 6, 2, 7, 5);
  drawWall(map, 7, 2, 13, 3);
  drawWall(map, 13, 2, 14, 5);

  //center fist shape walls
  drawCubedWall(map, 9, 4); //center top
  drawWall(map, 8, 4, 9, 7);
  drawWall(map, 8, 8, 12, 9);

  drawWall(map, 6, 10, 8, 13);

  // spawner walls
  drawWall(map, 13, 10, 14, 13);
  drawWall(map, 10, 10, 13, 11);
  drawWall(map, 9, 10, 10, 13);
  drawWall(map, 10, 12, 12, 13);

  includeGrid && drawGrid(map);
}

/**
 * Draws food pellets and power-ups on the map.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Map} map
 */
function drawFoodMap(ctx, map) {
  drawPowerUp(ctx, map, { x: 1, y: 1 });
  drawPowerUp(ctx, map, { x: 1, y: 13 });
  drawPowerUp(ctx, map, { x: 18, y: 1 });
  drawPowerUp(ctx, map, { x: 18, y: 13 });
  drawPowerUp(ctx, map, { x: 9, y: 7 });
  drawPowerUp(ctx, map, { x: 10, y: 9 });
  drawPowerUp(ctx, map, { x: 5, y: 11 });
  drawPowerUp(ctx, map, { x: 14, y: 11 });
  drawPowerUp(ctx, map, { x: 14, y: 3 });

  drawFoodPallets(ctx, map);
}

export { drawMap, drawFoodMap };
