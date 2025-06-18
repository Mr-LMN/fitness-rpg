import React, { useEffect } from 'react';
import { speakText } from '../utils';

function TTSLine({ text, autoRead }) {
  useEffect(() => {
    if (autoRead) {
      speakText(text);
    }
  }, [text, autoRead]);

  return (
    <p>
      {text}{' '}
      <button onClick={() => speakText(text)} aria-label="Play voice">
        🔊 Play Voice
      </button>
    </p>
  );
}

export default TTSLine;
