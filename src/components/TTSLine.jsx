import React, { useEffect, useState } from 'react';
import { speakText } from '../utils';

function TTSLine({ text, autoRead, className = '' }) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplay('');
    const interval = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        if (autoRead) speakText(text);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text, autoRead]);

  return (
    <p className={`tts-line ${className}`.trim()}>
      {display}
      <button
        onClick={() => speakText(text)}
        aria-label="Play narration"
        className="tts-play"
      >
        🔊
      </button>
    </p>
  );
}

export default TTSLine;
