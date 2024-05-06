const board = Array.from({ length: 20 }, () => Array(10).fill(0));
let currentPiece = getRandomPiece();
let nextPiece = getRandomPiece();
let score = 0;
let gameOver = false;

function getRandomPiece() {
  const pieces = [
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
    },
    {
      shape: [
        [1, 1, 1],
        [1, 0, 0],
      ],
    },
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
      ],
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ],
    },
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
      ],
    },
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
      ],
    },
    {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
      ],
    },
  ];
  const piece = pieces[Math.floor(Math.random() * pieces.length)];
  return { ...piece, x: 4, y: 0 };
}

function drawBoard() {
  const boardElement = document.querySelector(".board");
  boardElement.innerHTML = "";
  board.forEach((row) => {
    row.forEach((cell) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      if (cell === 1) {
        cellElement.classList.add("filled");
      }
      boardElement.appendChild(cellElement);
    });
  });
}

function drawPiece() {
  currentPiece.shape.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1) {
        const x = currentPiece.x + j;
        const y = currentPiece.y + i;
        const index = y * 10 + x;
        const cellElement = document.querySelectorAll(".cell")[index];
        cellElement.classList.add("active");
      }
    });
  });
}

function clearPiece() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("active");
  });
}

function movePiece(dx, dy) {
  if (!checkCollision(dx, dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
  }
}

function movePieceDown() {
  if (!gameOver && !checkCollision(0, 1)) {
    currentPiece.y++;
  } else {
    if (!gameOver) {
      mergePiece();
      clearLines();
      currentPiece = nextPiece;
      nextPiece = getRandomPiece();
      if (checkCollision(0, 0)) {
        gameOver = true;
        document.querySelector(".game-over").classList.remove("hidden");
      }
    }
  }
}

function checkCollision(dx, dy) {
  return currentPiece.shape.some((row, i) => {
    return row.some((cell, j) => {
      const x = currentPiece.x + j + dx;
      const y = currentPiece.y + i + dy;
      return cell === 1 && (x < 0 || x >= 10 || y >= 20 || board[y][x] === 1);
    });
  });
}

function mergePiece() {
  currentPiece.shape.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 1) {
        const x = currentPiece.x + j;
        const y = currentPiece.y + i;
        board[y][x] = 1;
      }
    });
  });
}

function clearLines() {
  for (let y = board.length - 1; y >= 0; y--) {
    if (board[y].every((cell) => cell === 1)) {
      board.splice(y, 1);
      board.unshift(Array(10).fill(0));
      score += 100;
      document.getElementById("score").innerText = score;
    }
  }
}

function rotatePiece() {
  const rotatedPiece = {
    shape: [],
    x: currentPiece.x,
    y: currentPiece.y,
  };

  for (let i = 0; i < currentPiece.shape[0].length; i++) {
    rotatedPiece.shape.push([]);
    for (let j = currentPiece.shape.length - 1; j >= 0; j--) {
      rotatedPiece.shape[i].push(currentPiece.shape[j][i]);
    }
  }

  currentPiece.shape = rotatedPiece.shape;
}

function gameLoop() {
  movePieceDown();
  drawBoard();
  clearPiece();
  drawPiece();
  if (!gameOver) {
    setTimeout(gameLoop, 300);
  }
}

gameLoop();

document.addEventListener("keydown", (event) => {
  if (!gameOver) {
    switch (event.key) {
      case "ArrowLeft":
        movePiece(-1, 0);
        break;
      case "ArrowRight":
        movePiece(1, 0);
        break;
      case "ArrowDown":
        movePiece(0, 1);
        break;
      case "ArrowUp":
        rotatePiece();
        break;
    }
  }
});
