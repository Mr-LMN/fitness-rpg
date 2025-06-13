import React from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";

function MobilityPhase({ setGameState }) {
  const handleStretchComplete = () => {
    // Transition to escape phase after completing stretches
    setGameState((prev) => ({ ...prev, introStage: 3 })); // Move to escape phase
  };

  return (
    <div className="room-container">
      <img src="/Shiny_Object.png" alt="Shiny Object" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2>🧍‍♂️ Mobility Stretch</h2>
        <p>
          With your blood flowing, you explore the changing room. A locker lies tipped on its side—
          underneath it, something shiny glints in the flickering light.
        </p>
        <p>
          You crawl forward… but your body is still stiff from the locker. You can’t quite reach.
        </p>
        <p>💪 Perform 10 lunges and 10 arm circles to loosen up.</p>
        <button onClick={handleStretchComplete}>Stretch Complete</button>
      </div>
    </div>
  );
}

export default MobilityPhase;