class Sprite {
  constructor(position, speed, tileSize) {
    this.setPosition(position);
    this.direction = "none";
    this.tileSize = tileSize;
    this.speed = speed;
  }

  drawPlayer(ctx, color, size) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  setPosition(position) {
    this.position = position;
    const gridX = Math.floor(position.x / this.tileSize);
    const gridY = Math.floor(position.y / this.tileSize);
    this.gridPosition = { x: gridX, y: gridY };
  }

  setRequestedDirection(direction) {
    this.requestedDirection = direction;
  }

  setDirection(direction) {
    this.direction = direction;
  }
}

export { Sprite };
