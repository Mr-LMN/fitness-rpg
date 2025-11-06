import React, { useEffect, useState } from 'react';
import { speakText, isTtsEnabled, subscribeToTts } from '../utils';

function TTSLine({ text, autoRead, className = '' }) {
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
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    if (!shouldAutoRead || !ttsEnabled) return undefined;
    const timeout = setTimeout(() => speakText(text), Math.max(text.length * 30, 300));
    return () => clearTimeout(timeout);
  }, [shouldAutoRead, text, ttsEnabled]);

  return (
    <p className={`tts-line ${className}`.trim()}>
      {display}
      <button
        type="button"
        onClick={() => ttsEnabled && speakText(text)}
        aria-label="Play narration"
        className="tts-play"
        disabled={!ttsEnabled}
      >
        🔊
      </button>
    </p>
  );
}

export default TTSLine;
