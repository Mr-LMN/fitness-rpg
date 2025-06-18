import React, { useEffect } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playVoice, playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import TTSLine from "../TTSLine";

function IntroPhase({ setGameState }) {
  useEffect(() => {
    playVoice('/voices/intro-phase.wav');
  }, []);
  return (
    <div className="room-container">
      <img src="/locker_Room.png" alt="Locker Room" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2>🧊 Locked In</h2>
        {narrationLines.general.introPhase.map((line, idx) => (
          <TTSLine key={idx} text={line} />
        ))}
        <button onClick={() => {
          playSound('footsteps');
          setGameState((prev) => ({ ...prev, introStage: 1 }));
        }}>
          Get Moving
        </button>
      </div>
    </div>
  );
}

export default IntroPhase;