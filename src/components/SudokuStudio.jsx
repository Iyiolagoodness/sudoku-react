import { useEffect } from 'react';
import Board from './Board';
import Sidebar from './Sidebar';
import NumPad from './NumPad';
import WinOverlay from './WinOverlay';
import { useSudokuGame } from '../hooks/useSudokuGame';
import styles from './SudokuStudio.module.css';

export default function SudokuStudio() {
  const game = useSudokuGame('medium');

  useEffect(() => { game.startNewGame(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e) => {
      if (game.won || !game.selected) return;
      const [r, c] = game.selected;

      const moves = {
        ArrowUp:    r > 0 ? [r - 1, c] : null,
        ArrowDown:  r < 8 ? [r + 1, c] : null,
        ArrowLeft:  c > 0 ? [r, c - 1] : null,
        ArrowRight: c < 8 ? [r, c + 1] : null,
      };
      if (moves[e.key]) { game.setSelected(moves[e.key]); return; }
      if (e.key === 'p' || e.key === 'P') { game.setPencilMode((v) => !v); return; }

      if (['Backspace', 'Delete', '0'].includes(e.key) && !game.given?.[r][c]) {
        game.inputNumber(r, c, 0);
        return;
      }
      const n = parseInt(e.key);
      if (n >= 1 && n <= 9 && !game.given?.[r][c]) {
        game.inputNumber(r, c, n);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [game]);

  function handleNumber(n) {
    if (!game.selected || !game.given) return;
    const [r, c] = game.selected;
    if (!game.given[r][c]) game.inputNumber(r, c, n);
  }

  function handleErase() {
    if (!game.selected || !game.given) return;
    const [r, c] = game.selected;
    if (!game.given[r][c]) game.inputNumber(r, c, 0);
  }

  if (!game.board) return null;

  return (
    <div className={styles.studio}>
      <header className={styles.header}>
        <div className={styles.logo}>
          Sudoku Studio
          <span className={styles.logoSub}>Classic Number Puzzle</span>
        </div>
        <div className={styles.headerStats}>
          <div>Mistakes: <span style={{ color: game.mistakes > 2 ? 'var(--red)' : 'var(--text)' }}>{game.mistakes}</span></div>
          <div>Hints: <span style={{ color: game.hints > 0 ? 'var(--gold)' : 'var(--text-dim)' }}>
            {'◆'.repeat(game.hints)}{'◇'.repeat(3 - game.hints)}
          </span></div>
        </div>
      </header>

      <div className={styles.mainLayout}>
        <div className={styles.boardWrap}>
          <Board
            board={game.board}
            given={game.given}
            notes={game.notes}
            selected={game.selected}
            setSelected={game.setSelected}
            isError={game.isError}
            isHighlighted={game.isHighlighted}
            isSameNum={game.isSameNum}
            won={game.won}
          />
          <NumPad
            onNumber={handleNumber}
            numCounts={game.numCounts}
            selected={game.selected}
            given={game.given}
          />
        </div>

        <Sidebar
          time={game.time}
          filledCount={game.filledCount}
          difficulty={game.difficulty}
          setDifficulty={game.setDifficulty}
          pencilMode={game.pencilMode}
          setPencilMode={game.setPencilMode}
          autoCheck={game.autoCheck}
          setAutoCheck={game.setAutoCheck}
          history={game.history}
          hints={game.hints}
          numCounts={game.numCounts}
          selected={game.selected}
          given={game.given}
          onNewGame={() => game.startNewGame(game.difficulty)}
          onUndo={game.undo}
          onHint={game.giveHint}
          onReveal={game.revealSolution}
          onNumber={handleNumber}
          onErase={handleErase}
        />
      </div>

      {game.won && (
        <WinOverlay
          time={game.time}
          difficulty={game.difficulty}
          mistakes={game.mistakes}
          onPlayAgain={() => game.startNewGame(game.difficulty)}
        />
      )}
    </div>
  );
}