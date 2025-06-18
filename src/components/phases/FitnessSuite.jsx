import React, { useState } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";

function FitnessSuite({ setGameState }) {
  const [ready, setReady] = useState(false);

  const handleReady = () => {
    playSound('footsteps');
    setReady(true);
  };

  const handleStart = () => {
    playSound('alarm');
    setGameState((prev) => ({
      ...prev,
      currentRoom: 'Fitness Suite',
      showOverlay: false,
    }));
  };

  return (
    <div className="room-container">
      <img src="/FitnessSuite.png" alt="Fitness Suite" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        {!ready ? (
          <>
            <h2>🏃 Dash to the Fitness Suite</h2>
            <p>You sprint down the dark corridor toward the fitness suite.</p>
            <p>Take a breath and prepare for the hero workout.</p>
            <button onClick={handleReady}>I'm Ready</button>
          </>
        ) : (
          <>
            <h2>🔥 Hero Workout: 21-15-9</h2>
            <ul>
              <li>21 Calories on Assault Bike</li>
              <li>15 Slam Balls</li>
              <li>9 Burpees</li>
            </ul>
            <button onClick={handleStart}>Start Final Battle</button>
          </>
        )}
      </div>
    </div>
  );
}

export default FitnessSuite;
