import React from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";

function IntroPhase({ setGameState }) {
  return (
    <div className="room-container">
      <img src="/locker_Room.png" alt="Locker Room" className="scene-image" />
      <ParallaxDust />
      <h2>🧊 Locked In</h2>
      <p>
        You were stuffed into a locker by bullies. You shouted for help, but no one came.
        Then… the evacuation alarm rang. Panic erupted outside. You screamed… and passed
        out from the lack of air.
      </p>
      <p>⏱️ 24 hours later…</p>
      <p>
        You awake—cold, cramped, and alone. The building is silent. Lights flicker. You
        scream again… nothing.
      </p>
      <p>
        💥 Using the last of your strength, you kick the locker door until it swings open.
        You collapse out onto the changing room floor, freezing cold.
      </p>
      <p>You must get warm fast or risk freezing in the dark...</p>
      <button onClick={() => setGameState((prev) => ({ ...prev, introStage: 1 }))}>
        Get Moving
      </button>
    </div>
  );
}

export default IntroPhase;