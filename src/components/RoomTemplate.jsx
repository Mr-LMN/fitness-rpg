import React, { useState, useEffect } from 'react';
import narrationLines from '../data/narrationLines';
import NarrationManager from './NarrationManager';
import WorkoutLogger from './WorkoutLogger';
import QuizPhase from './phases/QuizPhase';
import BossFightPhase from './phases/BossFightPhase';
import WarmupDisplay from './WarmupDisplay';
import SafeQuizEvent from './events/SafeQuizEvent';
import { getRandomLoot, lootItems } from '../data/lootTable';
import RandomWorkoutModal from './RandomWorkoutModal';
import FitnessSuite from './phases/FitnessSuite';
import ParallaxDust from './ParallaxDust';
import './styles/RoomScene.css';
import TTSLine from './TTSLine';
import { ROOMS, STAGES } from '../constants';
import { getReadingProfile } from '../helpers/readingProfile';
import { adaptNarrative, adaptSingleLine } from '../helpers/narrativeAdapter';

const SCAVENGE_BOOST_LOOT = lootItems.filter(
  (item) => item.type === 'boost' && (item.rarity === 'common' || item.rarity === 'uncommon')
);

const ROOM_IMAGES = {
  [ROOMS.MR_WATKINS]: '/images/Mr_WatkinsRoom.png',
  [ROOMS.MRS_JOHN]: '/images/Mrs_JohnsRoom.png',
  [ROOMS.MRS_ROCHE]: '/images/Mrs_RochesRoom.png',
  [ROOMS.FITNESS_SUITE]: '/images/FitnessSuite.png',
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
  const [stage, setStage] = useState(STAGES.NARRATION);
  const [loot, setLoot] = useState(null);
  const [failureExercise, setFailureExercise] = useState(null);
  const [warmupDone, setWarmupDone] = useState(!requiresWarmup);
  const [warmupFocus, setWarmupFocus] = useState(gameState.workoutFocus || 'legs');

  // Explore-prompt state (extra scavenging after story workout)
  const [extraScavengeCount, setExtraScavengeCount] = useState(0);
  const [showExtraWorkout, setShowExtraWorkout] = useState(false);
  const [scavengeToast, setScavengeToast] = useState('');
  const [lastScavengeLine, setLastScavengeLine] = useState('');

  const img = ROOM_IMAGES[mapMarker];

  const lines = Array.isArray(narrationKey) ? narrationKey : getLinesByKey(narrationKey);
  const safeIntroLines = safeIntroKey ? getLinesByKey(safeIntroKey) : [];
  const quizIntroLines = quizIntroKey ? getLinesByKey(quizIntroKey) : [];

  // Auto-advance quizIntro to quiz after 10 seconds
  useEffect(() => {
    if (stage !== STAGES.QUIZ_INTRO) return;
    const timer = setTimeout(() => setStage(STAGES.QUIZ), 10000);
    return () => clearTimeout(timer);
  }, [stage]);

  // Unlock a room in game state if it hasn't been unlocked yet
  const unlockRoom = (prev) => {
    if (unlocksRoom && !prev.visibleRooms.includes(unlocksRoom)) {
      return { visibleRooms: [...prev.visibleRooms, unlocksRoom] };
    }
    return {};
  };

  // Determine the next stage after the workout/warmup sequence
  const nextAfterWorkout = () => {
    if (safeQuiz) return STAGES.SAFE_INTRO;
    if (hasScavenge) return STAGES.SCAVENGE;
    if (quizIntroKey) return STAGES.QUIZ_INTRO;
    if (quiz) return STAGES.QUIZ;
    if (boss) return STAGES.BOSS;
    if (lootPool) return STAGES.LOOT;
    return STAGES.COMPLETE;
  };

  const nextAfterQuiz = () => {
    if (mapMarker === ROOMS.MRS_ROCHE) return STAGES.FITNESS_PREP;
    if (boss) return STAGES.BOSS;
    if (lootPool) return STAGES.LOOT;
    return STAGES.COMPLETE;
  };

  const nextAfterBossOrSafe = () => {
    if (lootPool) return STAGES.LOOT;
    return STAGES.COMPLETE;
  };

  // --- Stage transition handlers ---

  const handleNarrationDone = () => {
    if (requiresWarmup && !warmupDone) return setStage(STAGES.WARMUP_PROMPT);
    if (hasWorkout) return setStage(STAGES.WORKOUT);
    if (hasScavenge) return setStage(STAGES.SCAVENGE);
    setStage(STAGES.COMPLETE);
  };

  const handleWarmupDecision = (wantWarmup) => {
    if (wantWarmup) {
      setStage(STAGES.WARMUP_SELECT);
    } else {
      handleWarmupComplete(false);
    }
  };

  const handleFocusSelect = (focus) => {
    setWarmupFocus(focus);
    setStage(STAGES.WARMUP);
  };

  const handleWarmupComplete = (completedWarmup = true) => {
    setWarmupDone(true);
    if (completedWarmup) {
      onQuestEvent('warmupComplete', { room: mapMarker, focus: warmupFocus });
    }
    if (hasWorkout) return setStage(STAGES.WORKOUT);
    if (hasScavenge) return setStage(STAGES.SCAVENGE);
    setStage(STAGES.COMPLETE);
  };

  const handleWorkoutComplete = () => {
    setGameState((prev) => ({ ...prev, xp: (prev.xp || 0) + 10 }));
    setStage(STAGES.EXPLORE_PROMPT);
  };

  const getExtraScavengeXP = (count) => {
    if (count === 0) return 10;
    if (count === 1) return 8;
    return 5;
  };

  const handleExtraScavengeComplete = () => {
    const xpGain = getExtraScavengeXP(extraScavengeCount);
    const drop = getRandomLoot(SCAVENGE_BOOST_LOOT);

    setGameState((prev) => {
      const updates = { xp: (prev.xp || 0) + xpGain };
      if (drop) {
        updates.inventory = [...(prev.inventory || []), { ...drop, isNew: true }];
      }
      return { ...prev, ...updates };
    });

    const extraLines = adaptNarrative(narrationLines.languages?.room1?.extraScavenge, readingProfile);
    if (extraLines.length > 0) {
      setLastScavengeLine(extraLines[extraScavengeCount % extraLines.length]);
    }

    setExtraScavengeCount((prev) => prev + 1);
    setScavengeToast('Extra supplies found! \uD83C\uDF92');
    setTimeout(() => setScavengeToast(''), 3000);
    setShowExtraWorkout(false);
  };

  const handlePressOn = () => {
    setStage(nextAfterWorkout());
  };

  const handleQuizComplete = (correct, total, finalLevel) => {
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + correct * 5,
      ...(finalLevel ? { studentLevel: finalLevel } : {}),
    }));
    onQuestEvent('quizComplete', { room: mapMarker, correct, total });
    setStage(nextAfterQuiz());
  };

  const handleBossComplete = () => {
    setGameState((prev) => {
      const updates = {
        xp: (prev.xp || 0) + 20,
        completedRooms: [...(prev.completedRooms || []), mapMarker],
        ...unlockRoom(prev),
      };
      if (mapMarker === ROOMS.MRS_ROCHE) {
        updates.currentRoom = ROOMS.FITNESS_SUITE;
        updates.showOverlay = true;
      }
      return { ...prev, ...updates };
    });
    onQuestEvent('bossDefeated', { room: mapMarker });
    setStage(nextAfterBossOrSafe());
  };

  const handleSafeSuccess = (reward) => {
    setGameState((prev) => ({
      ...prev,
      inventory: [...(prev.inventory || []), { ...reward, isNew: true }],
      ...unlockRoom(prev),
    }));
  };

  const handleSafeFailure = (exercise) => {
    setFailureExercise(exercise);
  };

  const handleSafeComplete = () => {
    if (failureExercise) return setStage(STAGES.SAFE_PENALTY);
    setStage(nextAfterBossOrSafe());
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
    setStage(nextAfterBossOrSafe());
  };

  const handleScavengeComplete = () => {
    const item = {
      id: 'scavenge_keycard',
      name: 'Mysterious Keycard',
      rarity: 'rare',
      description: 'Looks like it could open something important.',
    };
    setGameState((prev) => ({
      ...prev,
      inventory: [...(prev.inventory || []), { ...item, isNew: true }],
      ...unlockRoom(prev),
    }));
    setLoot(item);
    setStage(lootPool ? STAGES.LOOT : STAGES.COMPLETE);
  };

  const handleLoot = () => {
    const found = getRandomLoot(lootPool);
    if (found) {
      setGameState((prev) => {
        const updates = {
          inventory: [...(prev.inventory || []), { ...found, isNew: true }],
        };
        // Room 1 specific: finding a Map Piece unlocks Mrs. John's Room
        if (
          mapMarker === ROOMS.MR_WATKINS &&
          found.name.includes('Map Piece') &&
          !prev.visibleRooms.includes(ROOMS.MRS_JOHN)
        ) {
          updates.visibleRooms = [...prev.visibleRooms, ROOMS.MRS_JOHN];
        }
        return { ...prev, ...updates };
      });
      setLoot(found);
    }
    setStage(STAGES.COMPLETE);
  };

  const handleReturnToMap = () => {
    setGameState((prev) => ({
      ...prev,
      currentRoom: null,
      introStage: 5,
      showOverlay: true,
    }));
  };

  // --- Stage-specific content helpers ---

  const readingProfile = getReadingProfile(gameState.readingAge || 'not-sure');
  const scavengeLines = adaptNarrative(narrationLines.languages?.room1?.scavenge, readingProfile);

  // --- Render ---

  // Stages that share a common room-container + parallax dust wrapper
  const roomWrapper = (content) => (
    <div className="room-container">
      {img && <img src={img} alt={mapMarker} className="scene-image" />}
      <ParallaxDust />
      <div className="room-content rpg-text">
        {content}
      </div>
    </div>
  );

  switch (stage) {
    case STAGES.NARRATION:
      return (
        <NarrationManager
          lines={lines}
          onComplete={handleNarrationDone}
          backgroundImage={ROOM_IMAGES[mapMarker]}
          readingAge={gameState.readingAge}
        />
      );

    case STAGES.WARMUP_PROMPT:
      return roomWrapper(
        <>
          <TTSLine text="Log your workout. Would you like a pre-built warm up before starting?" />
          <button onClick={() => handleWarmupDecision(true)}>Yes</button>
          <button onClick={() => handleWarmupDecision(false)}>No</button>
        </>
      );

    case STAGES.WARMUP_SELECT:
      return roomWrapper(
        <>
          <TTSLine text="What are you training? Legs, Upper Body or Both?" />
          <button onClick={() => handleFocusSelect('legs')}>Legs</button>
          <button onClick={() => handleFocusSelect('upperBody')}>Upper Body</button>
          <button onClick={() => handleFocusSelect('full')}>Both</button>
        </>
      );

    case STAGES.WARMUP:
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

    case STAGES.WORKOUT:
      return (
        <div className="room-container">
          {img && <img src={img} alt={mapMarker} className="scene-image" />}
          <div className="room-content">
            <WorkoutLogger
              roomNumber={mapMarker}
              gameState={gameState}
              setGameState={setGameState}
              workoutFocus={workoutFocus || gameState.workoutFocus}
              userId={userId}
              yearGroup={gameState.yearGroup}
              studentName={gameState.studentName}
              avatar={gameState.avatar}
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

    case STAGES.SAFE_INTRO:
      return (
        <NarrationManager
          lines={safeIntroLines}
          onComplete={() => setStage(STAGES.SAFE_QUIZ)}
          backgroundImage={ROOM_IMAGES[mapMarker]}
          readingAge={gameState.readingAge}
        />
      );

    case STAGES.SAFE_QUIZ:
      return (
        <SafeQuizEvent
          questionPool={safeQuiz}
          onSuccess={handleSafeSuccess}
          onFailure={handleSafeFailure}
          onComplete={handleSafeComplete}
          roomName={mapMarker}
        />
      );

    case STAGES.QUIZ_INTRO:
      return (
        <NarrationManager
          lines={quizIntroLines}
          onComplete={() => setStage(STAGES.QUIZ)}
          backgroundImage="/images/quiz_door.png"
          readingAge={gameState.readingAge}
        />
      );

    case STAGES.QUIZ:
      return (
        <QuizPhase
          questions={quiz}
          onComplete={handleQuizComplete}
          showImpossibleFinal={mapMarker === ROOMS.MRS_ROCHE}
          studentLevel={gameState.studentLevel || "entry"}
        />
      );

    case STAGES.FITNESS_PREP:
      return <FitnessSuite setGameState={setGameState} gameState={gameState} />;

    case STAGES.SAFE_PENALTY:
      return roomWrapper(
        <>
          <h2>📡 TITAN Override</h2>
          <TTSLine text={`TITAN: "Complete ${failureExercise} and I'll force the safe open for you."`} />
          <button onClick={handlePenaltyDone}>I've done it!</button>
        </>
      );

    case STAGES.BOSS:
      return (
        <BossFightPhase
          config={boss}
          gameState={gameState}
          setGameState={setGameState}
          onComplete={handleBossComplete}
        />
      );

    case STAGES.LOOT:
      return roomWrapper(
        <>
          <TTSLine text="You search the room..." />
          <button onClick={handleLoot}>See what you find</button>
        </>
      );

    case STAGES.SCAVENGE:
      return roomWrapper(
        <>
          {scavengeLines.map((line, i) => (
            <TTSLine key={i} text={line} />
          ))}
          <button onClick={handleScavengeComplete}>Investigate</button>
        </>
      );

    case STAGES.EXPLORE_PROMPT: {
      const exploreLines = adaptNarrative(narrationLines.languages?.room1?.explorePrompt, readingProfile);
      return roomWrapper(
        <>
          {exploreLines.map((line, i) => (
            <TTSLine key={`explore-${i}`} text={line} />
          ))}
          {lastScavengeLine && (
            <TTSLine text={lastScavengeLine} />
          )}
          {scavengeToast && (
            <p className="scavenge-toast">{scavengeToast}</p>
          )}
          <div className="explore-prompt-actions">
            <button
              className="explore-btn scavenge-btn"
              onClick={() => setShowExtraWorkout(true)}
            >
              🔍 Keep Scavenging (+XP, random loot)
            </button>
            <button
              className="explore-btn press-on-btn"
              onClick={handlePressOn}
            >
              ➡️ Press On (continue story)
            </button>
          </div>
          {showExtraWorkout && (
            <RandomWorkoutModal
              onClose={handleExtraScavengeComplete}
              setGameState={setGameState}
              userId={userId}
              yearGroup={gameState.yearGroup}
              defaultFocus={workoutFocus || gameState.workoutFocus || 'strength'}
              onQuestEvent={onQuestEvent}
            />
          )}
        </>
      );
    }

    case STAGES.COMPLETE: {
      const foundItemText = loot?.name?.includes('Map Piece') && mapMarker === ROOMS.MR_WATKINS
        ? adaptSingleLine(narrationLines.languages.room1.foundItem, readingProfile).replace('{item}', loot.name)
        : null;
      const restText = mapMarker === ROOMS.MR_WATKINS
        ? adaptSingleLine(narrationLines.languages.room1.rest, readingProfile)
        : null;
      return roomWrapper(
        <>
          {loot && (
            <TTSLine
              text={`You found ${loot.name}! It has been added to your backpack.`}
            />
          )}
          {foundItemText && <TTSLine text={foundItemText} />}
          {restText && <TTSLine text={restText} />}
          <button onClick={handleReturnToMap}>Return to Map</button>
        </>
      );
    }

    default:
      return null;
  }
}

export default RoomTemplate;
