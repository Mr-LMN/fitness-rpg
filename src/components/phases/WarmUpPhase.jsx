import React, { useEffect } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";

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
        <p>
          Your muscles ache. You shuffle across the room, rubbing your arms. You spot a dusty
          rowing machine still plugged in.
        </p>
        <p>🏃 To raise your heart rate, complete a 500m row.</p>
        <button onClick={() => setGameState((prev) => ({ ...prev, introStage: 2 }))}>
          Row Complete
        </button>
      </div>
    </div>
  );
}

export default WarmUpPhase;