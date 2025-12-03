// @ts-check
/**
 * @import { GridCoordinate } from '../types.js';
 */

import { drawLine, drawRectangle } from "../libs/lib-draw.js";
import { calculateDistance, getPosition } from "../utils/coordinate.js";
import Map from "./Map.js";

const neonPurple = "#bf00ff";
const neonPurpleDark = "#8000b3";

class MapRenderer extends Map {
  /**
   * @param {CanvasRenderingContext2D} bgCtx
   * @param {CanvasRenderingContext2D} gameCtx
   * @param {number} columns
   * @param {number} rows
   * @param {number} tileSize
   */
  constructor(bgCtx, gameCtx, columns, rows, tileSize) {
    super(bgCtx, columns, rows, tileSize);
    this.gameCtx = gameCtx;
    this.powerUpIcon = new Image();
    this.powerUpIcon.src = "./assets/power-up.png";
    this.moneyIcon = new Image();
    this.moneyIcon.src = "./assets/money.png";
  }
  /**
   * Draw a wall with neon purple outline
   * @param {number} gridX - starting X position using grid coordinate
   * @param {number} gridY - starting Y position using grid coordinate
   * @param {number} gridX2 - ending X position using grid coordinate
   * @param {number} gridY2 - ending Y position using grid coordinate
   */
  drawWall(gridX, gridY, gridX2, gridY2) {
    const x1 = calculateDistance(gridX, this.tileSize);
    const y1 = calculateDistance(gridY, this.tileSize);
    const x2 = calculateDistance(gridX2, this.tileSize);
    const y2 = calculateDistance(gridY2, this.tileSize);

    drawRectangle(this.ctx, x1, y1, x2, y2, neonPurpleDark, 0.1, "fill");
    drawRectangle(this.ctx, x1, y1, x2, y2, neonPurple, 1, "double-stroke");

    for (let i = gridY; i < gridY2; i++) {
      for (let j = gridX; j < gridX2; j++) {
        this.addWall(j, i);
      }
    }
  }

  /**
   * Draws a grid on the given canvas context.
   */
  drawGrid() {
    const ctx = this.ctx;
    for (let i = 0; i <= this.columns; i++) {
      const x = calculateDistance(i, this.tileSize);
      drawLine(ctx, x, 0, x, this.height, neonPurple, 2, 0.2);
    }
    for (let j = 0; j <= this.rows; j++) {
      const y = calculateDistance(j, this.tileSize);
      drawLine(ctx, 0, y, this.width, y, neonPurple, 2, 0.2);
    }
  }

  /**
   * Draw and add a power up to map
   * @param {CanvasRenderingContext2D} ctx
   * @param {GridCoordinate} gridPosition
   */
  drawPowerUp(ctx, gridPosition) {
    const added = this.tryToAddPowerUp(gridPosition);
    if (!added) return;
    const position = getPosition(gridPosition, this.tileSize);
    ctx.drawImage(
      this.powerUpIcon,
      position.x - this.tileSize / 2,
      position.y - this.tileSize / 2,
      this.tileSize,
      this.tileSize
    );
  }

  /**
   * Draw food pallets
   * @param {CanvasRenderingContext2D} ctx
   * @returns {number} count of food pallets drawn
   */
  drawFoodPallets(ctx) {
    let count = 0;
    for (let column = 0; column < this.columns; column++) {
      for (let row = 0; row < this.rows; row++) {
        if (this.map[row][column] === 2) {
          const position = getPosition({ x: column, y: row }, this.tileSize);
          ctx.drawImage(
            this.moneyIcon,
            position.x - this.tileSize / 2,
            position.y - this.tileSize / 2,
            this.tileSize,
            this.tileSize
          );
          count++;
        }
      }
    }
    return count;
  }
}

export default MapRenderer;
