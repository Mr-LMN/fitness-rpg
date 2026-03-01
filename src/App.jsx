import React, { useState, useEffect, useRef, useCallback } from "react";
import LoginForm from "./components/LoginForm";
import CharacterCreation from "./components/CharacterCreation";
import IntroPhase from "./components/phases/IntroPhase";
import WarmUpPhase from "./components/phases/WarmUpPhase";
import MobilityPhase from "./components/phases/MobilityPhase";
import EscapePhase from "./components/phases/EscapePhase";
import MapIntroduction from "./components/MapIntroduction";
import Map from "./components/Map";
import Room1 from "./components/phases/Room1";
import Room2 from "./components/phases/Room2";
import Room3Boss from "./components/phases/Room3Boss";
import VictoryPhase from "./components/phases/VictoryPhase";
import RoomNarrativeOverlay from "./components/RoomNarrativeOverlay";
import FinalBossPhase from "./components/phases/FinalBossPhase";
import XPBar from "./components/XPBar";
import AccountabilityPopup from "./components/AccountabilityPopup";
import BadgeUnlockedModal from "./components/BadgeUnlockedModal";
import { playSound, stopSound, setMuted, setTtsEnabled } from "./utils";
import GlobalAudioControls from "./components/GlobalAudioControls";
import StartScreen from "./components/StartScreen";
import QuestTracker from "./components/QuestTracker";
import questDeck from "./data/questDeck";
import GameMenu from "./components/GameMenu";
import SLTDashboard from "./components/SLTDashboard";
import { ROOMS } from "./constants";
import { updateUserProfile, syncUserXP } from "./helpers/userProfile";
import { getReadingProfile } from "./helpers/readingProfile";

const INITIAL_STATE = {
  characterCreated: false,
  studentName: "",
  yearGroup: "",
  gender: "",
  weight: "",
  workoutFocus: "",
  avatar: "pirate",
  readingAge: "not-sure",
  introStage: 0,
  currentRoom: null,
  completedRooms: [],
  visibleRooms: [ROOMS.MR_WATKINS],
  annotations: [],
  inventory: [],
  bossReady: false,
  bossDefeated: false,
  missedBlazePods: 0,
  lootUnlocked: [],
  xp: 0,
  badges: [],
  triggeredQuiz: false,
  bossPhase: 0,
  victory: false,
  showOverlay: true,
  enhancedReading: false,
  textToSpeech: false,
  studentLevel: "entry",
  activeQuests: [],
  completedQuests: [],
  questProgress: {},
  questInitialised: false,
  survivorStatus: null,
  recoveryWorkoutsNeeded: 2,
  recoveryWorkoutsCompleted: 0,
};

const CHECKPOINT_PREFIX = "checkpoint_";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Maps a quest event + payload to a boolean indicating whether criteria match.
const matchesQuestCriteria = (quest, payload) => {
  const criteria = quest.criteria || {};
  switch (quest.event) {
    case "warmupComplete":
      return !criteria.room || criteria.room === payload.room;
    case "workoutLogged":
      if (criteria.room && criteria.room !== payload.room) return false;
      if (criteria.focus && criteria.focus !== payload.focus) return false;
      return true;
    case "quizComplete":
      if (criteria.room && criteria.room !== payload.room) return false;
      return (payload.correct || 0) >= (criteria.minCorrect || quest.goal || 1);
    case "bossDefeated":
      return !criteria.room || criteria.room === payload.room;
    default:
      return false;
  }
};

const ROOM_COMPONENTS = {
  [ROOMS.MR_WATKINS]: Room1,
  [ROOMS.MRS_JOHN]: Room2,
  [ROOMS.MRS_ROCHE]: Room3Boss,
  [ROOMS.FITNESS_SUITE]: FinalBossPhase,
};

