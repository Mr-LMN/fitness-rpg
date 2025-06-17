import React, { useState } from 'react';
import narrationLines from '../data/narrationLines';
import NarrationManager from './NarrationManager';
import WorkoutLogger from './WorkoutLogger';
import QuizPhase from './phases/QuizPhase';
import BossFightPhase from './phases/BossFightPhase';
import WarmupDisplay from './WarmupDisplay';
import SafeQuizEvent from './events/SafeQuizEvent';
import { getRandomLoot } from '../data/lootTable';

const roomImages = {
  "Mr. Watkins' Room": '/Mr_WatkinsRoom.png',
  "Mrs. John's Room": '/Mrs_JohnsRoom.png',
  "Mrs. Roche's Room": '/Mrs_RochesRoom.png',
  'Fitness Suite': '/FitnessSuite.png',
};

function getLinesByKey(key) {
  return key.split('.').reduce((obj, part) => (obj ? obj[part] : null), narrationLines) || [];
}


function RoomTemplate({
  narrationKey,
  workoutFocus,
  quiz,
  safeQuiz,
  safeIntroKey,
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
  const [warmupFocus, setWarmupFocus] = useState(gameState.workoutFocus || 'legs');

  const lines = Array.isArray(narrationKey)
    ? narrationKey
    : getLinesByKey(narrationKey);
  const safeIntroLines = safeIntroKey ? getLinesByKey(safeIntroKey) : [];

  const handleNarrationDone = () => {
    if (requiresWarmup && !warmupDone) setStage('warmupPrompt');
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

  const handleWarmupDecision = (wantWarmup) => {
    if (wantWarmup) setStage('warmupSelect');
    else handleWarmupComplete();
  };

  const handleFocusSelect = (focus) => {
    setWarmupFocus(focus);
    setStage('warmup');
  };

  const handleWorkoutComplete = () => {
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
    }));
    if (safeQuiz) setStage('safeIntro');
    else if (hasScavenge) setStage('scavenge');
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
    setGameState((prev) => {
      const updates = {
        xp: (prev.xp || 0) + 20,
        completedRooms: [...(prev.completedRooms || []), mapMarker],
      };
      if (unlocksRoom && !prev.visibleRooms.includes(unlocksRoom)) {
        updates.visibleRooms = [...prev.visibleRooms, unlocksRoom];
      }
      return { ...prev, ...updates };
    });
    if (lootPool) setStage('loot');
    else setStage('complete');
  };

  const handleScavengeComplete = () => {
    const item = {
      id: 'scavenge_keycard',
      name: 'Mysterious Keycard',
      rarity: 'rare',
      description: 'Looks like it could open something important.',
    };
    setGameState((prev) => {
      const updates = {
        inventory: [...(prev.inventory || []), { ...item, isNew: true }],
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

  const handleSafeSuccess = (reward) => {
    setGameState((prev) => ({
      ...prev,
      inventory: [...(prev.inventory || []), { ...reward, isNew: true }],
    }));
    if (unlocksRoom && !gameState.visibleRooms.includes(unlocksRoom)) {
      setGameState((prev) => ({
        ...prev,
        visibleRooms: [...prev.visibleRooms, unlocksRoom],
      }));
    }
  };

  const handleSafeFailure = () => {};

  const handleLoot = () => {
    const found = getRandomLoot(lootPool);
    if (found) {
      setGameState((prev) => {
        const updates = {
          inventory: [...(prev.inventory || []), { ...found, isNew: true }],
        };
        if (
          mapMarker === "Mr. Watkins' Room" &&
          found.name.includes('Map Piece') &&
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

  if (stage === 'warmupPrompt') {
    return (
      <div className="rpg-text room-content">
        <p>Log your workout. Would you like a pre-built warm up before starting?</p>
        <button onClick={() => handleWarmupDecision(true)}>Yes</button>
        <button onClick={() => handleWarmupDecision(false)}>No</button>
      </div>
    );
  }

  if (stage === 'warmupSelect') {
    return (
      <div className="rpg-text room-content">
        <p>What are you training? Legs, Upper Body or Both?</p>
        <button onClick={() => handleFocusSelect('legs')}>Legs</button>
        <button onClick={() => handleFocusSelect('upperBody')}>Upper Body</button>
        <button onClick={() => handleFocusSelect('full')}>Both</button>
      </div>
    );
  }

  if (stage === 'warmup') {
    return (
      <WarmupDisplay
        focus={warmupFocus}
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

  if (stage === 'safeIntro') {
    return (
      <NarrationManager
        lines={safeIntroLines}
        onComplete={() => setStage('safeQuiz')}
        backgroundImage={roomImages[mapMarker]}
      />
    );
  }

  if (stage === 'safeQuiz') {
    return (
      <SafeQuizEvent
        questionPool={safeQuiz}
        onSuccess={handleSafeSuccess}
        onFailure={handleSafeFailure}
        onComplete={() => {
          if (lootPool) setStage('loot');
          else setStage('complete');
        }}
        roomName={mapMarker}
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
        {loot && (
          <p>
            You have finished scavenging for supplies and found{' '}
            <span className={`rarity-${loot.rarity} loot-new`}>{loot.name}</span>! This has
            been added to your backpack for later use.
          </p>
        )}
        {loot &&
          loot.name.includes('Map Piece') &&
          mapMarker === "Mr. Watkins' Room" && (
            <p>
              {narrationLines.languages.room1.foundItem.replace(
                '{item}',
                loot.name
              )}
            </p>
          )}
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
