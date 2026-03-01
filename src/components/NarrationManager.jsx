import React, { useState, useEffect, useCallback } from 'react';
import TTSLine from './TTSLine';
import { getReadingProfile } from '../helpers/readingProfile';
import { adaptNarrative } from '../helpers/narrativeAdapter';

function NarrationManager({ lines = [], onComplete, backgroundImage, readingAge = 'not-sure' }) {
  const profile = getReadingProfile(readingAge);
  const adaptedLines = adaptNarrative(lines, profile);

  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    if (index + 1 < adaptedLines.length) {
      setIndex(index + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, adaptedLines, onComplete]);

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

  if (!adaptedLines.length) return null;

  return (
    <div className="narration-manager" onClick={advance} style={style}>
      <TTSLine text={adaptedLines[index]} />
      {adaptedLines.length > 1 && <p className="continue-hint">(click or press space)</p>}
    </div>
  );
}

export default NarrationManager;
