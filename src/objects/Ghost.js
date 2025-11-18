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
   * @param {MapRenderer} map
   * @param {PixelCoordinate} position
   * @param {number} speed
   * @param {string} color
   */
  constructor(map, position, speed, color = "red") {
    super(map, position, speed);
    this.size = map.tileSize;
    this.color = color;
    this.baseColor = color;
    this.frightenColor = "blue";
    this.frightened = false;
    this.icon = new Image();
    this.icon.src = `./assets/ghost-${Math.floor(Math.random() * 4) + 1}.png`;
    this.iconFrightened = new Image();
    this.iconFrightened.src = "./assets/ghost-frightened.png";
  }
  /**
   * Draws the PakMan on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.drawImage(
      this.frightened ? this.iconFrightened : this.icon,
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
  }

  frighten() {
    this.color = this.frightenColor;
    setTimeout(() => {
      this.color = this.baseColor;
    }, 5000);
  }

  move() {
    let possibleDirections = checkPossibleDirections(this);
    possibleDirections = possibleDirections.filter(
      (dir) => dir !== this.direction
    );
    const newDirection =
      possibleDirections.length > 1
        ? getRandomDirection(possibleDirections)
        : this.direction;
    super.move(newDirection);
  }
}
export default Ghost;
