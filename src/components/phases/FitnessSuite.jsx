import React, { useState } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";

function FitnessSuite({ setGameState, gameState = {} }) {
  const [narrativeDone, setNarrativeDone] = useState(false);
  const { textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' } = gameState;

  const handleStart = () => {
    playSound('alarm');
    setGameState((prev) => ({
      ...prev,
      currentRoom: 'Fitness Suite',
      showOverlay: false,
    }));
  };

  return (
    <div className="room-container">
      <img src="/images/FitnessSuite.png" alt="Fitness Suite" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        {!narrativeDone ? (
          <>
            <h2 className="phase-heading phase-heading--danger">FINAL ASSESSMENT</h2>
            <ScrollingNarrationBox
              lines={narrationLines.general.finalBossBriefing}
              autoRead={textToSpeech}
              enhancedMode={enhancedReading}
              readingAge={readingAge}
              onComplete={() => setNarrativeDone(true)}
            />
          </>
        ) : (
          <>
            <h2 className="phase-heading phase-heading--danger">OPERATION SLAMSTORM</h2>
            <div className="fitness-suite-preview">
              <div className="fitness-suite-exercise">
                <span className="fse-target">21</span>
                <span className="fse-name">Assault Bike Calories</span>
              </div>
              <div className="fitness-suite-exercise">
                <span className="fse-target">15</span>
                <span className="fse-name">Slam Balls</span>
              </div>
              <div className="fitness-suite-exercise">
                <span className="fse-target">9</span>
                <span className="fse-name">Burpees</span>
              </div>
            </div>
            <button className="primary-btn" onClick={handleStart}>
              Enter the Arena
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default FitnessSuite;
