import React, { useEffect, useState } from 'react';
import { speakText, isTtsEnabled, subscribeToTts } from '../utils';

function TTSLine({ text = '', autoRead, className = '' }) {
  const safeText = text || '';
  const [display, setDisplay] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(isTtsEnabled());
  const shouldAutoRead = autoRead ?? true;

  useEffect(() => {
    const unsubscribe = subscribeToTts(setTtsEnabled);
    return unsubscribe;
  }, []);

  useEffect(() => {
    let i = 0;
    setDisplay('');
    const interval = setInterval(() => {
      i += 1;
      setDisplay(safeText.slice(0, i));
      if (i >= safeText.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [safeText]);

  useEffect(() => {
    if (!shouldAutoRead || !ttsEnabled || !safeText) return undefined;
    const timeout = setTimeout(() => speakText(safeText), Math.max(safeText.length * 30, 300));
    return () => clearTimeout(timeout);
  }, [shouldAutoRead, safeText, ttsEnabled]);

  return (
    <p className={`tts-line ${className}`.trim()}>
      {display}
      <button
        type="button"
        onClick={() => speakText(safeText)}
        aria-label="Play narration"
        className="tts-play"
      >
        Play
      </button>
    </p>
  );
}

export default TTSLine;
