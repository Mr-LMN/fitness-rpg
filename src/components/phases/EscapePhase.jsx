import React, { useState } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import TTSLine from "../TTSLine";

function EscapePhase({ setGameState, slamBallGoal = 10, squatJumpGoal = 15 }) {
  const [slamBalls, setSlamBalls] = useState(0);
  const [jumpSquats, setJumpSquats] = useState(0);

  const handleBreakOut = () => {
    if (slamBalls >= slamBallGoal || jumpSquats >= squatJumpGoal) {
      alert("You successfully escaped the locker room!");
      setGameState((prev) => ({
        ...prev,
        introStage: 4, // ✅ Progress to MapIntroduction
        badges: prev.badges.includes("lockerEscapee")
          ? prev.badges
          : [...prev.badges, "lockerEscapee"],
      }));
      playSound('openingDoor');
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
        {narrationLines.general.escaping.slice(0,3).map((line, idx) => (
          <TTSLine key={idx} text={line} />
        ))}
        <div>
          <TTSLine text={narrationLines.general.escaping[3].replace('{slamBallGoal}', slamBallGoal)} />
          <button onClick={() => setSlamBalls(slamBalls + 1)}>Do Slam Ball</button>
          <p>Progress: {slamBalls}/{slamBallGoal}</p>
        </div>
        <div>
          <TTSLine text={narrationLines.general.escaping[4].replace('{squatJumpGoal}', squatJumpGoal)} />
          <button onClick={() => setJumpSquats(jumpSquats + 1)}>Do Squat Jump</button>
          <p>Progress: {jumpSquats}/{squatJumpGoal}</p>
        </div>
        <button onClick={handleBreakOut}>Break Out</button>
      </div>
    </div>
  );
}

export default EscapePhase;
