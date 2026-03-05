import styles from './Board.module.css';

export default function Board({ board, given, notes, selected, setSelected,
  isError, isHighlighted, isSameNum, won }) {
  return (
    <div className={styles.board}>
      {board && Array.from({ length: 81 }, (_, i) => {
        const r = Math.floor(i / 9), c = i % 9;
        const val = board[r][c];
        const isGiven = given[r][c];
        const cellNotes = notes[r][c];
        const error = isError(r, c);
        const sel = selected && selected[0] === r && selected[1] === c;
        const hl = !sel && isHighlighted(r, c);
        const sameN = !sel && isSameNum(r, c);
        const boxBottom = r === 2 || r === 5;

        const cls = [
          styles.cell,
          isGiven ? styles.given : '',
          sel ? styles.selected : sameN ? styles.sameNum : hl ? styles.highlighted : '',
          error ? styles.errorCell : '',
          boxBottom ? styles.boxBottom : '',
        ].filter(Boolean).join(' ');

        return (
          <div key={i} className={cls} onClick={() => !won && setSelected([r, c])}>
            {val !== 0 ? (
              <span className={[
                styles.cellNum,
                isGiven ? styles.givenNum : error ? styles.errorNum : styles.userNum,
              ].join(' ')}>
                {val}
              </span>
            ) : cellNotes.size > 0 ? (
              <div className={styles.pencilGrid}>
                {[1,2,3,4,5,6,7,8,9].map((n) => (
                  <div key={n} className={styles.pencilNum}>
                    {cellNotes.has(n) ? n : ''}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
