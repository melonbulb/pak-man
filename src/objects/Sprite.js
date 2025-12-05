// @ts-check

/**
 * @import { PixelCoordinate, Direction } from '../types.js';
 */

import {
  getGridPosition,
  getPosition,
  isTileCenter,
} from "../utils/coordinate.js";
import MapRenderer from "./MapRenderer.js";

/**
 * Direction vectors for movement calculations
 * @type {{[key in Direction]: {x: number, y: number}}}
 */
const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Represents a generic sprite in the game.
 */
class Sprite {
  /**
   * Initialize new Sprite
   * @param {MapRenderer} map
   * @param {PixelCoordinate} position
   * @param {number} speed
   */
  constructor(map, position, speed) {
    this.map = map;
    this.position = { x: 0, y: 0 };
    this.gridPosition = { x: 0, y: 0 };
    this.setPosition(position);
    this.direction = /** @type {Direction} */ ("none");
    this.requestedDirection = /** @type {Direction} */ ("none");
    this.speed = speed;
    this.baseSpeed = speed;
    this.activeBooster = 0;
  }

  /**
   * Updates the pixel and grid position based on the given pixel position.
   * @param {PixelCoordinate} position
   */
  setPosition(position) {
    this.position = position;
    this.gridPosition = getGridPosition(position, this.map.map.tileSize);
  }

  /**
   * Sets the current direction for the sprite.
   * @param {Direction} direction
   */
  setDirection(direction) {
    this.direction = direction;
  }

  /**
   * Moves sprite based on sprite current direction
   * @param {Direction} [requestedDirection] The requested direction to change to
   */
  move(requestedDirection) {
    if (requestedDirection) {
      this.tryChangeDirection(requestedDirection);
    }

    if (this.activeBooster === 0) {
      this.speed = this.baseSpeed;
    }

    if (this.direction === "none") {
      return;
    }

    // Align to center of tile perpendicular to movement direction
    this.alignToTileCenter();

    // If at tile center and wall ahead, stop moving
    const tileSize = this.map.map.tileSize;
    if (isTileCenter(this.position, tileSize) && this.isWallAhead()) {
      this.setDirection("none");
      return;
    }

    // Move in current direction, clamping to tile center if blocked
    const vector = DIRECTION_VECTORS[this.direction];
    const currentCenter = getPosition(this.gridPosition, tileSize);

    // Calculate the next position
    let nextX = this.position.x + vector.x * this.speed;
    let nextY = this.position.y + vector.y * this.speed;

    // Check if we would cross or reach the next tile center
    const nextGridPos = getGridPosition({ x: nextX, y: nextY }, tileSize);
    const crossedTile =
      nextGridPos.x !== this.gridPosition.x ||
      nextGridPos.y !== this.gridPosition.y;

    if (crossedTile && this.isWallAhead()) {
      // Stop at current tile center and stop moving
      nextX = currentCenter.x;
      nextY = currentCenter.y;
      this.position.x = nextX;
      this.position.y = nextY;
      this.setPosition(this.position);
      this.setDirection("none");
      return;
    }

    this.position.x = nextX;
    this.position.y = nextY;
    this.setPosition(this.position);
    this.handleWalkingOffMap();
  }

  /**
   * Aligns the sprite to the center of the tile perpendicular to movement
   */
  alignToTileCenter() {
    const tileSize = this.map.map.tileSize;
    const center = getPosition(this.gridPosition, tileSize);

    if (this.direction === "left" || this.direction === "right") {
      this.position.y = center.y;
    } else if (this.direction === "up" || this.direction === "down") {
      this.position.x = center.x;
    }
  }

  /**
   * Changes the sprite direction when conditions are met:
   * - sprite is at the tile center
   * - sprite is not blocked by wall
   * @param {Direction} requestedDirection
   */
  tryChangeDirection(requestedDirection) {
    if (requestedDirection === "none") {
      this.setDirection("none");
      return;
    }

    const tileSize = this.map.map.tileSize;
    if (!isTileCenter(this.position, tileSize)) {
      return;
    }

    if (!this.isBlockedByWall(requestedDirection)) {
      this.setDirection(requestedDirection);
    }
  }

  /**
   * Checks if there is a wall in the next tile in the given direction.
   * Does not require being at tile center - used for movement clamping.
   * @param {Direction} [checkDirection]
   * @returns {boolean}
   */
  isWallAhead(checkDirection) {
    const { map, direction, gridPosition } = this;
    const dir = checkDirection || direction;

    if (dir === "none") {
      return false;
    }

    const { x: gridX, y: gridY } = gridPosition;
    const vector = DIRECTION_VECTORS[dir];
    const targetX = gridX + vector.x;
    const targetY = gridY + vector.y;

    // Allow walking off map (for wrapping)
    if (
      targetX < 0 ||
      targetX >= map.map.columns ||
      targetY < 0 ||
      targetY >= map.map.rows
    ) {
      return false;
    }

    const currentTileKey = `${gridX},${gridY}`;
    const targetTileKey = `${targetX},${targetY}`;
    const adjacentTiles = map.map.adjacentTilesGraph[currentTileKey] || [];

    return !adjacentTiles.includes(targetTileKey);
  }

  /**
   * Checks if there is a wall blocking the path in the direction
   * Uses adjacentTilesGraph to determine valid movement paths
   * Only returns true when sprite is at tile center
   * @param {Direction} [requestedDirection]
   * @returns {boolean}
   */
  isBlockedByWall(requestedDirection) {
    const { map, position } = this;
    const tileSize = map.map.tileSize;

    if (!isTileCenter(position, tileSize)) {
      return false;
    }

    return this.isWallAhead(requestedDirection);
  }

  /**
   * Handles the sprite walking off the map and wraps it around.
   * @returns {boolean}
   */
  handleWalkingOffMap() {
    const { position, map, direction } = this;
    const { tileSize, width, height } = map.map;
    const halfTile = tileSize / 2;

    const wrapConditions = {
      down: {
        check: position.y > height + halfTile,
        newPos: { x: position.x, y: 0 },
      },
      up: {
        check: position.y < -halfTile,
        newPos: { x: position.x, y: height },
      },
      left: {
        check: position.x < -halfTile,
        newPos: { x: width - 1, y: position.y },
      },
      right: {
        check: position.x > width + halfTile,
        newPos: { x: 0, y: position.y },
      },
    };

    if (direction === "none") {
      return false;
    }

    const condition = wrapConditions[direction];
    if (condition?.check) {
      this.setPosition(condition.newPos);
      return true;
    }

    return false;
  }
}

export default Sprite;
