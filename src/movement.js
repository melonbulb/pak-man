// @ts-check

import Sprite from "./objects/Sprite.js";
import { getGridPosition, isTileCenter } from "./utils.js";

/**
 *
 * @param {GameMap} map
 * @param {Direction} direction
 * @param {SpritePosition} currentPosition
 * @returns
 */
function isBlockedByWall(map, direction, currentPosition) {
  if (isTileCenter(currentPosition, map.tileSize) === false) {
    return false;
  }
  const { gridX, gridY } = getGridPosition(currentPosition, map.tileSize);
  switch (direction) {
    case "up":
      return map.map[gridY - 1][gridX] === 1;
    case "down":
      return map.map[gridY + 1][gridX] === 1;
    case "left":
      return map.map[gridY][gridX - 1] === 1;
    case "right":
      return map.map[gridY][gridX + 1] === 1;
    default:
      return false;
  }
}

/**
 *
 * @param {GameMap} map
 * @param {Sprite} sprite
 * @returns
 */
function updatePlayerPosition(map, sprite) {
  tryChangeDirection(map, sprite);
  const currentPosition = sprite.position;
  const direction = sprite.direction;
  const speed = sprite.speed;
  const canvasWidth = map.width;
  const tileSize = map.tileSize;

  switch (direction) {
    case "up":
      if (isBlockedByWall(map, "up", currentPosition) === false) {
        return {
          x: currentPosition.x,
          y: currentPosition.y - speed,
        };
      }
      break;
    case "down":
      if (isBlockedByWall(map, "down", currentPosition) === false) {
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
      if (isBlockedByWall(map, "left", currentPosition) === false) {
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
      if (isBlockedByWall(map, "right", currentPosition) === false) {
        return {
          x: currentPosition.x + speed,
          y: currentPosition.y,
        };
      }
      break;
  }
  return currentPosition;
}

/**
 *
 * @param {GameMap} map
 * @param {Sprite} sprite
 * @returns
 */
function tryChangeDirection(map, sprite) {
  const currentPosition = sprite.position;
  let requestedDirection = sprite.requestedDirection;
  if (requestedDirection === "none") {
    return;
  }
  if (isTileCenter(currentPosition, map.tileSize) === false) {
    return;
  }
  if (isBlockedByWall(map, requestedDirection, currentPosition) === false) {
    sprite.setDirection(requestedDirection);
    sprite.setRequestedDirection("none");
  }
}
export { updatePlayerPosition };
