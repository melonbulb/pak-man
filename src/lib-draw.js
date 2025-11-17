// @ts-check
/**
 * @import { PixelCoordinate } from './types.js';
 */

/**
 * Draw a circle on the given canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} color
 * @param {PixelCoordinate} position
 * @param {number} radius
 */
function drawCircle(ctx, color, position, radius) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draws a line on the given canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x1 - starting x coordinate
 * @param {number} y1 - starting y coordinate
 * @param {number} x2 - ending x coordinate
 * @param {number} y2 - ending y coordinate
 * @param {string} color - line color
 */
function drawLine(ctx, x1, y1, x2, y2, color) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/**
 * Function to draw a rectangle on the given canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x1 - starting x position coordinate
 * @param {number} y1 - starting y position coordinate
 * @param {number} x2 - ending x position coordinate
 * @param {number} y2 - ending y position coordinate
 * @param {string} color - fill color
 */
function drawRectangle(ctx, x1, y1, x2, y2, color) {
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = color;
  ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

  ctx.globalAlpha = 1;
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.strokeRect(x1 + 10, y1 + 10, x2 - x1 - 20, y2 - y1 - 20);
}

export { drawCircle, drawLine, drawRectangle };
