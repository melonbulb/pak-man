// @ts-check

/**
 * @import { Direction, PixelCoordinate } from '../types.js';
 * @import MapRenderer from "./MapRenderer.js";
 */
import { isTileCenter } from "../utils/coordinate.js";
import { getRandomDirection } from "../utils/movement.js";
import Sprite from "./Sprite.js";

const icon = new Image();
icon.src = `./assets/ghost-${Math.floor(Math.random() * 4) + 1}.png`;
const iconFrightened = new Image();
iconFrightened.src = "./assets/ghost-frightened.png";

/**
 * Represents the Ghost character in the game.
 */
class Ghost extends Sprite {
  /**
   * Initialize new Ghost
   * @param {MapRenderer} map
   * @param {PixelCoordinate} position
   * @param {number} speed
   * @param {string} color
   */
  constructor(map, position, speed, color = "red") {
    super(map, position, speed);
    this.size = map.map.tileSize;
    this.color = color;
    this.baseColor = color;
    this.frightenColor = "blue";
    this.frightened = false;
  }
  /**
   * Draws the PakMan on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.drawImage(
      this.frightened ? iconFrightened : icon,
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
  }

  frighten() {
    this.color = this.frightenColor;
    setTimeout(() => {
      this.color = this.baseColor;
    }, 5000);
  }

  move() {
    let possibleDirections = this.checkPossibleDirections();
    possibleDirections = possibleDirections.filter(
      (dir) => dir !== this.direction
    );
    const newDirection =
      possibleDirections.length > 1
        ? getRandomDirection(possibleDirections)
        : this.direction;
    super.move(newDirection);
  }

  /**
   * Checks possible directions the sprite can move to
   * @returns {Array<Direction>} directions
   */
  checkPossibleDirections() {
    const { map, position } = this;
    if (isTileCenter(position, map.map.tileSize) === false) {
      return [];
    }
    const availableDirections = /**@type {Array<Direction>}*/ ([
      "up",
      "down",
      "left",
      "right",
    ]);
    const possibleDirections = availableDirections.filter((dir) => {
      return this.isBlockedByWall(dir) === false;
    });

    return possibleDirections;
  }
}
export default Ghost;
