import React, { useState, useEffect } from 'react';

/**
 * TITAN transmission — A typing-effect message box styled as an AI broadcast.
 * Used for atmospheric story beats between phases.
 */
function TitanTransmission({ message, onComplete, delay = 30, autoAdvance = 3000 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!message) return;
    let i = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [message, delay]);

  useEffect(() => {
    if (!done || !onComplete) return;
    const timer = setTimeout(onComplete, autoAdvance);
    return () => clearTimeout(timer);
  }, [done, onComplete, autoAdvance]);

  return (
    <div className="titan-transmission" role="status" aria-live="polite">
      <div className="titan-transmission-header">
        <span className="titan-transmission-dot" />
        <span className="titan-transmission-label">TITAN BROADCAST</span>
      </div>
      <p className="titan-transmission-text">
        {displayed}
        {!done && <span className="titan-cursor">|</span>}
      </p>
      {done && onComplete && (
        <button className="titan-transmission-skip" onClick={onComplete}>
          Continue
        </button>
      )}
    </div>
  );
}

export default TitanTransmission;
