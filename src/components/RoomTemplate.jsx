import React, { useState } from 'react';
import narrationLines from '../data/narrationLines';
import NarrationManager from './NarrationManager';
import WorkoutLogger from './WorkoutLogger';
import QuizPhase from './phases/QuizPhase';
import BossFightPhase from './phases/BossFightPhase';
import WarmupDisplay from './WarmupDisplay';

const roomImages = {
  "Mr. Watkins' Room": '/Mr_WatkinsRoom.png',
  "Mrs. John's Room": '/Mrs_JohnsRoom.png',
  "Mrs. Roche's Room": '/Mrs_RochesRoom.png',
  'Fitness Suite': '/FitnessSuite.png',
};

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
  requiresWarmup = false,
  hasWorkout = false,
  hasScavenge = false,
  unlocksRoom = null,
}) {
  const [stage, setStage] = useState('narration');
  const [loot, setLoot] = useState(null);
  const [warmupDone, setWarmupDone] = useState(!requiresWarmup);

  const lines = Array.isArray(narrationKey) ? narrationKey : getLinesByKey(narrationKey);

  const handleNarrationDone = () => {
    if (requiresWarmup && !warmupDone) setStage('warmup');
    else if (hasWorkout) setStage('workout');
    else if (hasScavenge) setStage('scavenge');
    else setStage('complete');
  };

  const handleWarmupComplete = () => {
    setWarmupDone(true);
    if (hasWorkout) setStage('workout');
    else if (hasScavenge) setStage('scavenge');
    else setStage('complete');
  };

  const handleWorkoutComplete = () => {
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
    }));
    if (hasScavenge) setStage('scavenge');
    else if (quiz) setStage('quiz');
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

  const handleScavengeComplete = () => {
    const item = 'mysterious keycard';
    setGameState((prev) => {
      const updates = {
        inventory: [...(prev.inventory || []), { item }],
      };
      if (unlocksRoom && !prev.visibleRooms.includes(unlocksRoom)) {
        updates.visibleRooms = [...prev.visibleRooms, unlocksRoom];
      }
      return { ...prev, ...updates };
    });
    setLoot(item);
    if (lootPool) setStage('loot');
    else setStage('complete');
  };

  const handleLoot = () => {
    const found = getRandomLoot(lootPool);
    if (found) {
      setGameState((prev) => {
        const updates = {
          inventory: [...(prev.inventory || []), found],
        };
        if (
          mapMarker === "Mr. Watkins' Room" &&
          found.includes('Map Piece') &&
          !prev.visibleRooms.includes("Mrs. John's Room")
        ) {
          updates.visibleRooms = [...prev.visibleRooms, "Mrs. John's Room"];
        }
        return { ...prev, ...updates };
      });
      setLoot(found);
    }
    setStage('complete');
  };

  if (stage === 'narration') {
    return (
      <NarrationManager
        lines={lines}
        onComplete={handleNarrationDone}
        backgroundImage={roomImages[mapMarker]}
      />
    );
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
    const img = roomImages[mapMarker];
    return (
      <div className="room-container">
        {img && <img src={img} alt={mapMarker} className="scene-image" />}
        <div className="room-content">
          <WorkoutLogger
            roomNumber={mapMarker}
            setGameState={setGameState}
            workoutFocus={workoutFocus || gameState.workoutFocus}
            userId={gameState.studentName}
            onComplete={handleWorkoutComplete}
            completeLabel="Upload Your Workout"
          />
        </div>
      </div>
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

  if (stage === 'scavenge') {
    const scavengeLines = narrationLines.languages.room1.scavenge || [];
    return (
      <div className="rpg-text room-content">
        {scavengeLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        <button onClick={handleScavengeComplete}>Investigate</button>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="rpg-text room-content">
        {loot &&
          (loot.includes('Map Piece') && mapMarker === "Mr. Watkins' Room"
            ? (
                <p>
                  {narrationLines.languages.room1.foundItem.replace(
                    '{item}',
                    loot
                  )}
                </p>
              )
            : (
                <p>You found {loot}!</p>
              ))}
        {mapMarker === "Mr. Watkins' Room" && (
          <p>{narrationLines.languages.room1.rest}</p>
        )}
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
