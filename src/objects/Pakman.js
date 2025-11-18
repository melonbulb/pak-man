// @ts-check

/**
 * @import { PixelCoordinate } from '../types.js';
 */
import { isTileCenter } from "../utils/coordinate.js";
import Ghost from "./Ghost.js";
import MapRenderer from "./MapRenderer.js";
import Sprite from "./Sprite.js";

/**
 * Represents the PakMan character in the game.
 */
class PakMan extends Sprite {
  /**
   * Initialize new PakMan
   * @param {MapRenderer} map
   * @param {PixelCoordinate} position
   * @param {number} speed
   * @param {string} color
   */
  constructor(map, position, speed, color = "yellow") {
    super(map, position, speed);
    this.size = map.tileSize * 0.8;
    this.color = color;
    this.score = 0;
    this.foodEaten = 0;
  }
  /**
   * Draws the PakMan on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  eat() {
    const { gridPosition, map } = this;
    if (!isTileCenter(this.position, map.tileSize)) {
      return;
    }
    if (map.removePowerUp(gridPosition)) {
      this.foodEaten++;
      this.score += 1000;
      this.activeBooster++;
      this.speed = 5;
      setTimeout(() => {
        this.activeBooster--;
      }, 5000);
    } else if (map.removeFoodPellet(gridPosition)) {
      this.foodEaten++;
      this.score += 100;
    }
  }

  /**
   * Checks collision between two sprites
   * @param {Ghost} ghost
   * @returns {boolean}
   */
  checkCollision(ghost) {
    const distanceX = this.position.x - ghost.position.x;
    const distanceY = this.position.y - ghost.position.y;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;
    const collisionDistance = (this.size + ghost.size) / 2;
    const collisionDistanceSquared = collisionDistance * collisionDistance;
    if (distanceSquared < collisionDistanceSquared) {
      return true;
    }
    return false;
  }
}
export default PakMan;
