/**
 * sudoku.js
 * Core puzzle generation and solving logic.
 */

/** Check if placing `num` at (row, col) is valid on the given board. */
export function isValid(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
    if (board[x][col] === num) return false;
    const br = 3 * Math.floor(row / 3) + Math.floor(x / 3);
    const bc = 3 * Math.floor(col / 3) + (x % 3);
    if (board[br][bc] === num) return false;
  }
  return true;
}

/** Solve the board in-place using backtracking. Returns true if solved. */
export function solveSudoku(board) {
  const b = board.map((r) => [...r]);

  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (let n of nums) {
            if (isValid(b, r, c, n)) {
              b[r][c] = n;
              if (solve()) return true;
              b[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve();
  return b;
}

/** Clue counts per difficulty level. */
const CLUE_COUNTS = {
  easy: 38,
  medium: 30,
  hard: 24,
  expert: 18,
};

/**
 * Generate a puzzle + solution pair for the given difficulty.
 * @returns {{ puzzle: number[][], solution: number[][] }}
 */
export function generatePuzzle(difficulty = 'medium') {
  const full = solveSudoku(Array.from({ length: 9 }, () => Array(9).fill(0)));
  const clues = CLUE_COUNTS[difficulty] ?? 30;
  const toRemove = 81 - clues;

  const puzzle = full.map((r) => [...r]);
  const cells = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);

  let removed = 0;
  for (let i = 0; i < cells.length && removed < toRemove; i++) {
    const r = Math.floor(cells[i] / 9);
    const c = cells[i] % 9;
    puzzle[r][c] = 0;
    removed++;
  }

  return { puzzle, solution: full };
}

/** Create a fresh 9×9 grid of empty Sets for pencil notes. */
export function emptyNotes() {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set())
  );
}

/** Format seconds into MM:SS string. */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
