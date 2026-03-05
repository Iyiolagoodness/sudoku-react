import { useState, useCallback } from 'react';
import { generatePuzzle, emptyNotes } from '../utils/sudoku';
import { useTimer } from './useTimer';

/**
 * useSudokuGame
 * Encapsulates all game state: board, notes, selection, undo, hints, win.
 */
export function useSudokuGame(initialDifficulty = 'medium') {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [puzzle, setPuzzle]         = useState(null);
  const [solution, setSolution]     = useState(null);
  const [board, setBoard]           = useState(null);
  const [given, setGiven]           = useState(null);
  const [selected, setSelected]     = useState(null);
  const [notes, setNotes]           = useState(emptyNotes());
  const [pencilMode, setPencilMode] = useState(false);
  const [autoCheck, setAutoCheck]   = useState(true);
  const [history, setHistory]       = useState([]);
  const [mistakes, setMistakes]     = useState(0);
  const [hints, setHints]           = useState(3);
  const [won, setWon]               = useState(false);

  const timer = useTimer();

  // ── Snapshot helper ─────────────────────────────────────────────────────────
  function snapshot(b, n) {
    return {
      board: b.map((r) => [...r]),
      notes: n.map((r) => r.map((s) => new Set(s))),
    };
  }

  // ── Start new game ───────────────────────────────────────────────────────────
  const startNewGame = useCallback(
    (diff = difficulty) => {
      const { puzzle: p, solution: s } = generatePuzzle(diff);
      setPuzzle(p);
      setSolution(s);
      setBoard(p.map((r) => [...r]));
      setGiven(p.map((r) => r.map((v) => v !== 0)));
      setSelected(null);
      setNotes(emptyNotes());
      setPencilMode(false);
      setHistory([]);
      setMistakes(0);
      setHints(3);
      setWon(false);
      timer.reset();
      timer.start();
    },
    [difficulty] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Input a number ───────────────────────────────────────────────────────────
  function inputNumber(r, c, n) {
    if (!board || !given || given[r][c]) return;

    setHistory((h) => [...h, snapshot(board, notes)]);

    if (pencilMode && n !== 0) {
      setNotes((prev) =>
        prev.map((row, ri) =>
          row.map((s, ci) => {
            if (ri !== r || ci !== c) return s;
            const ns = new Set(s);
            ns.has(n) ? ns.delete(n) : ns.add(n);
            return ns;
          })
        )
      );
      return;
    }

    // Track mistakes
    if (n !== 0 && autoCheck && n !== solution[r][c]) {
      setMistakes((m) => m + 1);
    }

    const newBoard = board.map((row, ri) =>
      row.map((v, ci) => (ri === r && ci === c ? n : v))
    );

    // Clear notes for the filled cell + peers
    const newNotes = notes.map((row, ri) =>
      row.map((s, ci) => (ri === r && ci === c ? new Set() : s))
    );
    if (n !== 0) {
      for (let i = 0; i < 9; i++) {
        newNotes[r][i].delete(n);
        newNotes[i][c].delete(n);
      }
      const br = Math.floor(r / 3) * 3;
      const bc = Math.floor(c / 3) * 3;
      for (let dr = 0; dr < 3; dr++)
        for (let dc = 0; dc < 3; dc++)
          newNotes[br + dr][bc + dc].delete(n);
    }

    setBoard(newBoard);
    setNotes(newNotes);

    // Check win
    const solved = newBoard.every((row, ri) =>
      row.every((v, ci) => v !== 0 && v === solution[ri][ci])
    );
    if (solved) {
      setWon(true);
      timer.pause();
    }
  }

  // ── Undo ─────────────────────────────────────────────────────────────────────
  function undo() {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setBoard(prev.board);
    setNotes(prev.notes.map((r) => r.map((s) => new Set(s))));
    setHistory((h) => h.slice(0, -1));
  }

  // ── Hint ─────────────────────────────────────────────────────────────────────
  function giveHint() {
    if (hints <= 0 || !board || !solution) return;
    const candidates = [];
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (!given[r][c] && board[r][c] !== solution[r][c])
          candidates.push([r, c]);
    if (!candidates.length) return;

    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    setHistory((h) => [...h, snapshot(board, notes)]);
    const newBoard = board.map((row, ri) =>
      row.map((v, ci) => (ri === r && ci === c ? solution[r][c] : v))
    );
    setBoard(newBoard);
    setSelected([r, c]);
    setHints((h) => h - 1);

    const solved = newBoard.every((row, ri) =>
      row.every((v, ci) => v !== 0 && v === solution[ri][ci])
    );
    if (solved) { setWon(true); timer.pause(); }
  }

  // ── Reveal solution ──────────────────────────────────────────────────────────
  function revealSolution() {
    if (!solution) return;
    setBoard(solution.map((r) => [...r]));
    setNotes(emptyNotes());
    setWon(true);
    timer.pause();
  }

  // ── Derived ──────────────────────────────────────────────────────────────────
  const numCounts = Array.from({ length: 10 }, (_, n) =>
    n === 0 || !board ? 0 : board.flat().filter((v) => v === n).length
  );
  const filledCount = board ? board.flat().filter((v) => v !== 0).length : 0;

  function isError(r, c) {
    return (
      autoCheck &&
      board &&
      !given?.[r][c] &&
      board[r][c] !== 0 &&
      board[r][c] !== solution?.[r][c]
    );
  }

  function isHighlighted(r, c) {
    if (!selected) return false;
    const [sr, sc] = selected;
    return (
      r === sr ||
      c === sc ||
      (Math.floor(r / 3) === Math.floor(sr / 3) &&
        Math.floor(c / 3) === Math.floor(sc / 3))
    );
  }

  function isSameNum(r, c) {
    if (!selected || !board) return false;
    const [sr, sc] = selected;
    const sv = board[sr][sc];
    return sv !== 0 && board[r][c] === sv && !(r === sr && c === sc);
  }

  return {
    // state
    difficulty, setDifficulty,
    puzzle, solution, board, given,
    selected, setSelected,
    notes,
    pencilMode, setPencilMode,
    autoCheck, setAutoCheck,
    history,
    mistakes,
    hints,
    won,
    time: timer.time,
    running: timer.running,
    // actions
    startNewGame,
    inputNumber,
    undo,
    giveHint,
    revealSolution,
    // derived
    numCounts,
    filledCount,
    isError,
    isHighlighted,
    isSameNum,
  };
}
