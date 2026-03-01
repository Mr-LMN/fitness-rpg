import React from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";

function MobilityPhase({ setGameState, gameState = {} }) {
  const { textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' } = gameState;

  return (
    <div className="room-container">
      <img src="/Shiny_Object.png" alt="Shiny Object" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2 className="phase-heading">HIDDEN OBJECT</h2>
        <ScrollingNarrationBox
          lines={narrationLines.general.mobilityPhase}
          autoRead={textToSpeech}
          enhancedMode={enhancedReading}
          readingAge={readingAge}
          onComplete={() => {
            setGameState((prev) => ({ ...prev, introStage: 3 }));
            playSound();
          }}
        />
      </div>
    </div>
  );
}

export default MobilityPhase;
