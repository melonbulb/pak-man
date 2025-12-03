// @ts-check

/**
 * @import { GridCoordinate } from '../types.js';
 */

/**
 * Represents the map of the game
 * 0 - empty space
 * 1 - wall
 * 2 - Food pellet
 * 3 - Power-up
 */
class Map {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} columns
   * @param {number} rows
   * @param {number} tileSize
   */
  constructor(ctx, columns, rows, tileSize) {
    this.ctx = ctx;
    this.columns = columns;
    this.rows = rows;
    this.width = columns * tileSize;
    this.height = rows * tileSize;
    this.tileSize = tileSize;
    this.numberOfWalls = 0;
    this.numberOfPowerUps = 0;
    this.numberOfFoodPallets = columns * rows;

    this.map = this.initialMap(this.columns, this.rows);
  }

  /**
   * Creates and initializes a 2D array with given columns and rows.
   * @param {number} columns
   * @param {number} rows
   * @returns {number[][]}
   */
  initialMap(columns, rows) {
    const map = [];
    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < columns; x++) {
        row.push(2); // Initialize all as empty space with food pellets
      }
      map.push(row);
    }
    return map;
  }

  /**
   * Marks a tile as a wall in the wall map.
   * @param {number} gridX
   * @param {number} gridY
   */
  addWall(gridX, gridY) {
    if (this.map[gridY][gridX] === 1) {
      throw new Error(`Wall already exists at position (${gridX}, ${gridY})`);
    }
    this.numberOfWalls++;
    this.map[gridY][gridX] = 1;
    this.numberOfFoodPallets--;
  }

  /**
   * Removes a food pallet from tile
   * @param {GridCoordinate} gridPosition
   * @returns {Boolean} - true when a food pallet was found
   */
  removeFoodPellet(gridPosition) {
    const { x: gridX, y: gridY } = gridPosition;
    if (this.map[gridY][gridX] === 2) {
      this.map[gridY][gridX] = 0; // Mark as empty space
      this.numberOfFoodPallets--;
      return true;
    }
    return false;
  }

  /**
   * Removes a power up from tile
   * @param {GridCoordinate} gridPosition
   * @returns {Boolean} - true when a food pallet was found
   */
  removePowerUp(gridPosition) {
    const { x: gridX, y: gridY } = gridPosition;
    if (this.map[gridY][gridX] === 3) {
      this.map[gridY][gridX] = 0; // Mark as empty space
      this.numberOfPowerUps--;
      return true;
    }
    return false;
  }

  /**
   * Marks a tile as containing a power-up in the wall map.
   * @param {GridCoordinate} gridPosition
   * @returns {Boolean} - true when power-up was added
   */
  tryToAddPowerUp(gridPosition) {
    const { x: gridX, y: gridY } = gridPosition;
    if (this.map[gridY][gridX] === 1) {
      throw new Error(
        `Cannot place power-up on a wall at position (${gridX}, ${gridY})`
      );
    }
    if (this.map[gridY][gridX] === 0) {
      return false; // Do not place power-up on empty space
    }
    if (this.map[gridY][gridX] === 3) {
      return true; // Power-up already exists
    }
    this.numberOfPowerUps++;
    this.numberOfFoodPallets--;
    this.map[gridY][gridX] = 3;
    return true;
  }
}

export default Map;
