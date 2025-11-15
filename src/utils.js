// Covert grid coordinates to pixel coordinates (center of tile)
function getPosition(tileX, tileY, tileSize) {
  return {
    x: tileX * tileSize + tileSize / 2,
    y: tileY * tileSize + tileSize / 2,
  };
}

// Covert pixel coordinates to grid coordinates
function getGridPosition(x, y, tileSize) {
  return {
    gridX: Math.floor(x / tileSize),
    gridY: Math.floor(y / tileSize),
  };
}

function isTileCenter(position, tileSize) {
  const { gridX, gridY } = getGridPosition(position.x, position.y, tileSize);
  const centerX = gridX * tileSize + tileSize / 2;
  const centerY = gridY * tileSize + tileSize / 2;
  return position.x === centerX && position.y === centerY;
}

export { getPosition, getGridPosition, isTileCenter };
