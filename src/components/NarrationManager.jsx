import React, { useState, useEffect, useCallback } from 'react';
import TTSLine from './TTSLine';

function NarrationManager({ lines = [], onComplete, backgroundImage }) {
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    if (index + 1 < lines.length) {
      setIndex(index + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, lines, onComplete]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        advance();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance]);

  const style = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <div className="narration-manager" onClick={advance} style={style}>
      <TTSLine text={lines[index]} />
      {lines.length > 1 && <p className="continue-hint">(click or press space)</p>}
    </div>
  );
}

export default NarrationManager;
