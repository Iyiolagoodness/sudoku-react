import { useState, useEffect, useRef } from 'react';

/**
 * useTimer
 * Returns { time, running, start, pause, reset }
 */
export function useTimer() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      clearInterval(ref.current);
    }
    return () => clearInterval(ref.current);
  }, [running]);

  function start() { setRunning(true); }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setTime(0); }

  return { time, running, start, pause, reset };
}
