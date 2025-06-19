import React, { useState, useEffect, useCallback } from 'react';
import styles from './ScrollingNarrationBox.module.css';
import TTSLine from './TTSLine';

function ScrollingNarrationBox({
  lines = [],
  enhancedMode = false,
  autoRead = false,
  onComplete,
}) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const nextLine = useCallback(() => {
    setIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex >= lines.length) {
        if (onComplete) onComplete();
        setFinished(true);
        return prev; // stay on last line
      }
      return newIndex;
    });
  }, [lines.length, onComplete]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.code === 'Space' || e.code === 'Enter') && !finished) {
        e.preventDefault();
        nextLine();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextLine, finished]);

  return (
    <div
      className={`${styles.box} ${enhancedMode ? styles.enhanced : ''}`}
      role="dialog"
    >
      <div className={styles.lineContainer}>
        <TTSLine
          key={index}
          text={lines[index]}
          autoRead={autoRead}
          className={styles.line}
        />
      </div>
      <button
        onClick={nextLine}
        disabled={finished}
        className={styles.continueButton}
        aria-label="Continue"
      >
        {finished ? 'Done' : 'Continue'}
      </button>
    </div>
  );
}

export default ScrollingNarrationBox;
