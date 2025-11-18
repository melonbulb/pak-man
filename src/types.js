// @ts-check

import Ghost from "./objects/Ghost";
import MapRenderer from "./objects/MapRenderer";
import PakMan from "./objects/Pakman";

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

/**
 * @typedef {Object} GameRenderObjects
 * @property {MapRenderer} map The map renderer object
 * @property {PakMan} player The player object
 * @property {Ghost[]} ghosts The array of NPC ghost objects
 */

export {};
