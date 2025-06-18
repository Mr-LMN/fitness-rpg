import React, { useEffect } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import TTSLine from "../TTSLine";

function WarmUpPhase({ setGameState }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      playSound('rowing');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="room-container">
      <img src="/RowingMachine.png" alt="Rowing Machine" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2>🔥 Warm-Up</h2>
        {narrationLines.general.warmupIntro.map((line, idx) => (
          <TTSLine key={idx} text={line} />
        ))}
        <button onClick={() => setGameState((prev) => ({ ...prev, introStage: 2 }))}>
          I've rowed 500m
        </button>
      </div>
    </div>
  );
}

export default WarmUpPhase;
