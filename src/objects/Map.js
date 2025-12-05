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
   * @param {number} tileSize
   * @param {*} mapConfig
   * @param {{[key: string]: string[]}} adjacentTilesGraph
   */
  constructor(tileSize, mapConfig, adjacentTilesGraph) {
    const { foodCount, powerUpCount, mapArray, columns, rows } = mapConfig;
    this.columns = columns;
    this.rows = rows;
    this.width = columns * tileSize;
    this.height = rows * tileSize;
    this.tileSize = tileSize;
    this.mapArray = mapArray;
    this.numberOfFoodPallets = foodCount;
    this.numberOfPowerUps = powerUpCount;
    this.adjacentTilesGraph = adjacentTilesGraph;
    console.log("Map initialized:", mapConfig);
  }

  /**
   *
   * @param {GridCoordinate} gridPosition
   * @returns {number} tile content
   */
  getTileContent(gridPosition) {
    const { x: gridX, y: gridY } = gridPosition;
    return this.mapArray[gridY][gridX];
  }

  /**
   *
   * @param {GridCoordinate} gridPosition
   */
  removeTileContent(gridPosition) {
    const { x: gridX, y: gridY } = gridPosition;
    if (this.mapArray[gridY][gridX] === 2) {
      this.numberOfFoodPallets--;
    } else if (this.mapArray[gridY][gridX] === 3) {
      this.numberOfPowerUps--;
    }
    this.mapArray[gridY][gridX] = 0;
  }

  // /**
  //  * Marks a tile as a wall in the wall map.
  //  * @param {number} gridX
  //  * @param {number} gridY
  //  */
  // addWall(gridX, gridY) {
  //   if (this.mapArray[gridY][gridX] === 1) {
  //     throw new Error(`Wall already exists at position (${gridX}, ${gridY})`);
  //   }
  //   this.numberOfWalls++;
  //   this.mapArray[gridY][gridX] = 1;
  //   this.numberOfFoodPallets--;
  // }

  // /**
  //  * Removes a food pallet from tile
  //  * @param {GridCoordinate} gridPosition
  //  * @returns {Boolean} - true when a food pallet was found
  //  */
  // removeFoodPellet(gridPosition) {
  //   const { x: gridX, y: gridY } = gridPosition;
  //   if (this.mapArray[gridY][gridX] === 2) {
  //     this.mapArray[gridY][gridX] = 0; // Mark as empty space
  //     this.numberOfFoodPallets--;
  //     return true;
  //   }
  //   return false;
  // }

  // /**
  //  * Removes a power up from tile
  //  * @param {GridCoordinate} gridPosition
  //  * @returns {Boolean} - true when a food pallet was found
  //  */
  // removePowerUp(gridPosition) {
  //   const { x: gridX, y: gridY } = gridPosition;
  //   if (this.mapArray[gridY][gridX] === 3) {
  //     this.mapArray[gridY][gridX] = 0; // Mark as empty space
  //     this.numberOfPowerUps--;
  //     return true;
  //   }
  //   return false;
  // }

  // /**
  //  * Marks a tile as containing a power-up in the wall map.
  //  * @param {GridCoordinate} gridPosition
  //  * @returns {Boolean} - true when power-up was added
  //  */
  // tryToAddPowerUp(gridPosition) {
  //   const { x: gridX, y: gridY } = gridPosition;
  //   if (this.mapArray[gridY][gridX] === 1) {
  //     throw new Error(
  //       `Cannot place power-up on a wall at position (${gridX}, ${gridY})`
  //     );
  //   }
  //   if (this.mapArray[gridY][gridX] === 0) {
  //     return false; // Do not place power-up on empty space
  //   }
  //   if (this.mapArray[gridY][gridX] === 3) {
  //     return true; // Power-up already exists
  //   }
  //   this.numberOfPowerUps++;
  //   this.numberOfFoodPallets--;
  //   this.mapArray[gridY][gridX] = 3;
  //   return true;
  // }
}

export default Map;
