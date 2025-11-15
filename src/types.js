// @ts-check

/**
 * @typedef {Object} GameMap
 * @property {number} width The width of the map in pixels.
 * @property {number} height The height of the map in pixels.
 * @property {number} tileSize The size of each tile in pixels.
 * @property {number[][]} map A 2D array representing the wall layout of the map.
 */

/**
 * @typedef {Object} PixelCoordinate
 * @property {number} x The x-coordinate of the pixel.
 * @property {number} y The y-coordinate of the pixel.
 */

/**
 * @typedef {Object} GridCoordinate
 * @property {number} x The x-coordinate in the grid
 * @property {number} y The y-coordinate in the grid
 */

/**
 * @typedef {"up" | "down" | "left" | "right" | "none"} Direction
 */
