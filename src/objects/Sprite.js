// @ts-check

/**
 * Represents a generic sprite in the game.
 */
class Sprite {
  /**
   *
   * @param {SpritePosition} position
   * @param {number} speed
   * @param {number} tileSize
   */
  constructor(position, speed, tileSize) {
    this.position = { x: 0, y: 0 };
    this.gridPosition = { x: 0, y: 0 };
    this.setPosition(position);
    this.direction = /** @type {Direction} */ ("none");
    this.requestedDirection = /** @type {Direction} */ ("none");
    this.tileSize = tileSize;
    this.speed = speed;
  }

  /**
   * Updates the pixel and grid position based on the given pixel position.
   * @param {SpritePosition} position
   */
  setPosition(position) {
    this.position = position;
    const gridX = Math.floor(position.x / this.tileSize);
    const gridY = Math.floor(position.y / this.tileSize);
    this.gridPosition = { x: gridX, y: gridY };
  }

  /**
   * Sets the requested direction for the sprite.
   * @param {Direction} direction
   */
  setRequestedDirection(direction) {
    this.requestedDirection = direction;
  }

  /**
   * Sets the current direction for the sprite.
   * @param {Direction} direction
   */
  setDirection(direction) {
    this.direction = direction;
  }
}

export default Sprite;
