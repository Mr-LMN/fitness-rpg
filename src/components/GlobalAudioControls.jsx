import React from 'react';

function GlobalAudioControls({ muted, toggleMute, tts, toggleTts }) {
  return (
    <div className="global-audio-controls">
      <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
        {muted ? '🔇' : '🔊'}
      </button>
      <button onClick={toggleTts} aria-label={tts ? 'Disable text to speech' : 'Enable text to speech'}>
        {tts ? '🗣️' : '💬'}
      </button>
    </div>
  );
}

export default GlobalAudioControls;
