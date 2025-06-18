import React from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";

function MobilityPhase({ setGameState }) {
  const handleGrabObject = () => {
    // Move directly to the escape phase after retrieving the item
    setGameState((prev) => ({ ...prev, introStage: 3 }));
    playSound();
  };

  return (
    <div className="room-container">
      <img src="/Shiny_Object.png" alt="Shiny Object" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2>🔎 Hidden Object</h2>
        <p>
          As you explore the changing room, you spot a locker tipped on its side—
          underneath, something shiny glints in the flickering light.
        </p>
        <p>You reach carefully under the locker and feel a cold metal tool.</p>
        <button onClick={handleGrabObject}>Take the object</button>
      </div>
    </div>
  );
}

export default MobilityPhase;