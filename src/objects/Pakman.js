// @ts-check

import Map from "./Map.js";
import Sprite from "./Sprite.js";

/**
 * Represents the PakMan character in the game.
 */
class PakMan extends Sprite {
  /**
   * Initialize new PakMan
   * @param {CanvasRenderingContext2D} ctx
   * @param {Map} map
   * @param {PixelCoordinate} position
   * @param {number} speed
   */
  constructor(ctx, map, position, speed, color = "yellow") {
    super(ctx, map, position, speed);
    this.size = map.tileSize * 0.8;
    this.color = color;
    this.score = 0;
    this.speedboost = 0;
    this.activeBooster = 0;
  }
  /**
   * Draws the PakMan on the given canvas context.
   */
  draw() {
    if (
      !this.position ||
      this.position.x === undefined ||
      this.position.y === undefined
    ) {
      throw new Error("Sprite position is not set properly");
    }
    const ctx = this.ctx;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
export default PakMan;
