import { useState, useCallback, useEffect, useRef } from "react";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type CellValue = 0 | "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export type Board = CellValue[][];

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  shape: number[][];
  type: CellValue;
  position: Position;
}

const TETROMINOES: Record<string, { shape: number[][]; type: CellValue }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    type: "I",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    type: "O",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    type: "T",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    type: "S",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    type: "Z",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    type: "J",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    type: "L",
  },
};

const PIECE_KEYS = ["I", "O", "T", "S", "Z", "J", "L"];

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(0)
  );
}

function randomPiece(): Piece {
  const key = PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)];
  const tetromino = TETROMINOES[key];
  return {
    shape: tetromino.shape.map((row) => [...row]),
    type: tetromino.type,
    position: {
      x: Math.floor((BOARD_WIDTH - tetromino.shape[0].length) / 2),
      y: 0,
    },
  };
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () =>
    Array(rows).fill(0)
  );
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

function isValidPosition(
  board: Board,
  shape: number[][],
  position: Position
): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const newX = position.x + c;
        const newY = position.y + r;
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

function placePiece(board: Board, piece: Piece): Board {
  const newBoard = board.map((row) => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const y = piece.position.y + r;
        const x = piece.position.x + c;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          newBoard[y][x] = piece.type;
        }
      }
    }
  }
  return newBoard;
}

