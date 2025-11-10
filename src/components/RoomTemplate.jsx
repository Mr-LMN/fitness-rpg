import React, { useState, useEffect } from 'react';
import narrationLines from '../data/narrationLines';
import NarrationManager from './NarrationManager';
import WorkoutLogger from './WorkoutLogger';
import QuizPhase from './phases/QuizPhase';
import BossFightPhase from './phases/BossFightPhase';
import WarmupDisplay from './WarmupDisplay';
import SafeQuizEvent from './events/SafeQuizEvent';
import { getRandomLoot } from '../data/lootTable';
import FitnessSuite from './phases/FitnessSuite';
import ParallaxDust from './ParallaxDust';
import './styles/RoomScene.css';
import TTSLine from './TTSLine';

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
  quizIntroKey,
  lootPool,
  mapMarker,
  gameState,
  setGameState,
  userId,
  requiresWarmup = false,
  hasWorkout = false,
  hasScavenge = false,
  unlocksRoom = null,
  specialWorkout = null,
  onQuestEvent = () => {},
}) {
  const [stage, setStage] = useState('narration');
  const [loot, setLoot] = useState(null);
  const [failureExercise, setFailureExercise] = useState(null);
  const [warmupDone, setWarmupDone] = useState(!requiresWarmup);
  const [warmupFocus, setWarmupFocus] = useState(gameState.workoutFocus || 'legs');
  const img = roomImages[mapMarker];

  const lines = Array.isArray(narrationKey)
    ? narrationKey
    : getLinesByKey(narrationKey);
  const safeIntroLines = safeIntroKey ? getLinesByKey(safeIntroKey) : [];
  const quizIntroLines = quizIntroKey ? getLinesByKey(quizIntroKey) : [];

  useEffect(() => {
    if (stage === 'quizIntro') {
      const timer = setTimeout(() => setStage('quiz'), 10000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleNarrationDone = () => {
    if (requiresWarmup && !warmupDone) setStage('warmupPrompt');
    else if (hasWorkout) setStage('workout');
    else if (hasScavenge) setStage('scavenge');
    else setStage('complete');
  };

  const handleWarmupComplete = (completedWarmup = true) => {
    setWarmupDone(true);
    if (completedWarmup) {
      onQuestEvent('warmupComplete', {
        room: mapMarker,
        focus: warmupFocus,
      });
    }
    if (hasWorkout) setStage('workout');
    else if (hasScavenge) setStage('scavenge');
    else setStage('complete');
  };

  const handleWarmupDecision = (wantWarmup) => {
    if (wantWarmup) setStage('warmupSelect');
    else handleWarmupComplete(false);
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
    else if (quizIntroKey) setStage('quizIntro');
    else if (quiz) setStage('quiz');
    else if (boss) setStage('boss');
    else if (lootPool) setStage('loot');
    else setStage('complete');
  };

  const handleQuizComplete = (correct, total) => {
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + correct * 5,
    }));
    onQuestEvent('quizComplete', {
      room: mapMarker,
      correct,
      total,
    });
    if (mapMarker === "Mrs. Roche's Room") {
      setStage('fitnessPrep');
    } else if (boss) setStage('boss');
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
      if (mapMarker === "Mrs. Roche's Room") {
        updates.currentRoom = 'Fitness Suite';
        updates.showOverlay = true;
      }
      return { ...prev, ...updates };
    });
    onQuestEvent('bossDefeated', { room: mapMarker });
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

  const handleSafeFailure = (exercise) => {
    setFailureExercise(exercise);
  };

  const handleSafeComplete = () => {
    if (failureExercise) {
      setStage('safePenalty');
    } else if (lootPool) setStage('loot');
    else setStage('complete');
  };

  const handlePenaltyDone = () => {
    const reward = {
      id: 'safe_energy_bar',
      name: 'Energy Bar',
      rarity: 'uncommon',
      description: 'Restores stamina when used.',
    };
    handleSafeSuccess(reward);
    setFailureExercise(null);
    if (lootPool) setStage('loot');
    else setStage('complete');
  };

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
      <div className="room-container">
        {img && <img src={img} alt={mapMarker} className="scene-image" />}
        <ParallaxDust />
        <div className="room-content rpg-text">
          <TTSLine text="Log your workout. Would you like a pre-built warm up before starting?" />
          <button onClick={() => handleWarmupDecision(true)}>Yes</button>
          <button onClick={() => handleWarmupDecision(false)}>No</button>
        </div>
      </div>
    );
  }

  if (stage === 'warmupSelect') {
    return (
      <div className="room-container">
        {img && <img src={img} alt={mapMarker} className="scene-image" />}
        <ParallaxDust />
        <div className="room-content rpg-text">
          <TTSLine text="What are you training? Legs, Upper Body or Both?" />
          <button onClick={() => handleFocusSelect('legs')}>Legs</button>
          <button onClick={() => handleFocusSelect('upperBody')}>Upper Body</button>
          <button onClick={() => handleFocusSelect('full')}>Both</button>
        </div>
      </div>
    );
  }

  if (stage === 'warmup') {
    return (
      <div className="room-container">
        {img && <img src={img} alt={mapMarker} className="scene-image" />}
        <ParallaxDust />
        <WarmupDisplay
          focus={warmupFocus}
          onComplete={() => handleWarmupComplete(true)}
        />
      </div>
    );
  }

  if (stage === 'workout') {
    return (
      <div className="room-container">
        {img && <img src={img} alt={mapMarker} className="scene-image" />}
        <div className="room-content">
          <WorkoutLogger
            roomNumber={mapMarker}
            setGameState={setGameState}
            workoutFocus={workoutFocus || gameState.workoutFocus}
            userId={userId}
            yearGroup={gameState.yearGroup}
            specialWorkout={specialWorkout}
            onComplete={handleWorkoutComplete}
            onWorkoutLogged={({ focus }) =>
              onQuestEvent('workoutLogged', {
                room: mapMarker,
                focus:
                  focus ||
                  specialWorkout?.variant ||
                  workoutFocus ||
                  gameState.workoutFocus ||
                  'strength',
              })
            }
            title={`Log Your Workout (${mapMarker})`}
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
        onComplete={handleSafeComplete}
        roomName={mapMarker}
      />
    );
  }

  if (stage === 'quizIntro') {
    return (
      <NarrationManager
        lines={quizIntroLines}
        onComplete={() => setStage('quiz')}
        backgroundImage="/quiz_door.png"
      />
    );
  }

  if (stage === 'quiz') {
    return (
      <QuizPhase
        questions={quiz}
        onComplete={handleQuizComplete}
        showImpossibleFinal={mapMarker === "Mrs. Roche's Room"}
      />
    );
  }

  if (stage === 'fitnessPrep') {
    return <FitnessSuite setGameState={setGameState} />;
  }

  if (stage === 'safePenalty') {
    return (
      <div className="room-container">
        {img && <img src={img} alt={mapMarker} className="scene-image" />}
        <ParallaxDust />
        <div className="room-content rpg-text">
          <TTSLine text={`To force the safe open, complete ${failureExercise}.`} />
          <button onClick={handlePenaltyDone}>I've done it</button>
        </div>
      </div>
    );
  }

  if (stage === 'boss') {
    return <BossFightPhase config={boss} gameState={gameState} setGameState={setGameState} onComplete={handleBossComplete} />;
  }

  if (stage === 'loot') {
    return (
      <div className="room-container">
        {img && <img src={img} alt={mapMarker} className="scene-image" />}
        <ParallaxDust />
        <div className="room-content rpg-text">
          <TTSLine text="You search the room..." />
          <button onClick={handleLoot}>See what you find</button>
        </div>
      </div>
    );
  }

  if (stage === 'scavenge') {
    const scavengeLines = narrationLines.languages.room1.scavenge || [];
    return (
      <div className="room-container">
        {img && <img src={img} alt={mapMarker} className="scene-image" />}
        <ParallaxDust />
        <div className="room-content rpg-text">
          {scavengeLines.map((line, i) => (
            <TTSLine key={i} text={line} />
          ))}
          <button onClick={handleScavengeComplete}>Investigate</button>
        </div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="room-container">
        {img && <img src={img} alt={mapMarker} className="scene-image" />}
        <ParallaxDust />
        <div className="room-content rpg-text">
          {loot && (
            <TTSLine
              text={`You have finished scavenging for supplies and found ${loot.name}! This has been added to your backpack for later use.`}
            />
          )}
          {loot &&
            loot.name.includes('Map Piece') &&
            mapMarker === "Mr. Watkins' Room" && (
              <TTSLine
                text={narrationLines.languages.room1.foundItem.replace(
                  '{item}',
                  loot.name
                )}
              />
            )}
          {mapMarker === "Mr. Watkins' Room" && (
            <TTSLine text={narrationLines.languages.room1.rest} />
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
      </div>
    );
  }

  return null;
}

export default RoomTemplate;
