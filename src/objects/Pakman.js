// @ts-check

/**
 * @import { PixelCoordinate } from '../types.js';
 * @import MapRenderer from "./MapRenderer.js";
 * @import Ghost from "./Ghost.js";
 */
import { isTileCenter } from "../utils/coordinate.js";
import Sprite from "./Sprite.js";

const icon = new Image();
icon.src = "./assets/pakman.png";

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
    this.size = map.map.tileSize;
    this.color = color;
    this.score = 0;
    this.foodEaten = 0;
  }
  /**
   * Draws the PakMan on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    switch (this.direction) {
      case "up":
        ctx.rotate((-90 * Math.PI) / 180);
        break;
      case "down":
        ctx.rotate((90 * Math.PI) / 180);
        break;
      case "left":
        ctx.transform(-1, 0, 0, 1, 0, 0);
        break;
      case "right":
        // No rotation needed
        break;
      default:
        break;
    }
    ctx.drawImage(icon, -this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }

  eat() {
    const { gridPosition, map } = this;
    if (!isTileCenter(this.position, map.map.tileSize)) {
      return;
    }
    const tileContent = map.map.getTileContent(gridPosition);
    if (tileContent !== 2 && tileContent !== 3) {
      return;
    }
    map.map.removeTileContent(gridPosition);
    switch (tileContent) {
      case 2:
        this.foodEaten++;
        this.score += 100;
        break;
      case 3:
        this.foodEaten++;
        this.score += 1000;
        this.activeBooster++;
        this.speed = 5;
        setTimeout(() => {
          this.activeBooster--;
        }, 5000);
        break;
      default:
        break;
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
    const collisionDistance = (this.size + ghost.size) / 3;
    const collisionDistanceSquared = collisionDistance * collisionDistance;
    if (distanceSquared < collisionDistanceSquared) {
      return true;
    }
    return false;
  }
}
export default PakMan;
