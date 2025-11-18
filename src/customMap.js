// @ts-check

import MapRenderer from "./objects/MapRenderer.js";
/**
 * Draws a cubed wall (3x3 tiles) on the given canvas context.
 * @param {MapRenderer} map
 * @param {number} tileX - starting X position using grid coordinate
 * @param {number} tileY - starting Y position using grid coordinate
 */
function drawCubedWall(map, tileX, tileY) {
  map.drawWall(tileX, tileY, tileX + 3, tileY + 3);
}

/**
 * Draws the outer walls on the given canvas context.
 * @param {MapRenderer} map
 */
function drawOuterWalls(map) {
  //top wall and boottom wall
  map.drawWall(1, 0, map.columns - 1, 1);
  map.drawWall(1, map.rows - 1, map.columns - 1, map.rows);

  //left wall
  map.drawWall(0, 0, 1, 7);
  map.drawWall(0, 8, 1, map.rows);
  // left entrance wall
  map.drawWall(1, 6, 3, 7);
  map.drawWall(1, 8, 3, 9);
  //right wall
  map.drawWall(map.columns - 1, 0, map.columns, 7);
  map.drawWall(map.columns - 1, 8, map.columns, map.rows);

  // right entrance wall
  map.drawWall(map.columns - 3, 6, map.columns - 1, 7);
  map.drawWall(map.columns - 3, 8, map.columns - 1, 9);
}

/**
 *
 * @param {MapRenderer} map
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
  map.drawWall(6, 2, 7, 5);
  map.drawWall(7, 2, 13, 3);
  map.drawWall(13, 2, 14, 5);

  //center fist shape walls
  drawCubedWall(map, 9, 4); //center top
  map.drawWall(8, 4, 9, 7);
  map.drawWall(8, 8, 12, 9);

  map.drawWall(6, 10, 8, 13);

  // spawner walls
  map.drawWall(13, 10, 14, 13);
  map.drawWall(10, 10, 13, 11);
  map.drawWall(9, 10, 10, 13);
  map.drawWall(10, 12, 12, 13);

  includeGrid && map.drawGrid();
}

/**
 * Draws food pellets and power-ups on the map.
 * @param {MapRenderer} map
 */
function drawFoodMap(map) {
  map.drawPowerUp(map.gameCtx, { x: 1, y: 1 });
  map.drawPowerUp(map.gameCtx, { x: 1, y: 13 });
  map.drawPowerUp(map.gameCtx, { x: 18, y: 1 });
  map.drawPowerUp(map.gameCtx, { x: 18, y: 13 });
  map.drawPowerUp(map.gameCtx, { x: 9, y: 7 });
  map.drawPowerUp(map.gameCtx, { x: 10, y: 9 });
  map.drawPowerUp(map.gameCtx, { x: 5, y: 11 });
  map.drawPowerUp(map.gameCtx, { x: 14, y: 11 });
  map.drawPowerUp(map.gameCtx, { x: 14, y: 3 });

  map.drawFoodPallets(map.gameCtx);
}

export { drawMap, drawFoodMap };
