// @ts-check

/**
 * @import { Direction } from '../types.js';
 */

/**
 * Gets a random direction from possible directions
 * @param {Array<Direction>} possibleDirections
 * @returns {Direction}
 */
function getRandomDirection(possibleDirections) {
  if (possibleDirections.length === 0) {
    return "none";
  }
  const randomIndex = Math.floor(Math.random() * possibleDirections.length);
  return possibleDirections[randomIndex];
}

export { getRandomDirection };
