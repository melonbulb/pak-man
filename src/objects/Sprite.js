// @ts-check

/**
 * @import { PixelCoordinate, Direction } from '../types.js';
 */

import { getGridPosition, isTileCenter } from "../utils/coordinate.js";
import MapRenderer from "./MapRenderer.js";

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
    this.gridPosition = getGridPosition(position, this.map.tileSize);
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
    requestedDirection && this.tryChangeDirection(requestedDirection);
    if (this.activeBooster === 0) {
      this.speed = this.baseSpeed;
    }
    switch (this.direction) {
      case "up":
        this.moveUp();
        break;
      case "down":
        this.moveDown();
        break;
      case "left":
        this.moveLeft();
        break;
      case "right":
        this.moveRight();
        break;
    }
  }

  moveLeft() {
    const { position, speed } = this;
    if (this.isBlockedByWall() === true) {
      return;
    }
    position.x -= speed;
    this.setPosition(position);
    this.handleWalkingOffMap();
  }

  moveRight() {
    const { position, speed } = this;
    if (this.isBlockedByWall() === true) {
      return;
    }
    position.x += speed;
    this.setPosition(position);
    this.handleWalkingOffMap();
  }

  moveUp() {
    const { position, speed } = this;
    if (this.isBlockedByWall() === true) {
      return;
    }
    position.y -= speed;
    this.setPosition(position);
    this.handleWalkingOffMap();
  }

  moveDown() {
    const { position, speed } = this;
    if (this.isBlockedByWall() === true) {
      return;
    }
    position.y += speed;
    this.setPosition(position);
    this.handleWalkingOffMap();
  }

  /**
   * Changes the sprite direction when conditions are met:
   * - sprite is at the tile center
   * - sprite is not blocked by wall
   * @param {Direction} requestedDirection
   */
  tryChangeDirection(requestedDirection) {
    const { map, position } = this;
    if (requestedDirection === "none") {
      this.setDirection("none");
      return;
    }
    if (isTileCenter(position, map.tileSize) === false) {
      return;
    }
    if (this.isBlockedByWall(requestedDirection) === false) {
      this.setDirection(requestedDirection);
    }
  }

  /**
   * Checks if there is a wall blocking the path in the direction
   * @param {Direction} [requestedDirection]
   * @returns {boolean}
   */
  isBlockedByWall(requestedDirection) {
    const { map, direction, position } = this;
    if (isTileCenter(position, map.tileSize) === false) {
      return false;
    }
    const { x: gridX, y: gridY } = getGridPosition(position, map.tileSize);
    const dir = requestedDirection || direction;
    switch (dir) {
      case "up":
        // handle if walking off the map
        if (gridY - 1 < 0) {
          return false;
        }
        return map.map[gridY - 1][gridX] === 1;
      case "down":
        // handle if walking off the map
        if (gridY + 1 >= map.rows) {
          return false;
        }
        return map.map[gridY + 1][gridX] === 1;
      case "left":
        // handle if walking off the map
        if (gridX - 1 < 0) {
          return false;
        }
        return map.map[gridY][gridX - 1] === 1;
      case "right":
        // handle if walking off the map
        if (gridX + 1 >= map.columns) {
          return false;
        }
        return map.map[gridY][gridX + 1] === 1;
      default:
        return false;
    }
  }

  /**
   * Handles the sprite walking off the map and wraps it around.
   * @returns {boolean}
   */
  handleWalkingOffMap() {
    const { position, map, direction } = this;
    const { tileSize } = map;
    switch (direction) {
      case "down":
        if (position.y > map.height + tileSize / 2) {
          this.setPosition({ x: position.x, y: -tileSize / 2 });
          return true;
        }
        break;
      case "up":
        if (position.y < -tileSize / 2) {
          this.setPosition({ x: position.x, y: map.height + tileSize / 2 });
          return true;
        }
        break;
      case "left":
        if (position.x < -tileSize / 2) {
          this.setPosition({ x: map.width + tileSize / 2, y: position.y });
          return true;
        }
        break;
      case "right":
        if (position.x > map.width + tileSize / 2) {
          this.setPosition({ x: -tileSize / 2, y: position.y });
          return true;
        }
        break;
    }
    return false;
  }
}

export default Sprite;
