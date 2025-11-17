// @ts-check

/**
 * @import { PixelCoordinate, Direction } from '../types.js';
 */

import {
  handleWalkingOffMap,
  isBlockedByWall,
  tryChangeDirection,
} from "../movement.js";
import Map from "./Map.js";

/**
 * Represents a generic sprite in the game.
 */
class Sprite {
  /**
   * Initialize new Sprite
   * @param {CanvasRenderingContext2D} ctx
   * @param {Map} map
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
    this.baseSpeed = speed;
    this.activeBooster = 0;
    this.score = 0;
    this.foodEaten = 0;
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

  eat() {
    const { gridPosition, map } = this;
    if (map.removePowerUp(gridPosition)) {
      this.foodEaten++;
      this.score += 1000;
      this.speed = 5;
      this.activeBooster++;
      setTimeout(() => {
        this.activeBooster--;
        if (this.activeBooster <= 0) {
          this.speed = this.baseSpeed;
        }
      }, 5000);
    } else if (map.removeFoodPellet(gridPosition)) {
      this.foodEaten++;
      this.score += 100;
    }
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
    this.setPosition(position);
    handleWalkingOffMap(this);
  }

  moveRight() {
    const { position, map, speed } = this;
    const tileSize = map.tileSize;
    if (isBlockedByWall(this) === true) {
      return;
    }
    position.x += speed;
    this.setPosition(position);
    handleWalkingOffMap(this);
  }

  moveUp() {
    const { position, speed } = this;
    if (isBlockedByWall(this) === true) {
      return;
    }
    position.y -= speed;
    this.setPosition(position);
    handleWalkingOffMap(this);
  }

  moveDown() {
    const { position, speed } = this;
    if (isBlockedByWall(this) === true) {
      return;
    }
    position.y += speed;
    this.setPosition(position);
    handleWalkingOffMap(this);
  }
}

export default Sprite;
