// @ts-check
/**
 * @import { PixelCoordinate } from '../types.js';
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
 * @param {number} lineWidth - line width
 * @param {number} transparency - transparency level from 0 to 1
 */
function drawLine(ctx, x1, y1, x2, y2, color, lineWidth = 1, transparency = 1) {
  ctx.globalAlpha = transparency;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/**
 * Function to draw a rectangle on the given canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x1 - starting x position coordinate
 * @param {number} y1 - starting y position coordinate
 * @param {number} x2 - ending x position coordinate
 * @param {number} y2 - ending y position coordinate
 * @param {string} color - fill color
 * @param {number} transparency - transparency level from 0 to 1
 * @param {"fill"|"stroke"|"double-stroke"} style - "fill" or "stroke"
 */
function drawRectangle(
  ctx,
  x1,
  y1,
  x2,
  y2,
  color,
  transparency = 1,
  style = "fill",
  lineWidth = 2
) {
  ctx.globalAlpha = transparency;
  ctx.fillStyle = color;
  switch (style) {
    case "fill":
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      break;
    case "stroke":
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      break;
    case "double-stroke":
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.strokeRect(x1 + 10, y1 + 10, x2 - x1 - 20, y2 - y1 - 20);
      break;
    default:
      throw new Error(`drawRectangle: unknown style "${style}"`);
  }
  ctx.globalAlpha = 1;
}

export { drawCircle, drawLine, drawRectangle };
