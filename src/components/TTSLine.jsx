import React, { useEffect } from 'react';
import { speakText } from '../utils';

function TTSLine({ text, autoRead }) {
  useEffect(() => {
    if (autoRead) {
      speakText(text);
    }
  }, [text, autoRead]);

  return (
    <p className="tts-line">
      {text}
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
