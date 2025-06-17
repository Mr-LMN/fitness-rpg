import React, { useState } from 'react';
import narrationLines from '../data/narrationLines';
import NarrationManager from './NarrationManager';
import WorkoutLogger from './WorkoutLogger';
import QuizPhase from './phases/QuizPhase';
import BossFightPhase from './phases/BossFightPhase';
import WarmupDisplay from './WarmupDisplay';

function getLinesByKey(key) {
  return key.split('.').reduce((obj, part) => (obj ? obj[part] : null), narrationLines) || [];
}

const getRandomLoot = (pool = []) => {
  if (!Array.isArray(pool) || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
};

function RoomTemplate({
  narrationKey,
  workoutFocus,
  quiz,
  boss,
  lootPool,
  mapMarker,
  gameState,
  setGameState,
  requiresWarmup,
}) {
  const [stage, setStage] = useState('narration');
  const [loot, setLoot] = useState(null);
  const [warmupDone, setWarmupDone] = useState(!requiresWarmup);

  const lines = Array.isArray(narrationKey) ? narrationKey : getLinesByKey(narrationKey);

  const handleNarrationDone = () => {
    if (requiresWarmup && !warmupDone) setStage('warmup');
    else setStage('workout');
  };

  const handleWarmupComplete = () => {
    setWarmupDone(true);
    setStage('workout');
  };

  const handleWorkoutComplete = () => {
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
    }));
    if (quiz) setStage('quiz');
    else if (boss) setStage('boss');
    else if (lootPool) setStage('loot');
    else setStage('complete');
  };

  const handleQuizComplete = (correct) => {
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + correct * 5,
    }));
    if (boss) setStage('boss');
    else if (lootPool) setStage('loot');
    else setStage('complete');
  };

  const handleBossComplete = () => {
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 20,
      completedRooms: [...(prev.completedRooms || []), mapMarker],
    }));
    if (lootPool) setStage('loot');
    else setStage('complete');
  };

  const handleLoot = () => {
    const found = getRandomLoot(lootPool);
    if (found) {
      setGameState((prev) => ({
        ...prev,
        inventory: [...(prev.inventory || []), found],
      }));
      setLoot(found);
    }
    setStage('complete');
  };

  if (stage === 'narration') {
    return <NarrationManager lines={lines} onComplete={handleNarrationDone} />;
  }

  if (stage === 'warmup') {
    return (
      <WarmupDisplay
        focus={workoutFocus || gameState.workoutFocus}
        onComplete={handleWarmupComplete}
      />
    );
  }

  if (stage === 'workout') {
    return (
      <WorkoutLogger
        roomNumber={mapMarker}
        setGameState={setGameState}
        workoutFocus={workoutFocus || gameState.workoutFocus}
        userId={gameState.studentName}
        onComplete={handleWorkoutComplete}
        completeLabel="Upload Your Workout"
      />
    );
  }

  if (stage === 'quiz') {
    return <QuizPhase questions={quiz} onComplete={handleQuizComplete} />;
  }

  if (stage === 'boss') {
    return <BossFightPhase config={boss} gameState={gameState} setGameState={setGameState} onComplete={handleBossComplete} />;
  }

  if (stage === 'loot') {
    return (
      <div className="rpg-text room-content">
        <p>You search the room...</p>
        <button onClick={handleLoot}>See what you find</button>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="rpg-text room-content">
        {loot && <p>You found {loot}!</p>}
        <button
          onClick={() =>
            setGameState((prev) => ({
              ...prev,
              currentRoom: null,
              introStage: 5,
              showOverlay: true,
            }))
          }
        >
          Return to Map
        </button>
      </div>
    );
  }

  return null;
}

export default RoomTemplate;
