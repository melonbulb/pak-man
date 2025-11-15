// @ts-check

import {
  handleWalkingOffMap,
  isBlockedByWall,
  tryChangeDirection,
} from "../movement.js";

/**
 * Represents a generic sprite in the game.
 */
class Sprite {
  /**
   * Initialize new Sprite
   * @param {CanvasRenderingContext2D} ctx
   * @param {GameMap} map
   * @param {PixelCoordinate} position
   * @param {number} speed
   */
  constructor(ctx, map, position, speed) {
    this.ctx = ctx;
    this.map = map;
    this.position = { x: 0, y: 0 };
    this.gridPosition = { x: 0, y: 0 };
    this.setPosition(position);
    this.direction = /** @type {Direction} */ ("none");
    this.requestedDirection = /** @type {Direction} */ ("none");
    this.speed = speed;
  }

  /**
   * Updates the pixel and grid position based on the given pixel position.
   * @param {PixelCoordinate} position
   */
  setPosition(position) {
    this.position = position;
    const gridX = Math.floor(position.x / this.map.tileSize);
    const gridY = Math.floor(position.y / this.map.tileSize);
    this.gridPosition = { x: gridX, y: gridY };
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
   * @param {Direction} requestedDirection
   */
  move(requestedDirection) {
    tryChangeDirection(this, requestedDirection);
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
    if (isBlockedByWall(this) === true) {
      return;
    }
    position.x -= speed;
    this.position = position;
    handleWalkingOffMap(this);
  }

  moveRight() {
    const { position, map, speed } = this;
    const tileSize = map.tileSize;
    if (isBlockedByWall(this) === true) {
      return;
    }
    position.x += speed;
    this.position = position;
    handleWalkingOffMap(this);
  }

  moveUp() {
    const { position, speed } = this;
    if (isBlockedByWall(this) === true) {
      return;
    }
    position.y -= speed;
    this.position = position;
    handleWalkingOffMap(this);
  }

  moveDown() {
    const { position, speed } = this;
    if (isBlockedByWall(this) === true) {
      return;
    }
    position.y += speed;
    this.position = position;
    handleWalkingOffMap(this);
  }
}

export default Sprite;
