// @ts-check

import Sprite from "./Sprite.js";

/**
 * Represents the PakMan character in the game.
 */
class PakMan extends Sprite {
  /**
   *
   * @param {{x: number, y: number}} position
   * @param {number} speed
   * @param {number} tileSize
   */
  constructor(position, speed, tileSize) {
    super(position, speed, tileSize);
    this.size = tileSize * 0.8;
  }
  /**
   * Draws the PakMan on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} color
   */
  draw(ctx, color) {
    if (!this.position || !this.position.x || !this.position.y) {
      throw new Error("Sprite position is not set properly");
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
export default PakMan;
