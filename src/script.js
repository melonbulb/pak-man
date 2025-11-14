import { drawMap } from "./map.js";
import { Sprite } from "./sprite.js";

const canvasWidth = 800;
const canvasHeight = 600;
const tileSize = 40;
const playerSize = tileSize * 0.8;
const speed = 1;

let map;

const canvas = document.getElementById("pakman");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let requestedDirection = "none";
const { x: spawnX, y: spawnY } = getPosition(5, 1, tileSize);

function getPosition(tileX, tileY, tileSize) {
  return {
    x: tileX * tileSize + tileSize / 2,
    y: tileY * tileSize + tileSize / 2,
  };
}

function getGridPosition(x, y, tileSize) {
  return {
    gridX: Math.floor(x / tileSize),
    gridY: Math.floor(y / tileSize),
  };
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      requestedDirection = "up";
      break;
    case "ArrowDown":
      requestedDirection = "down";
      break;
    case "ArrowLeft":
      requestedDirection = "left";
      break;
    case "ArrowRight":
      requestedDirection = "right";
      break;
    case "Escape":
      requestedDirection = "none";
      direction = "none";
      break;
  }
});

function checkCornerCollision(x, y) {
  const { gridX, gridY } = getGridPosition(x, y, tileSize);
  return map[gridY][gridX] === 1;
}

function checkCollision(direction, currentPosition) {
  const corners = {
    topLeft: {
      x: currentPosition.x - tileSize / 2,
      y: currentPosition.y - tileSize / 2,
    },
    topRight: {
      x: currentPosition.x + tileSize / 2 - 1,
      y: currentPosition.y - tileSize / 2,
    },
    bottomLeft: {
      x: currentPosition.x - tileSize / 2,
      y: currentPosition.y + tileSize / 2 - 1,
    },
    bottomRight: {
      x: currentPosition.x + tileSize / 2 - 1,
      y: currentPosition.y + tileSize / 2 - 1,
    },
  };
  switch (direction) {
    case "up":
      return (
        checkCornerCollision(corners.topLeft.x, corners.topLeft.y - speed) ||
        checkCornerCollision(corners.topRight.x, corners.topRight.y - speed)
      );
    case "down":
      return (
        checkCornerCollision(
          corners.bottomLeft.x,
          corners.bottomLeft.y + speed
        ) ||
        checkCornerCollision(
          corners.bottomRight.x,
          corners.bottomRight.y + speed
        )
      );
    case "left":
      return (
        checkCornerCollision(corners.topLeft.x - speed, corners.topLeft.y) ||
        checkCornerCollision(corners.bottomLeft.x - speed, corners.bottomLeft.y)
      );
    case "right":
      return (
        checkCornerCollision(corners.topRight.x + speed, corners.topRight.y) ||
        checkCornerCollision(
          corners.bottomRight.x + speed,
          corners.bottomRight.y
        )
      );
    default:
      return false;
  }
}

function updatePlayerPosition(sprite) {
  const currentPosition = sprite.getPosition();
  const direction = sprite.direction;
  switch (direction) {
    case "up":
      if (checkCollision("up", currentPosition) === false) {
        return {
          x: currentPosition.x,
          y: currentPosition.y - speed,
        };
      }
      break;
    case "down":
      if (checkCollision("down", currentPosition) === false) {
        return {
          x: currentPosition.x,
          y: currentPosition.y + speed,
        };
      }
      break;
    case "left":
      if (currentPosition.x < -tileSize / 2) {
        return { x: canvasWidth + tileSize / 2, y: currentPosition.y };
      }
      if (checkCollision("left", currentPosition) === false) {
        return {
          x: currentPosition.x - speed,
          y: currentPosition.y,
        };
      }
      break;
    case "right":
      if (currentPosition.x > canvasWidth + tileSize / 2) {
        return { x: -tileSize / 2, y: currentPosition.y };
      }
      if (checkCollision("right", currentPosition) === false) {
        return {
          x: currentPosition.x + speed,
          y: currentPosition.y,
        };
      }
      break;
  }
  return currentPosition;
}

function isTileCenter(position) {
  const { gridX, gridY } = getGridPosition(position.x, position.y, tileSize);
  const centerX = gridX * tileSize + tileSize / 2;
  const centerY = gridY * tileSize + tileSize / 2;
  return position.x === centerX && position.y === centerY;
}

function tryChangeDirection(sprite) {
  const currentPosition = sprite.getPosition();
  if (requestedDirection === "none") {
    return;
  }
  if (!isTileCenter(currentPosition)) {
    return;
  }
  if (checkCollision(requestedDirection, currentPosition) === false) {
    sprite.setDirection(requestedDirection);
    requestedDirection = "none";
  }
}

function render(ctx, sprite) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  map = drawMap(ctx, {
    width: canvasWidth,
    height: canvasHeight,
    tileSize,
    includeGrid: true,
  });
  sprite.drawPlayer(ctx, "yellow");
  tryChangeDirection(sprite);
  sprite.setPosition(updatePlayerPosition(sprite));
}

function gameLoop(ctx, sprite) {
  render(ctx, sprite);
  requestAnimationFrame(() => gameLoop(ctx, sprite));
}

function startGame() {
  const ctx = canvas.getContext("2d");
  const sprite = new Sprite(spawnX, spawnY, playerSize);
  requestAnimationFrame(() => gameLoop(ctx, sprite));
}

startGame();
