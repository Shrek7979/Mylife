const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10; // 각 셀의 크기 (픽셀)
const rows = 50; // 격자의 행 수
const cols = 50; // 격자의 열 수
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = createGrid(rows, cols);
let isRunning = false;

document.getElementById('startButton').onclick = toggleGame;
document.getElementById('clearButton').onclick = clearGrid;
canvas.addEventListener('click', toggleCellState);

function createGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = grid[row][col] ? 'black' : 'white';
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

function getNextGeneration(grid) {
  const newGrid = createGrid(rows, cols);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const aliveNeighbors = countAliveNeighbors(grid, row, col);
      if (grid[row][col]) {
        newGrid[row][col] = aliveNeighbors === 2 || aliveNeighbors === 3;
      } else {
        newGrid[row][col] = aliveNeighbors === 3;
      }
    }
  }
  return newGrid;
}

function countAliveNeighbors(grid, row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        count += grid[newRow][newCol] ? 1 : 0;
      }
    }
  }
  return count;
}

function toggleGame() {
  isRunning = !isRunning;
  if (isRunning) {
    requestAnimationFrame(update);
  }
}

function update() {
  if (!isRunning) return;
  grid = getNextGeneration(grid);
  drawGrid();
  requestAnimationFrame(update);
}

function toggleCellState(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  grid[row][col] = !grid[row][col];
  drawGrid();
}

function clearGrid() {
  grid = createGrid(rows, cols);
  drawGrid();
}

// 초기 상태로 그리드 그림
drawGrid();
