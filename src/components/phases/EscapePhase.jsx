import React, { useState } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";

function EscapePhase({ setGameState, slamBallGoal = 10, squatJumpGoal = 15 }) {
  const [slamBalls, setSlamBalls] = useState(0);
  const [jumpSquats, setJumpSquats] = useState(0);

  const handleBreakOut = () => {
    if (slamBalls >= slamBallGoal || jumpSquats >= squatJumpGoal) {
      alert("You successfully escaped the locker room!");
      setGameState((prev) => ({ ...prev, introStage: 4 })); // ✅ Progress to MapIntroduction
    } else {
      alert("Complete the required exercises to escape!");
    }
  };

  return (
    <div className="room-container">
      <img src="/Escape_route.png" alt="Possible Escape" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2>🔧 Escape Options</h2>
        <p>
          You finally grab the object—it’s a flathead screwdriver. Not much… but it could help.
        </p>
        <p>
          You check the door: locked. But maybe you can loosen it. Or… there's a bench nearby. Could
          you climb and escape through the ceiling tiles?
        </p>
        <p>🧠 Choose your escape route:</p>
        <div>
          <p>💪 Use the screwdriver to jimmy the lock—{slamBallGoal} slam balls</p>
          <button onClick={() => setSlamBalls(slamBalls + 1)}>Do Slam Ball</button>
          <p>Progress: {slamBalls}/{slamBallGoal}</p>
        </div>
        <div>
          <p>⚡ Leap onto the bench and push up into the tiles—{squatJumpGoal} squat jumps</p>
          <button onClick={() => setJumpSquats(jumpSquats + 1)}>Do Squat Jump</button>
          <p>Progress: {jumpSquats}/{squatJumpGoal}</p>
        </div>
        <button onClick={handleBreakOut}>Break Out</button>
      </div>
    </div>
  );
}

export default EscapePhase;
