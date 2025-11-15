import { getGridPosition, isTileCenter } from "./utils.js";

function isBlockedByWall(map, direction, currentPosition, tileSize) {
  if (isTileCenter(currentPosition, tileSize) === false) {
    return false;
  }
  const { gridX, gridY } = getGridPosition(
    currentPosition.x,
    currentPosition.y,
    tileSize
  );
  switch (direction) {
    case "up":
      return map[gridY - 1][gridX] === 1;
    case "down":
      return map[gridY + 1][gridX] === 1;
    case "left":
      return map[gridY][gridX - 1] === 1;
    case "right":
      return map[gridY][gridX + 1] === 1;
    default:
      return false;
  }
}

function updatePlayerPosition(map, sprite, tileSize, canvasWidth) {
  tryChangeDirection(map, sprite, tileSize);
  const currentPosition = sprite.position;
  const direction = sprite.direction;
  const speed = sprite.speed;
  switch (direction) {
    case "up":
      if (isBlockedByWall(map, "up", currentPosition, tileSize) === false) {
        return {
          x: currentPosition.x,
          y: currentPosition.y - speed,
        };
      }
      break;
    case "down":
      if (isBlockedByWall(map, "down", currentPosition, tileSize) === false) {
        return {
          x: currentPosition.x,
          y: currentPosition.y + speed,
        };
      }
      break;
    case "left":
      if (currentPosition.x < -tileSize / 2) {
        return { x: canvasWidth + tileSize / 2, y: currentPosition.y };
      }
      if (isBlockedByWall(map, "left", currentPosition, tileSize) === false) {
        return {
          x: currentPosition.x - speed,
          y: currentPosition.y,
        };
      }
      break;
    case "right":
      if (currentPosition.x > canvasWidth + tileSize / 2) {
        return { x: -tileSize / 2, y: currentPosition.y };
      }
      if (isBlockedByWall(map, "right", currentPosition, tileSize) === false) {
        return {
          x: currentPosition.x + speed,
          y: currentPosition.y,
        };
      }
      break;
  }
  return currentPosition;
}

function tryChangeDirection(map, sprite, tileSize) {
  const currentPosition = sprite.position;
  let requestedDirection = sprite.requestedDirection;
  if (requestedDirection === "none") {
    return;
  }
  if (isTileCenter(currentPosition, tileSize) === false) {
    return;
  }
  if (
    isBlockedByWall(map, requestedDirection, currentPosition, tileSize) ===
    false
  ) {
    sprite.setDirection(requestedDirection);
    sprite.setRequestedDirection("none");
  }
}
export { updatePlayerPosition };
