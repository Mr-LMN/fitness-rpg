import React, { useEffect } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playVoice, playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";

function IntroPhase({ setGameState, textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' }) {
  useEffect(() => {
    playVoice('/voices/intro-phase.wav');
  }, []);
  return (
    <div className="room-container">
      <img src="/locker_Room.png" alt="Locker Room" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2>🧊 Locked In</h2>
        <ScrollingNarrationBox
          lines={narrationLines.general.introPhase}
          autoRead={textToSpeech}
          enhancedMode={enhancedReading}
          readingAge={readingAge}
          onComplete={() => {
            playSound("footsteps");
            setGameState((prev) => ({ ...prev, introStage: 1 }));
          }}
        />
      </div>
    </div>
  );
}

export default IntroPhase;