import React, { useState, useEffect } from "react";
import ParallaxDust from "../ParallaxDust";
import BlazePods from "../BlazePods";
import "../styles/RoomScene.css";

function FinalBossPhase({ setGameState }) {
  const [timer, setTimer] = useState(0);
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleFinished, setBattleFinished] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (battleStarted && !battleFinished) {
      const id = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [battleStarted, battleFinished]);

  const handleStart = () => {
    setBattleStarted(true);
  };

  const handleFinish = () => {
    clearInterval(intervalId);
    setBattleFinished(true);

    setGameState((prev) => ({
      ...prev,
      bossDefeated: true,
      victory: true,
      leaderboardEntry: {
        time: timer,
        date: new Date().toISOString(),
        workout: "Operation Slamstorm",
      },
    }));
  };

  return (
    <div className={`room-container ${battleStarted ? "interaction" : ""}`}>
      <img src="/FitnessSuite.png" alt="Fitness Suite" className="scene-image" />
      <ParallaxDust />
      <BlazePods />
      <div className="room-content rpg-text">
        <h1>🏋️ Final Battle: Operation Slamstorm</h1>
        <h2>🔥 Hero Workout: 21-15-9</h2>
        <ul>
          <li>21 Calories on Assault Bike</li>
          <li>15 Slam Balls</li>
          <li>9 Burpees</li>
        </ul>

      {!battleStarted && (
        <>
          <p>
            You've successfully avoided Mrs. Roche's monstrous attacks. She stumbles, exhausted, her mutated form steaming in the cold air.
          </p>
          <p>
            Now's your chance. Finish her with one final powerful Slam Ball to end the nightmare. Begin your final workout now!
          </p>
          <button onClick={handleStart} className="start-btn">
            Start Boss Battle
          </button>
        </>
      )}

      {battleStarted && !battleFinished && (
        <>
          <p>⏱️ Time Elapsed: <strong>{timer}s</strong></p>
          <button onClick={handleFinish} className="finish-btn">
            Finish Workout
          </button>
        </>
      )}

        {battleFinished && (
          <div className="victory-summary">
            <h3>🎉 Victory Achieved!</h3>
          <p>Mutated Mrs. Roche collapses in defeat, the air clearing as silence returns.</p>
          <p>You completed <strong>Operation Slamstorm</strong> in <strong>{timer} seconds</strong>.</p>
          <p>Your heroic effort has been immortalized on the school leaderboard.</p>
          </div>
        )}
        </div>
      </div>
    );
}

export default FinalBossPhase;