function App() {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState({ ...INITIAL_STATE });
  const [popupMessage, setPopupMessage] = useState(null);
  const [recentBadge, setRecentBadge] = useState(null);
  const [muted, setMutedState] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showSLT, setShowSLT] = useState(false);

  const ambientRef = useRef(null);
  const prevXpLevel = useRef(0);
  const prevBadgesRef = useRef([]);
  const profileSyncedRef = useRef(false);

  // Load checkpoint when user logs in
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`${CHECKPOINT_PREFIX}${user.uid}`);
    if (saved) {
      try {
        setGameState({ ...INITIAL_STATE, ...JSON.parse(saved) });
      } catch (err) {
        console.error("Failed to parse checkpoint", err);
      }
    }
  }, [user]);

  // Persist progress on every state change
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `${CHECKPOINT_PREFIX}${user.uid}`,
        JSON.stringify(gameState)
      );
    }
  }, [gameState, user]);

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  // Weekly challenge check — runs once on mount
  useEffect(() => {
    const now = new Date();
    localStorage.setItem("lastOpenDate", now.toISOString());

    const week = JSON.parse(localStorage.getItem("weekData") || "{}");
    if (!week.start) {
      week.start = now.toISOString();
      week.minutes = 0;
    } else if (now - new Date(week.start) >= ONE_WEEK_MS) {
      if ((week.minutes || 0) >= 60) {
        setPopupMessage("Great job! You hit your weekly workout target!");
      } else {
        setPopupMessage("⚠️ You've been weakened — complete 2 workouts to recover.");
        setGameState((prev) => ({
          ...prev,
          survivorStatus: 'injured',
          recoveryWorkoutsNeeded: 2,
          recoveryWorkoutsCompleted: 0,
        }));
      }
      week.start = now.toISOString();
      week.minutes = 0;
    }
    localStorage.setItem("weekData", JSON.stringify(week));
  }, []);

  // Play level-up sound when XP level increases
  useEffect(() => {
    const level = Math.floor(gameState.xp / 100);
    if (level > prevXpLevel.current) {
      playSound("xpLevel");
    }
    prevXpLevel.current = level;
  }, [gameState.xp]);

  // Show badge modal for newly earned badges
  useEffect(() => {
    const newBadges = gameState.badges.filter(
      (b) => !prevBadgesRef.current.includes(b)
    );
    if (newBadges.length > 0) {
      setRecentBadge(newBadges[newBadges.length - 1]);
    }
    prevBadgesRef.current = gameState.badges;
  }, [gameState.badges]);

  // Ambient audio
  useEffect(() => {
    const shouldPlayAmbient = !muted && (!user || gameState.introStage === 0);
    if (shouldPlayAmbient) {
      if (!ambientRef.current) {
        ambientRef.current = playSound("ambient", { loop: true, volume: 0.2 });
      }
    } else if (ambientRef.current) {
      stopSound(ambientRef.current);
      ambientRef.current = null;
    }
  }, [user, gameState.introStage, muted]);

  useEffect(() => {
    setTtsEnabled(gameState.textToSpeech);
  }, [gameState.textToSpeech]);

  // Sync user profile to Firestore when character is created or XP/badges change
  useEffect(() => {
    if (!user || !gameState.characterCreated) return;

    const syncProfile = async () => {
      if (!profileSyncedRef.current) {
        // Full sync on first character creation
        await updateUserProfile({
          userId: user.uid,
          studentName: gameState.studentName,
          yearGroup: gameState.yearGroup,
          avatar: gameState.avatar,
          xp: gameState.xp,
        });
        profileSyncedRef.current = true;
      } else {
        // Lightweight XP/badge sync on change
        await syncUserXP({
          userId: user.uid,
          xp: gameState.xp,
          avatar: gameState.avatar,
          badges: gameState.badges,
        });
      }
    };

    syncProfile();
  }, [gameState.xp, gameState.badges, gameState.avatar, gameState.characterCreated, user]);

  const handleQuestEvent = useCallback(
    (eventType, payload = {}) => {
      setGameState((prev) => {
        if (!prev.characterCreated) return prev;

        const isInit = eventType === "init";
        const activeSet = new Set(prev.activeQuests || []);
        const completedSet = new Set(prev.completedQuests || []);
        const questProgress = { ...(prev.questProgress || {}) };
        const badgeSet = new Set(prev.badges || []);
        let xpBonus = 0;
        let changed = false;

        if (isInit) {
          questDeck.forEach((quest) => {
            if (quest.autoUnlock && !activeSet.has(quest.id) && !completedSet.has(quest.id)) {
              activeSet.add(quest.id);
              changed = true;
            }
          });
        }

        if (!isInit) {
          questDeck.forEach((quest) => {
            if (!activeSet.has(quest.id)) return;
            if (quest.event !== eventType) return;
            if (!matchesQuestCriteria(quest, payload)) return;

            const goal = quest.goal || 1;
            const newProgress = Math.min(
              goal,
              (questProgress[quest.id] || 0) + (quest.increment || 1)
            );
            questProgress[quest.id] = newProgress;
            changed = true;

            if (newProgress >= goal) {
              activeSet.delete(quest.id);
              completedSet.add(quest.id);
              xpBonus += quest.reward?.xp || 0;
              if (quest.reward?.badge) badgeSet.add(quest.reward.badge);
              delete questProgress[quest.id];
            }
          });
        }

        questDeck.forEach((quest) => {
          if (activeSet.has(quest.id) || completedSet.has(quest.id)) return;
          const prerequisites = quest.prerequisites || [];
          const prerequisitesMet = prerequisites.every((id) => completedSet.has(id));
          if (isInit ? quest.autoUnlock : prerequisitesMet) {
            activeSet.add(quest.id);
            changed = true;
          }
        });

        // Handle injury recovery — track workouts logged while injured
        let recoveryUpdate = {};
        if (eventType === 'workoutLogged' && prev.survivorStatus === 'injured') {
          const newCompleted = (prev.recoveryWorkoutsCompleted || 0) + 1;
          const recovered = newCompleted >= (prev.recoveryWorkoutsNeeded || 2);
          recoveryUpdate = {
            recoveryWorkoutsCompleted: recovered ? 0 : newCompleted,
            survivorStatus: recovered ? null : 'injured',
          };
          changed = true;
        }

        if (!changed) return prev;

        // Halve XP gains while injured
        const effectiveXpBonus = prev.survivorStatus === 'injured'
          ? Math.floor(xpBonus / 2)
          : xpBonus;

        return {
          ...prev,
          xp: prev.xp + effectiveXpBonus,
          badges: Array.from(badgeSet),
          activeQuests: Array.from(activeSet),
          completedQuests: Array.from(completedSet),
          questProgress,
          ...recoveryUpdate,
        };
      });
    },
    [setGameState]
  );

  useEffect(() => {
    if (gameState.characterCreated && !gameState.questInitialised) {
      handleQuestEvent("init");
      setGameState((prev) => ({ ...prev, questInitialised: true }));
    }
  }, [gameState.characterCreated, gameState.questInitialised, handleQuestEvent]);

  const handleResetProgress = useCallback(() => {
    const confirmed = window.confirm(
      "This will erase your current character and local progress. Are you sure?"
    );
    if (!confirmed) return;

    if (user?.uid) {
      localStorage.removeItem(`${CHECKPOINT_PREFIX}${user.uid}`);
    }
    localStorage.removeItem("lifetimeSummary");
    localStorage.removeItem("weekData");
    localStorage.removeItem("lastOpenDate");

    profileSyncedRef.current = false;
    setGameState({ ...INITIAL_STATE });
    setPopupMessage(null);
    setRecentBadge(null);
    setShowHome(true);
    prevXpLevel.current = 0;
    prevBadgesRef.current = [];
  }, [user]);

  // SLT Dashboard — no auth required, just passcode gated
  if (showSLT) {
    return <SLTDashboard onBack={() => setShowSLT(false)} />;
  }

  const renderPhase = () => {
    if (!user) {
      return showHome
        ? <StartScreen onStart={() => setShowHome(false)} />
        : (
          <LoginForm
            onLogin={(u) => setUser(u)}
            onSLTAccess={() => setShowSLT(true)}
          />
        );
    }

    if (!gameState.characterCreated) {
      return (
        <CharacterCreation
          gameState={gameState}
          setGameState={setGameState}
          userId={user.uid}
        />
      );
    }

    const sharedRoomProps = {
      setGameState,
      gameState,
      userId: user?.uid,
      onQuestEvent: handleQuestEvent,
    };

    switch (gameState.introStage) {
      case 0:
        return (
          <IntroPhase
            setGameState={setGameState}
            textToSpeech={gameState.textToSpeech}
            enhancedReading={gameState.enhancedReading}
            readingAge={gameState.readingAge}
          />
        );
      case 1:
        return <WarmUpPhase setGameState={setGameState} gameState={gameState} />;
      case 2:
        return <MobilityPhase setGameState={setGameState} />;
      case 3:
        return <EscapePhase setGameState={setGameState} />;
      case 4:
        return (
          <MapIntroduction
            setGameState={setGameState}
            textToSpeech={gameState.textToSpeech}
            enhancedReading={gameState.enhancedReading}
            readingAge={gameState.readingAge}
          />
        );
      case 5:
        return (
          <Map
            gameState={gameState}
            setGameState={setGameState}
            userId={user?.uid}
          />
        );
      case 6: {
        if (gameState.showOverlay) {
          return (
            <RoomNarrativeOverlay
              roomName={gameState.currentRoom}
              avatar={gameState.avatar}
              textToSpeech={gameState.textToSpeech}
              enhancedReading={gameState.enhancedReading}
              readingAge={gameState.readingAge}
              onContinue={() =>
                setGameState((prev) => ({ ...prev, showOverlay: false }))
              }
            />
          );
        }
        const RoomComponent = ROOM_COMPONENTS[gameState.currentRoom];
        return RoomComponent ? <RoomComponent {...sharedRoomProps} /> : null;
      }
      case 7:
        return gameState.victory ? <VictoryPhase gameState={gameState} /> : null;
      default:
        console.error("Unknown introStage:", gameState.introStage);
        return <div>Something went wrong. No valid phase loaded.</div>;
    }
  };

  const readingProfile = getReadingProfile(gameState.readingAge || 'not-sure');
  const readingLevelClass = readingProfile.level === 'entry' ? 'reading-entry'
    : readingProfile.level === 'simple' ? 'reading-simple'
    : '';

  return (
    <div className={[gameState.enhancedReading ? 'enhanced-reading' : '', readingLevelClass].filter(Boolean).join(' ')}>
      {user && gameState.characterCreated && (
        <>
          <XPBar
            avatar={gameState.avatar}
            xp={gameState.xp}
            playerName={gameState.studentName}
            badges={gameState.badges}
            survivorStatus={gameState.survivorStatus}
            recoveryWorkoutsCompleted={gameState.recoveryWorkoutsCompleted}
            recoveryWorkoutsNeeded={gameState.recoveryWorkoutsNeeded}
          />
          <QuestTracker
            activeQuests={gameState.activeQuests}
            completedQuests={gameState.completedQuests}
            questProgress={gameState.questProgress}
          />
          <GameMenu
            setGameState={setGameState}
            gameState={gameState}
            userId={user?.uid}
            onQuestEvent={handleQuestEvent}
            onResetProgress={handleResetProgress}
          />
        </>
      )}
      {renderPhase()}
      {recentBadge && (
        <BadgeUnlockedModal
          badgeId={recentBadge}
          onClose={() => setRecentBadge(null)}
        />
      )}
      {popupMessage && (
        <AccountabilityPopup
          message={popupMessage}
          onClose={() => setPopupMessage(null)}
        />
      )}
      <GlobalAudioControls
        muted={muted}
        toggleMute={() => setMutedState((m) => !m)}
        tts={gameState.textToSpeech}
        toggleTts={() =>
          setGameState((prev) => {
            const next = !prev.textToSpeech;
            setTtsEnabled(next);
            return { ...prev, textToSpeech: next };
          })
        }
      />
    </div>
  );
}

export default App;
