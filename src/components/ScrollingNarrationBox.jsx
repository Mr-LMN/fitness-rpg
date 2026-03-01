import React, { useState, useEffect, useCallback } from 'react';
import styles from './ScrollingNarrationBox.module.css';
import TTSLine from './TTSLine';
import { getReadingProfile } from '../helpers/readingProfile';
import { adaptNarrative } from '../helpers/narrativeAdapter';

function ScrollingNarrationBox({
  lines = [],
  enhancedMode = false,
  autoRead = false,
  readingAge = 'not-sure',
  onComplete,
}) {
  const readingProfile = getReadingProfile(readingAge);
  const adaptedLines = adaptNarrative(lines, readingProfile);

  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const nextLine = useCallback(() => {
    setIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex >= adaptedLines.length) {
        if (onComplete) onComplete();
        setFinished(true);
        return prev; // stay on last line
      }
      return newIndex;
    });
  }, [adaptedLines.length, onComplete]);

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

  const isEntryOrSimple = readingProfile.level === 'entry' || readingProfile.level === 'simple';

  return (
    <div
      className={`${styles.box} ${enhancedMode ? styles.enhanced : ''}`}
      role="dialog"
      style={isEntryOrSimple ? { fontSize: '1.4rem' } : undefined}
    >
      <div className={styles.lineContainer}>
        <TTSLine
          key={index}
          text={adaptedLines[index]}
          autoRead={autoRead}
          className={styles.line}
        />
      </div>
      <button
        onClick={nextLine}
        disabled={finished}
        className={styles.continueButton}
        aria-label="Continue"
        style={isEntryOrSimple ? { minHeight: '56px' } : undefined}
      >
        {finished ? '✅ Done' : '▶️ Continue'}
      </button>
    </div>
  );
}

export default ScrollingNarrationBox;
