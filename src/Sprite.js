class Sprite {
  constructor(position, speed) {
    this.position = position;
    this.direction = "none";
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
  }

  setRequestedDirection(direction) {
    this.requestedDirection = direction;
  }

  setDirection(direction) {
    this.direction = direction;
  }
}

export { Sprite };
