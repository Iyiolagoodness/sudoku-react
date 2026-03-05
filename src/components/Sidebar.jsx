
import styles from './Sidebar.module.css';
import { formatTime } from '../utils/sudoku';

const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

export default function Sidebar({
  time, filledCount, difficulty, setDifficulty,
  pencilMode, setPencilMode, autoCheck, setAutoCheck,
  history, hints, numCounts, selected, given,
  onNewGame, onUndo, onHint, onReveal, onNumber, onErase,
}) {
  const progress = Math.round((filledCount / 81) * 100);

  return (
    <aside className={styles.sidebar}>
      {/* Timer */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Time</div>
        <div className={styles.timer}>{formatTime(time)}</div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.progressLabel}>{filledCount} / 81 filled · {progress}%</div>
      </div>

      {/* Difficulty */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Difficulty</div>
        <div className={styles.diffPills}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={[styles.diffPill, difficulty === d ? styles.active : ''].join(' ')}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Actions</div>
        <div className={styles.btnRow} style={{ marginBottom: 8 }}>
          <button className={`${styles.btn} ${styles.primary}`} onClick={onNewGame}>New Game</button>
          <button className={styles.btn} onClick={onUndo} disabled={!history.length}>Undo</button>
        </div>
        <div className={styles.btnRow} style={{ marginBottom: 8 }}>
          <button className={styles.btn} onClick={onHint} disabled={hints <= 0}>
            Hint ({hints})
          </button>
          <button className={styles.btn} onClick={onErase}>Erase</button>
        </div>
        <div className={styles.btnRow}>
          <button
            className={`${styles.btn} ${styles.danger}`}
            onClick={() => { if (window.confirm('Reveal the solution?')) onReveal(); }}
          >
            Reveal
          </button>
        </div>
      </div>

      {/* Mode toggles */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Mode</div>
        <div className={styles.toggleRow}>
          <button
            className={[styles.toggleBtn, pencilMode ? styles.toggleActive : ''].join(' ')}
            onClick={() => setPencilMode((v) => !v)}
          >
            ✏ Pencil
          </button>
          <button
            className={[styles.toggleBtn, autoCheck ? styles.toggleActive : ''].join(' ')}
            onClick={() => setAutoCheck((v) => !v)}
          >
            ✓ Check
          </button>
        </div>
      </div>

     
    </aside>
  );
}

