// @ts-check
/**
 * @import { GridCoordinate } from '../types.js';
 */

import { drawLine, drawRectangle } from "../libs/lib-draw.js";
import { calculateDistance, getPosition } from "../utils/coordinate.js";
import Map from "./Map.js";

const neonPurple = "#bf00ff";
const neonPurpleDark = "#8000b3";

let moneyIcon = new Image();
moneyIcon.src = "./assets/money.png";

let powerUpIcon = new Image();
powerUpIcon.src = "./assets/power-up.png";

class MapRenderer {
  /**
   * @param {CanvasRenderingContext2D} bgCtx
   * @param {CanvasRenderingContext2D} gameCtx
   * @param {number} tileSize
   * @param {*} mapConfig
   */
  constructor(bgCtx, gameCtx, tileSize, mapConfig) {
    this.map = new Map(tileSize, mapConfig);
    this.bgCtx = bgCtx;
    this.gameCtx = gameCtx;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {GridCoordinate} gridPosition
   */
  draw(ctx, gridPosition) {
    const tileContent = this.map.getTileContent(gridPosition);
    switch (tileContent) {
      case 1:
        this.drawWall(ctx, gridPosition);
        break;
      case 2:
        this.drawFoodPallet(ctx, gridPosition);
        break;
      case 3:
        this.drawPowerUp(ctx, gridPosition);
        break;
      default:
        break;
    }
  }

  /**
   * Draw all walls on the map
   * @param {CanvasRenderingContext2D} ctx
   * @param {number[]} tileType
   */
  drawTiles(ctx, tileType) {
    for (let rows = 0; rows < this.map.rows; rows++) {
      for (let columns = 0; columns < this.map.columns; columns++) {
        if (tileType.includes(this.map.mapArray[rows][columns]))
          this.draw(ctx, { x: columns, y: rows });
      }
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  drawWalls(ctx) {
    this.drawTiles(ctx, [1]);
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {GridCoordinate} gridPosition
   */
  drawConsumables(ctx, gridPosition) {
    const tileContent = this.map.getTileContent(gridPosition);
    switch (tileContent) {
      case 2:
        this.drawFoodPallet(ctx, gridPosition);
        break;
      case 3:
        this.drawPowerUp(ctx, gridPosition);
        break;
      default:
        break;
    }
  }

  /**
   *  Draw a wall at the given grid position
   *  @param {CanvasRenderingContext2D} ctx
   *  @param {GridCoordinate} gridPosition
   */
  drawWall(ctx, gridPosition) {
    const x1 = calculateDistance(gridPosition.x, this.map.tileSize);
    const y1 = calculateDistance(gridPosition.y, this.map.tileSize);
    const x2 = x1 + this.map.tileSize;
    const y2 = y1 + this.map.tileSize;
    drawRectangle(ctx, x1, y1, x2, y2, neonPurpleDark, 0.1, "fill");
    drawRectangle(ctx, x1, y1, x2, y2, neonPurple, 1, "double-stroke");
  }

  /**
   * Draws a grid on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawGrid(ctx) {
    for (let i = 0; i <= this.map.columns; i++) {
      const x = calculateDistance(i, this.map.tileSize);
      drawLine(ctx, x, 0, x, this.map.height, neonPurple, 2, 0.2);
    }
    for (let j = 0; j <= this.map.rows; j++) {
      const y = calculateDistance(j, this.map.tileSize);
      drawLine(ctx, 0, y, this.map.width, y, neonPurple, 2, 0.2);
    }
  }

  /**
   * Draw and add a power up to map
   * @param {CanvasRenderingContext2D} ctx
   * @param {GridCoordinate} gridPosition
   */
  drawPowerUp(ctx, gridPosition) {
    const position = getPosition(gridPosition, this.map.tileSize);

    ctx.drawImage(
      powerUpIcon,
      position.x - this.map.tileSize / 2,
      position.y - this.map.tileSize / 2,
      this.map.tileSize,
      this.map.tileSize
    );
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {GridCoordinate} gridPosition
   */
  drawFoodPallet(ctx, gridPosition) {
    const x = calculateDistance(gridPosition.x, this.map.tileSize);
    const y = calculateDistance(gridPosition.y, this.map.tileSize);
    ctx.drawImage(moneyIcon, x, y, this.map.tileSize, this.map.tileSize);
  }
}

export default MapRenderer;
