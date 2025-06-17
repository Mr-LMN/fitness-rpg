import React, { useEffect, useState } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import WarmupDisplay from "../WarmupDisplay";

function WarmUpPhase({ setGameState, gameState }) {
  const [showWarmup, setShowWarmup] = useState(false);
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
          {showWarmup ? (
            <WarmupDisplay
              focus={gameState?.workoutFocus}
              onComplete={() =>
                setGameState((prev) => ({ ...prev, introStage: 2 }))
              }
            />
          ) : (
            <>
              {narrationLines.general.warmupIntro.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
              <button onClick={() => setShowWarmup(true)}>Start Warm-Up</button>
            </>
          )}
        </div>
      </div>
    );
  }

  export default WarmUpPhase;
