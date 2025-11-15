// @ts-check

import Sprite from "./Sprite.js";

/**
 * Represents the PakMan character in the game.
 */
class PakMan extends Sprite {
  /**
   * Initialize new PakMan
   * @param {CanvasRenderingContext2D} ctx
   * @param {PixelCoordinate} position
   * @param {number} speed
   * @param {number} tileSize
   */
  constructor(ctx, position, speed, tileSize, color = "yellow") {
    super(ctx, position, speed, tileSize);
    this.size = tileSize * 0.8;
    this.color = color;
  }
  /**
   * Draws the PakMan on the given canvas context.
   */
  draw() {
    if (!this.position || !this.position.x || !this.position.y) {
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
