import React, { useState, useEffect, useMemo } from "react";
import ParallaxDust from "../ParallaxDust";
import BlazePods from "../BlazePods";
import { playSound, updateLifetimeSummary, logWorkoutMinutes } from "../../utils";
import TTSLine from "../TTSLine";
import "../styles/RoomScene.css";

function FinalBossPhase({ setGameState, onQuestEvent = () => {} }) {
  const [timer, setTimer] = useState(0);
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleFinished, setBattleFinished] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const formattedTime = useMemo(() => {
    if (timer < 60) return `${timer}s`;
    const minutes = Math.floor(timer / 60);
    const remaining = timer % 60;
    if (remaining === 0) return `${minutes}m`;
    return `${minutes}m ${remaining.toString().padStart(2, "0")}s`;
  }, [timer]);

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
    playSound('alarm');
    setBattleStarted(true);
  };

  const handleFinish = () => {
    clearInterval(intervalId);
    setBattleFinished(true);

    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 50,
      bossDefeated: true,
      victory: true,
      inventory: [
        ...(prev.inventory || []),
        {
          id: 'map_piece_2',
          name: 'Map Piece #2 (Maths Department)',
          rarity: 'rare',
          description: 'A scrap leading to the Maths Department.',
          isNew: true,
        },
      ],
      badges: [
        ...prev.badges,
        ...(prev.badges.includes("bossVanquisher") ? [] : ["bossVanquisher"]),
        ...(timer <= 120 && !prev.badges.includes("speedRunner")
          ? ["speedRunner"]
          : []),
        ...(timer <= 100 && !prev.badges.includes("topTen") ? ["topTen"] : []),
      ],
      leaderboardEntry: {
        time: timer,
        date: new Date().toISOString(),
        workout: "Operation Slamstorm",
      },
    }));
    updateLifetimeSummary({ calories: 0, bossesDefeated: 1 });
    logWorkoutMinutes(timer / 60);
    playSound();
    onQuestEvent('bossDefeated', { room: 'Fitness Suite', timer });
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
              The fitness suite lights flare to life. Mrs. Roche’s mutated silhouette
              staggers between overturned machines, her roar echoing off the mirrors.
            </p>
            <p>
              You plant your feet on the Assault Bike platforms. This is the last
              circuit between your crew and daylight—push until the alarms fall silent.
            </p>
            <TTSLine text="Mrs. Roche reels, the Blaze Pods primed around you. Strap in and start the finisher before she rallies." />
            <button onClick={handleStart} className="start-btn">
              Start Boss Battle
            </button>
          </>
        )}

        {battleStarted && !battleFinished && (
          <>
            <TTSLine text={`⏱️ Time Elapsed: ${formattedTime}`} />
            <p className="victory-summary">
              Keep driving—Slam Balls, Burpees, and Bike calories are your last keys out.
            </p>
            <button onClick={handleFinish} className="finish-btn">
              Finish Workout
            </button>
          </>
        )}

        {battleFinished && (
          <>
            <div className="victory-summary">
              <h3>🎉 Victory Achieved!</h3>
              <p>Mrs. Roche crashes to the rubber flooring. The alarms taper into silence.</p>
              <TTSLine text="Mutated Mrs. Roche collapses in defeat, the air clearing as silence returns." />
              <TTSLine text={`You completed Operation Slamstorm in ${formattedTime}.`} />
              <TTSLine text="Your heroic effort has been immortalized on the school leaderboard." />
            </div>
            <p>
              Among the scattered equipment you spot Map Piece #2 – the Maths Department
              wing. It slides neatly into your scavenged bag.
            </p>
            <TTSLine text="You’ve finished scavenging and discovered Map Piece #2 (Maths Department). It’s been added to your backpack for later use." />
          </>
        )}
      </div>
    </div>
  );
}

export default FinalBossPhase;
