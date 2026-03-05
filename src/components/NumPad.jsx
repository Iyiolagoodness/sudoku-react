import styles from './NumPad.module.css';

export default function NumPad({ onNumber, numCounts, selected, given }) {
  const disabled = !selected || (given && given[selected[0]][selected[1]]);

  return (
    <div className={styles.numpad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button
          key={n}
          className={[styles.numBtn, numCounts[n] >= 9 ? styles.used : ''].join(' ')}
          onClick={() => !disabled && onNumber(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
