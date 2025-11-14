export class Sprite {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.direction = "none";
  }

  drawPlayer(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  getGridPosition() {
    return {
      gridX: Math.floor(this.x / this.size),
      gridY: Math.floor(this.y / this.size),
    };
  }

  setPosition(position) {
    this.x = position.x;
    this.y = position.y;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
