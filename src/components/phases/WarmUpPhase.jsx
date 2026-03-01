import React, { useEffect, useState } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";

function WarmUpPhase({ setGameState, gameState = {} }) {
  const [showRow, setShowRow] = useState(false);
  const { textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' } = gameState;

  useEffect(() => {
    const timer = setTimeout(() => playSound('rowing'), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="room-container">
      <img src="/images/RowingMachine.png" alt="Rowing Machine" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2 className="phase-heading">WARM-UP PROTOCOL</h2>
        {!showRow ? (
          <ScrollingNarrationBox
            lines={narrationLines.general.warmupIntro}
            autoRead={textToSpeech}
            enhancedMode={enhancedReading}
            readingAge={readingAge}
            onComplete={() => setShowRow(true)}
          />
        ) : (
          <div className="warmup-action-panel">
            <p className="warmup-instruction">
              TITAN's sensors are watching. Complete a <strong>500m row</strong> to prove you're ready.
            </p>
            <div className="warmup-target-display">
              <span className="warmup-target-number">500m</span>
              <span className="warmup-target-label">Row Target</span>
            </div>
            <button
              className="primary-btn warmup-confirm-btn"
              onClick={() => {
                playSound('footsteps');
                setGameState((prev) => ({ ...prev, introStage: 2 }));
              }}
            >
              I've rowed 500m
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WarmUpPhase;
