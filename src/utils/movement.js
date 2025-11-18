// @ts-check

/**
 * @import { Direction, PixelCoordinate } from '../types.js';
 */

import Map from "../objects/Map.js";
import Sprite from "../objects/Sprite.js";
import { getGridPosition, isTileCenter } from "./coordinate.js";

/**
 * Checks if there is a wall blocking the path in the direction
 * @param {{map: Map, direction: Direction, position: PixelCoordinate}} sprite
 * @returns
 */
function isBlockedByWall(sprite) {
  const { map, direction, position } = sprite;
  if (isTileCenter(position, map.tileSize) === false) {
    return false;
  }
  const { x: gridX, y: gridY } = getGridPosition(position, map.tileSize);
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
 * Handles the sprite walking off the map and wraps it around.
 * @param {Sprite} sprite
 */
function handleWalkingOffMap(sprite) {
  const { position, map, direction } = sprite;
  const { tileSize } = map;
  switch (direction) {
    case "down":
      if (position.y > map.height + tileSize / 2) {
        sprite.setPosition({ x: position.x, y: -tileSize / 2 });
      }
      break;
    case "up":
      if (position.y < -tileSize / 2) {
        sprite.setPosition({ x: position.x, y: map.height + tileSize / 2 });
      }
      break;
    case "left":
      if (position.x < -tileSize / 2) {
        sprite.setPosition({ x: map.width + tileSize / 2, y: position.y });
      }
      break;
    case "right":
      if (position.x > map.width + tileSize / 2) {
        sprite.setPosition({ x: -tileSize / 2, y: position.y });
      }
      break;
  }
}

/**
 * Changes the sprite direction when conditions are met:
 * - sprite is at the tile center
 * - sprite is not blocked by wall
 * @param {Sprite} sprite
 * @param {Direction} requestedDirection
 */
function tryChangeDirection(sprite, requestedDirection) {
  const { map, position } = sprite;
  if (requestedDirection === "none") {
    return;
  }
  if (isTileCenter(position, map.tileSize) === false) {
    return;
  }
  if (
    isBlockedByWall({
      map,
      direction: requestedDirection,
      position,
    }) === false
  ) {
    sprite.setDirection(requestedDirection);
  }
}

/**
 * Checks possible directions the sprite can move to
 * @param {Sprite} sprite
 * @returns {Array<Direction>} directions
 */
function checkPossibleDirections(sprite) {
  const { map, position } = sprite;
  if (isTileCenter(position, map.tileSize) === false) {
    return [];
  }
  const availableDirections = /**@type {Array<Direction>}*/ ([
    "up",
    "down",
    "left",
    "right",
    "none",
  ]);
  const possibleDirections = availableDirections.filter((dir) => {
    return (
      isBlockedByWall({
        map,
        direction: /**@type {Direction} */ (dir),
        position,
      }) === false
    );
  });

  return possibleDirections;
}

/**
 * Gets a random direction from possible directions
 * @param {Array<Direction>} possibleDirections
 * @returns {Direction}
 */
function getRandomDirection(possibleDirections) {
  if (possibleDirections.length === 0) {
    return "none";
  }
  const randomIndex = Math.floor(Math.random() * possibleDirections.length);
  return possibleDirections[randomIndex];
}

export {
  isBlockedByWall,
  tryChangeDirection,
  handleWalkingOffMap,
  checkPossibleDirections,
  getRandomDirection,
};
