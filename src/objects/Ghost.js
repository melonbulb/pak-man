// @ts-check

/**
 * @import { PixelCoordinate } from '../types.js';
 */
import {
  checkPossibleDirections,
  getRandomDirection,
} from "../utils/movement.js";
import MapRenderer from "./MapRenderer.js";
import Sprite from "./Sprite.js";

/**
 * Represents the Ghost character in the game.
 */
class Ghost extends Sprite {
  /**
   * Initialize new Ghost
   * @param {CanvasRenderingContext2D} ctx
   * @param {MapRenderer} map
   * @param {PixelCoordinate} position
   * @param {number} speed
   */
  constructor(ctx, map, position, speed, color = "red") {
    super(ctx, map, position, speed);
    this.size = map.tileSize * 0.8;
    this.color = color;
    this.speed = 0.5;
  }
  /**
   * Draws the PakMan on the given canvas context.
   */
  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  frighten() {
    this.color = "blue";
    setTimeout(() => {
      this.color = "red";
    }, 5000);
  }

  move() {
    let possibleDirections = checkPossibleDirections(this);
    possibleDirections = possibleDirections.filter(
      (dir) => dir !== this.direction
    );
    const newDirection =
      possibleDirections.length > 2
        ? getRandomDirection(possibleDirections)
        : this.direction;
    super.move(newDirection);
  }
}
export default Ghost;
