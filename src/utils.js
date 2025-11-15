// @ts-check

/**
 * Covert grid coordinates to pixel coordinates
 * @param {GridCoordinate} gridPosition
 * @param {number} gridSize
 * @returns {PixelCoordinate} Coordinate to the center of the position grid
 */
function getPosition(gridPosition, gridSize) {
  const { x, y } = gridPosition;
  return {
    x: x * gridSize + gridSize / 2,
    y: y * gridSize + gridSize / 2,
  };
}

/**
 *
 * @param {PixelCoordinate} coordinateObj
 * @param {number} gridSize
 * @returns {GridCoordinate}
 */
function getGridPosition(coordinateObj, gridSize) {
  return {
    x: Math.floor(coordinateObj.x / gridSize),
    y: Math.floor(coordinateObj.y / gridSize),
  };
}

/**
 *
 * @param {PixelCoordinate} coordinateObj
 * @param {number} gridSize
 * @returns
 */
function isTileCenter(coordinateObj, gridSize) {
  const gridPosition = getGridPosition(coordinateObj, gridSize);
  const { x: centerX, y: centerY } = getPosition(gridPosition, gridSize);
  return coordinateObj.x === centerX && coordinateObj.y === centerY;
}

/**
 * Calculate distance from origin to start of grid position
 * @param {number} gridPosition
 * @param {number} gridSize
 * @returns
 */
function calculateDistance(gridPosition, gridSize) {
  return gridPosition * gridSize;
}

export { getPosition, getGridPosition, isTileCenter, calculateDistance };
