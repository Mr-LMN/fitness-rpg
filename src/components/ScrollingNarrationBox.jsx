import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './ScrollingNarrationBox.module.css';
import TTSLine from './TTSLine';
import { getReadingProfile } from '../helpers/readingProfile';
import { adaptNarrative } from '../helpers/narrativeAdapter';

/**
 * ScrollingNarrationBox — cinematic typewriter narration with progress dots.
 *
 * Click / Space while typing = skip to full text immediately.
 * Click / Space after reveal = advance to next line.
 */
function ScrollingNarrationBox({
  lines = [],
  enhancedMode = false,
  autoRead = false,
  readingAge = 'not-sure',
  onComplete,
  speaker = null,       // optional speaker label e.g. "TITAN" or "Mr. Watkins"
  speakerColor = null,  // optional CSS colour for speaker name
}) {
  const readingProfile = getReadingProfile(readingAge);
  const adaptedLines = adaptNarrative(lines, readingProfile);

  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const charRef = useRef(0);

  const fullText = adaptedLines[index] || '';

  // Typing speed (ms per character) — faster for older readers
  const typeSpeed =
    readingProfile.level === 'entry'  ? 55 :
    readingProfile.level === 'simple' ? 42 : 22;

  // Reset & start typewriter when line index changes
  useEffect(() => {
    clearTimeout(timerRef.current);
    setDisplayText('');
    setIsTyping(true);
    charRef.current = 0;

    if (!fullText.length) { setIsTyping(false); return; }

    const tick = () => {
      charRef.current += 1;
      setDisplayText(fullText.slice(0, charRef.current));
      if (charRef.current < fullText.length) {
        timerRef.current = setTimeout(tick, typeSpeed);
      } else {
        setIsTyping(false);
      }
    };

    timerRef.current = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const skipToFull = useCallback(() => {
    clearTimeout(timerRef.current);
    setDisplayText(fullText);
    setIsTyping(false);
  }, [fullText]);

  const nextLine = useCallback(() => {
    // First action while typing = skip to end
    if (isTyping) { skipToFull(); return; }
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= adaptedLines.length) {
        setFinished(true);
        if (onComplete) onComplete();
        return prev;
      }
      return next;
    });
  }, [isTyping, skipToFull, adaptedLines.length, onComplete]);

  // Keyboard shortcut
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

  const isLarge = readingProfile.level === 'entry' || readingProfile.level === 'simple';

  return (
    <div
      className={[styles.box, enhancedMode ? styles.enhanced : ''].filter(Boolean).join(' ')}
      role="dialog"
      aria-live="polite"
      onClick={nextLine}
      style={isLarge ? { fontSize: '1.4rem' } : undefined}
    >
      {/* Progress dots — only for multi-line sequences */}
      {adaptedLines.length > 1 && (
        <div className={styles.progressDots} aria-hidden="true">
          {adaptedLines.map((_, i) => (
            <span
              key={i}
              className={[
                styles.dot,
                i === index ? styles.dotActive : '',
                i < index   ? styles.dotDone  : '',
              ].filter(Boolean).join(' ')}
            />
          ))}
        </div>
      )}

      {/* Speaker label */}
      {speaker && (
        <div
          className={styles.speaker}
          style={speakerColor ? { color: speakerColor } : undefined}
        >
          {speaker}
        </div>
      )}

      {/* Typewriter text + blinking cursor */}
      <div className={styles.lineContainer}>
        <span className={styles.line}>{displayText}</span>
        {isTyping && <span className={styles.cursor} aria-hidden="true" />}
      </div>

      {/* TTS: fires once line is fully revealed */}
      {autoRead && !isTyping && (
        <TTSLine key={index} text={fullText} autoRead className="sr-only" />
      )}

      {/* Action button */}
      <button
        onClick={(e) => { e.stopPropagation(); nextLine(); }}
        disabled={finished}
        className={styles.continueButton}
        aria-label={isTyping ? 'Skip text' : finished ? 'Done' : 'Continue'}
        style={isLarge ? { minHeight: '56px' } : undefined}
      >
        {finished
          ? '✓  Done'
          : isTyping
          ? 'Skip ▶'
          : adaptedLines.length > 1
          ? `▶  Continue  (${index + 1} / ${adaptedLines.length})`
          : '▶  Continue'}
      </button>

      {!finished && !isTyping && (
        <p className={styles.hint} aria-hidden="true">click or press Space</p>
      )}
    </div>
  );
}

export default ScrollingNarrationBox;
