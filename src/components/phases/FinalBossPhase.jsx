import React, { useState } from "react";
import WorkoutLogger from "../WorkoutLogger";

function FinalBossPhase({ gameState, setGameState }) {
  const [started, setStarted] = useState(false);
  const [finalLogged, setFinalLogged] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const handleVictory = () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds
    setGameState((prev) => ({
      ...prev,
      bossBattleTime: timeTaken,
      victory: true,
      introStage: 7,
      currentRoom: "Victory",
    }));
  };

  return (
    <div className="final-boss-container">
      <h1>🏋️ Final Battle: Operation Slamstorm</h1>

      {!started ? (
        <>
          <p>You reach the Fitness Suite — but Mrs. Roche crashes in behind you.</p>
          <p>There’s no escape now. It’s time to end this.</p>
          <button onClick={handleStart}>Start Boss Battle</button>
        </>
      ) : !finalLogged ? (
        <>
          <h3>🔥 Hero Workout: 21-15-9</h3>
          <ul>
            <li>21 Calories on Assault Bike</li>
            <li>15 Slam Balls</li>
            <li>9 Burpees</li>
          </ul>
          <WorkoutLogger roomNumber={"BossFinal"} setGameState={setGameState} />
          <button onClick={() => setFinalLogged(true)}>I Logged My Workout</button>
        </>
      ) : (
        <>
          <p>Mrs. Roche collapses with a roar. You’ve done it.</p>
          <p>🏆 Based on your quiz score, loot has been generated!</p>
          <button onClick={handleVictory}>Claim Victory</button>
        </>
      )}
    </div>
  );
}

export default FinalBossPhase;
