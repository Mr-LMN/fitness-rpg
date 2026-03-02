import React from 'react';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

function GlobalAudioControls({ muted, toggleMute, tts, toggleTts }) {
  return (
    <div className="global-audio-controls" role="group" aria-label="Audio preferences">
      <button
        type="button"
        onClick={toggleMute}
        aria-pressed={muted}
        className={`audio-toggle ${muted ? 'is-off' : 'is-on'}`}
      >
        <span className="audio-icon" aria-hidden="true">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </span>
        <span className="audio-label">{muted ? 'Sound Off' : 'Sound On'}</span>
      </button>
      <button
        type="button"
        onClick={toggleTts}
        aria-pressed={tts}
        className={`audio-toggle ${tts ? 'is-on' : 'is-off'}`}
      >
        <span className="audio-icon" aria-hidden="true">
          {tts ? <Mic size={16} /> : <MicOff size={16} />}
        </span>
        <span className="audio-label">{tts ? 'Narrator On' : 'Narrator Off'}</span>
      </button>
    </div>
  );
}

export default GlobalAudioControls;
