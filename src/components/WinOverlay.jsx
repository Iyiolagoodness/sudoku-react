import styles from './WinOverlay.module.css';
import { formatTime } from '../utils/sudoku';

export default function WinOverlay({ time, difficulty, mistakes, onPlayAgain }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.title}>Solved!</div>
        <div className={styles.sub}>Puzzle Complete</div>
        <div className={styles.stat}>{formatTime(time)}</div>
        <div className={styles.statLabel}>
          Time · {difficulty} · {mistakes} mistake{mistakes !== 1 ? 's' : ''}
        </div>
        <button className={styles.btn} onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
