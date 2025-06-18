import React, { useState, useEffect, useCallback } from 'react';
import styles from './ScrollingNarrationBox.module.css';

function ScrollingNarrationBox({ lines = [], enhancedMode = false, onComplete }) {
  const [index, setIndex] = useState(0);

  const nextLine = useCallback(() => {
    setIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex >= lines.length) {
        if (onComplete) onComplete();
        return prev; // stay on last line
      }
      return newIndex;
    });
  }, [lines.length, onComplete]);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        nextLine();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextLine]);

  const speak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(lines[index]);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div
      className={`${styles.box} ${enhancedMode ? styles.enhanced : ''}`}
      role="dialog"
    >
      <div className={styles.lineContainer}>
        <p className={styles.line} aria-live="polite">
          {lines[index]}
        </p>
        {enhancedMode && (
          <button
            onClick={speak}
            className={styles.ttsButton}
            aria-label="Read line aloud"
          >
            🔊
          </button>
        )}
      </div>
      <button
        onClick={nextLine}
        className={styles.continueButton}
        aria-label="Continue"
      >
        Continue
      </button>
    </div>
  );
}

export default ScrollingNarrationBox;