function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  const newBoard = board.filter((row) => row.some((cell) => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  return { newBoard, linesCleared };
}

const POINTS = [0, 100, 300, 500, 800];

export type GameState = "idle" | "playing" | "paused" | "gameover";

export function useTetris() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");

  const gameStateRef = useRef(gameState);
  const boardRef = useRef(board);
  const currentPieceRef = useRef(currentPiece);
  const nextPieceRef = useRef(nextPiece);
  const scoreRef = useRef(score);
  const levelRef = useRef(level);
  const linesRef = useRef(lines);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  useEffect(() => {
    boardRef.current = board;
  }, [board]);
  useEffect(() => {
    currentPieceRef.current = currentPiece;
  }, [currentPiece]);
  useEffect(() => {
    nextPieceRef.current = nextPiece;
  }, [nextPiece]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    levelRef.current = level;
  }, [level]);
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const spawnNewPiece = useCallback(() => {
    const next = nextPieceRef.current || randomPiece();
    const newNext = randomPiece();

    if (!isValidPosition(boardRef.current, next.shape, next.position)) {
      setGameState("gameover");
      return;
    }

    setCurrentPiece(next);
    setNextPiece(newNext);
  }, []);

  const lockPiece = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece) return;

    const newBoard = placePiece(boardRef.current, piece);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

    setBoard(clearedBoard);

    if (linesCleared > 0) {
      const newLines = linesRef.current + linesCleared;
      setLines(newLines);
      setScore((s) => s + POINTS[linesCleared] * levelRef.current);
      setLevel(Math.floor(newLines / 10) + 1);
    }

    setCurrentPiece(null);
  }, []);

  // After locking a piece (currentPiece becomes null), spawn new piece
  useEffect(() => {
    if (gameStateRef.current === "playing" && currentPiece === null) {
      spawnNewPiece();
    }
  }, [currentPiece, spawnNewPiece]);

  const moveDown = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece || gameStateRef.current !== "playing") return;

    const newPos = { x: piece.position.x, y: piece.position.y + 1 };
    if (isValidPosition(boardRef.current, piece.shape, newPos)) {
      setCurrentPiece({ ...piece, position: newPos });
    } else {
      lockPiece();
    }
  }, [lockPiece]);

  const moveLeft = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece || gameStateRef.current !== "playing") return;

    const newPos = { x: piece.position.x - 1, y: piece.position.y };
    if (isValidPosition(boardRef.current, piece.shape, newPos)) {
      setCurrentPiece({ ...piece, position: newPos });
    }
  }, []);

  const moveRight = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece || gameStateRef.current !== "playing") return;

    const newPos = { x: piece.position.x + 1, y: piece.position.y };
    if (isValidPosition(boardRef.current, piece.shape, newPos)) {
      setCurrentPiece({ ...piece, position: newPos });
    }
  }, []);

  const rotatePiece = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece || gameStateRef.current !== "playing") return;

    const rotated = rotate(piece.shape);
    // Try normal rotation
    if (isValidPosition(boardRef.current, rotated, piece.position)) {
      setCurrentPiece({ ...piece, shape: rotated });
      return;
    }
    // Wall kick: try shifting left
    const leftKick = { x: piece.position.x - 1, y: piece.position.y };
    if (isValidPosition(boardRef.current, rotated, leftKick)) {
      setCurrentPiece({ ...piece, shape: rotated, position: leftKick });
      return;
    }
    // Wall kick: try shifting right
    const rightKick = { x: piece.position.x + 1, y: piece.position.y };
    if (isValidPosition(boardRef.current, rotated, rightKick)) {
      setCurrentPiece({ ...piece, shape: rotated, position: rightKick });
      return;
    }
  }, []);

  const hardDrop = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece || gameStateRef.current !== "playing") return;

    let newY = piece.position.y;
    while (
      isValidPosition(boardRef.current, piece.shape, {
        x: piece.position.x,
        y: newY + 1,
      })
    ) {
      newY++;
    }
    const droppedPiece = {
      ...piece,
      position: { x: piece.position.x, y: newY },
    };
    setCurrentPiece(droppedPiece);
    // Lock immediately after hard drop
    const newBoard = placePiece(boardRef.current, droppedPiece);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);

    if (linesCleared > 0) {
      const newLines = linesRef.current + linesCleared;
      setLines(newLines);
      setScore((s) => s + POINTS[linesCleared] * levelRef.current);
      setLevel(Math.floor(newLines / 10) + 1);
    }
    setScore((s) => s + (newY - piece.position.y) * 2);
    setCurrentPiece(null);
  }, []);

  const startGame = useCallback(() => {
    const emptyBoard = createEmptyBoard();
    setBoard(emptyBoard);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameState("playing");

    const first = randomPiece();
    const second = randomPiece();
    setNextPiece(second);
    setCurrentPiece(first);
  }, []);

  const togglePause = useCallback(() => {
    if (gameStateRef.current === "playing") {
      setGameState("paused");
    } else if (gameStateRef.current === "paused") {
      setGameState("playing");
    }
  }, []);

  // Gravity timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const speed = Math.max(100, 1000 - (level - 1) * 80);
    const interval = setInterval(() => {
      moveDown();
    }, speed);

    return () => clearInterval(interval);
  }, [gameState, level, moveDown]);

  // Compute ghost piece position
  let ghostY = currentPiece ? currentPiece.position.y : 0;
  if (currentPiece) {
    while (
      isValidPosition(board, currentPiece.shape, {
        x: currentPiece.position.x,
        y: ghostY + 1,
      })
    ) {
      ghostY++;
    }
  }

  // Merge board with current piece for display
  const displayBoard: Board = board.map((row) => [...row]);
  if (currentPiece) {
    // Draw ghost first
    for (let r = 0; r < currentPiece.shape.length; r++) {
      for (let c = 0; c < currentPiece.shape[r].length; c++) {
        if (currentPiece.shape[r][c]) {
          const y = ghostY + r;
          const x = currentPiece.position.x + c;
          if (
            y >= 0 &&
            y < BOARD_HEIGHT &&
            x >= 0 &&
            x < BOARD_WIDTH &&
            displayBoard[y][x] === 0
          ) {
            displayBoard[y][x] = ("ghost_" + currentPiece.type) as CellValue;
          }
        }
      }
    }
    // Draw actual piece
    for (let r = 0; r < currentPiece.shape.length; r++) {
      for (let c = 0; c < currentPiece.shape[r].length; c++) {
        if (currentPiece.shape[r][c]) {
          const y = currentPiece.position.y + r;
          const x = currentPiece.position.x + c;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            displayBoard[y][x] = currentPiece.type;
          }
        }
      }
    }
  }

  return {
    board: displayBoard,
    nextPiece,
    score,
    level,
    lines,
    gameState,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    moveDown,
    rotatePiece,
    hardDrop,
  };
}
