let canvasWidth;
let canvasHeight;
let tileSize;
let columnSize;
let rowSize;

let wallMap;

const neonPurple =
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-neon-purple-400")
    .trim() || "blue";

const neonPurpleDark =
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-neon-purple-600")
    .trim() || "darkblue";

// Utility function to convert tile count to pixel width
function tilesToWidth(numTiles) {
  return numTiles * tileSize;
}

// Function to draw a wall with neon purple outline
function drawWall(ctx, tileX, tileY, tileX2, tileY2) {
  const x = tilesToWidth(tileX);
  const y = tilesToWidth(tileY);
  const width = tilesToWidth(tileX2 - tileX);
  const height = tilesToWidth(tileY2 - tileY);
  if (x < 0 || y < 0) {
    throw new Error("drawWall: must be positive values.");
  }

  if (
    width > canvasWidth ||
    height > canvasHeight ||
    x > canvasWidth ||
    y > canvasHeight
  ) {
    throw new Error("drawWall: exceeds canvas boundaries.");
  }

  for (let i = tileY; i < tileY2; i++) {
    for (let j = tileX; j < tileX2; j++) {
      wallMap[i][j] = 1;
    }
  }

  ctx.globalAlpha = 0.1;
  ctx.fillStyle = neonPurpleDark;
  ctx.fillRect(x, y, width, height);

  ctx.globalAlpha = 1;
  ctx.lineWidth = 2;
  ctx.strokeStyle = neonPurple;
  ctx.strokeRect(x, y, width, height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = neonPurple;
  ctx.strokeRect(x + 10, y + 10, width - 20, height - 20);
}

function drawCubedWall(ctx, tileX, tileY) {
  drawWall(ctx, tileX, tileY, tileX + 3, tileY + 3);
}

function drawOuterWalls(ctx) {
  //top wall and boottom wall
  drawWall(ctx, 1, 0, columnSize - 1, 1);
  drawWall(ctx, 1, rowSize - 1, columnSize - 1, rowSize);

  //left wall
  drawWall(ctx, 0, 0, 1, 7);
  drawWall(ctx, 0, 8, 1, rowSize);
  // left entrance wall
  drawWall(ctx, 1, 6, 3, 7);
  drawWall(ctx, 1, 8, 3, 9);

  //right wall
  drawWall(ctx, columnSize - 1, 0, columnSize, 7);
  drawWall(ctx, columnSize - 1, 8, columnSize, rowSize);

  // right entrance wall
  drawWall(ctx, columnSize - 3, 6, columnSize - 1, 7);
  drawWall(ctx, columnSize - 3, 8, columnSize - 1, 9);
}

function drawLine(ctx, x1, y1, x2, y2) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = neonPurple;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawGrid(ctx) {
  ctx.globalAlpha = 0.2;
  for (let i = 0; i <= columnSize; i++) {
    const x = tilesToWidth(i);
    drawLine(ctx, x, 0, x, canvasHeight);
  }
  for (let j = 0; j <= rowSize; j++) {
    const y = tilesToWidth(j);
    drawLine(ctx, 0, y, canvasWidth, y);
  }
  ctx.globalAlpha = 1;
}

function initialWallMap(columns, rows) {
  const wallMap = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < columns; x++) {
      row.push(0);
    }
    wallMap.push(row);
  }
  return wallMap;
}

export function drawMap(ctx, config) {
  canvasWidth = config.width;
  canvasHeight = config.height;
  tileSize = config.tileSize;

  const includeGrid = config.includeGrid || false;

  columnSize = canvasWidth / tileSize;
  rowSize = canvasHeight / tileSize;

  wallMap = initialWallMap(columnSize, rowSize);

  drawOuterWalls(ctx);

  // left cubed walls
  drawCubedWall(ctx, 2, 2); //top
  drawCubedWall(ctx, 2, 10); //bottom
  drawCubedWall(ctx, 4, 6); //infront entrance

  // right cubed walls
  drawCubedWall(ctx, 15, 2); //top
  drawCubedWall(ctx, 15, 10); //bottom
  drawCubedWall(ctx, 13, 6); //infront entrance

  // Top U bend shape walls
  drawWall(ctx, 6, 2, 7, 5);
  drawWall(ctx, 7, 2, 13, 3);
  drawWall(ctx, 13, 2, 14, 5);

  //center fist shape walls
  drawCubedWall(ctx, 9, 4); //center top
  drawWall(ctx, 8, 4, 9, 7);
  drawWall(ctx, 8, 8, 12, 9);

  //   drawCubedWall(6, 10); //center bottom
  drawWall(ctx, 6, 10, 8, 13);

  // spawner walls
  drawWall(ctx, 13, 10, 14, 13);
  drawWall(ctx, 10, 10, 13, 11);
  drawWall(ctx, 9, 10, 10, 13);
  drawWall(ctx, 10, 12, 12, 13);

  includeGrid && drawGrid(ctx);

  return {
    width: canvasWidth,
    height: canvasHeight,
    tileSize,
    wallMap,
  };
}
