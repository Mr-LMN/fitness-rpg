import React, { useState, useEffect, useCallback } from 'react';
import styles from './ScrollingNarrationBox.module.css';

function ScrollingNarrationBox({ lines = [], enhancedMode = false, onComplete }) {
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

  const speak = async () => {
    try {
      const resp = await fetch('/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lines[index] }),
      });
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(lines[index]);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      }
    }
  };

  return (
    <div
      className={`${styles.box} ${enhancedMode ? styles.enhanced : ''}`}
      role="dialog"
    >
      <div className={styles.lineContainer}>
        <p key={index} className={styles.line} aria-live="polite">
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
