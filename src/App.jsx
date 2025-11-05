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
import QuizPhase from "./components/phases/QuizPhase";
import VictoryPhase from "./components/phases/VictoryPhase";
import RoomNarrativeOverlay from "./components/RoomNarrativeOverlay";
import FinalBossPhase from "./components/phases/FinalBossPhase";
import XPBar from "./components/XPBar";
import AccountabilityPopup from "./components/AccountabilityPopup";
import BadgeUnlockedModal from "./components/BadgeUnlockedModal";
import { playSound, stopSound, setMuted } from "./utils";
import GlobalAudioControls from "./components/GlobalAudioControls";
import StartScreen from "./components/StartScreen";
import QuestTracker from "./components/QuestTracker";
import questDeck from "./data/questDeck";
import GameMenu from "./components/GameMenu";

const INITIAL_STATE = {
  characterCreated: false,
  studentName: "",
  yearGroup: "",
  gender: "",
  weight: "",
  workoutFocus: "",
  avatar: "pirate",
  introStage: 0,
  currentRoom: null,
  completedRooms: [],
  visibleRooms: ["Mr. Watkins' Room"],
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
  activeQuests: [],
  completedQuests: [],
  questProgress: {},
  questInitialised: false,
};

const CHECKPOINT_PREFIX = 'checkpoint_';

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

function App() {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState({ ...INITIAL_STATE });
  const [popupMessage, setPopupMessage] = useState(null);
  const [recentBadge, setRecentBadge] = useState(null);
  const [muted, setMutedState] = useState(false);
  const [showHome, setShowHome] = useState(true);
  
  const ambientRef = useRef(null);
  const prevXpLevel = useRef(0);
  const prevBadgesRef = useRef([]);

  // Load checkpoint when a user logs in
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`${CHECKPOINT_PREFIX}${user.uid}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setGameState({ ...INITIAL_STATE, ...parsed });
        } catch (err) {
          console.error('Failed to parse checkpoint', err);
        }
      }
    }
  }, [user]);

  // Save progress on every state change
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

  useEffect(() => {
    const now = new Date();
    const lastOpen = localStorage.getItem('lastOpenDate');
    if (!lastOpen || new Date(lastOpen).toDateString() !== now.toDateString()) {
      localStorage.setItem('lastOpenDate', now.toISOString());
    }

    const week = JSON.parse(localStorage.getItem('weekData') || '{}');
    if (!week.start) {
      week.start = now.toISOString();
      week.minutes = 0;
    } else {
      const start = new Date(week.start);
      if (now - start >= 7 * 24 * 60 * 60 * 1000) {
        if ((week.minutes || 0) >= 60) {
          setPopupMessage('Great job! You hit your weekly workout target!');
        } else {
          setPopupMessage('You missed the weekly workout target. Starting over.');
          setGameState({ ...INITIAL_STATE });
          setUser(null);
        }
        week.start = now.toISOString();
        week.minutes = 0;
      }
    }
    localStorage.setItem('weekData', JSON.stringify(week));
  }, []);

  useEffect(() => {
    const level = Math.floor(gameState.xp / 100);
    if (level > prevXpLevel.current) {
      playSound('xpLevel');
    }
    prevXpLevel.current = level;
  }, [gameState.xp]);

  useEffect(() => {
    const newBadges = gameState.badges.filter(
      (b) => !prevBadgesRef.current.includes(b)
    );
    if (newBadges.length > 0) {
      setRecentBadge(newBadges[newBadges.length - 1]);
    }
    prevBadgesRef.current = gameState.badges;
  }, [gameState.badges]);

  useEffect(() => {
    if (!user || gameState.introStage === 0) {
      if (!ambientRef.current) {
        ambientRef.current = playSound('ambient', { loop: true, volume: 0.2 });
      }
    } else if (ambientRef.current) {
      stopSound(ambientRef.current);
      ambientRef.current = null;
    }
  }, [user, gameState.introStage]);

  const handleQuestEvent = useCallback(
    (eventType, payload = {}) => {
      setGameState((prev) => {
        if (!prev.characterCreated) {
          return prev;
        }

        const isInit = eventType === "init";
        const activeSet = new Set(prev.activeQuests || []);
        const completedSet = new Set(prev.completedQuests || []);
        const questProgress = { ...(prev.questProgress || {}) };
        const badgeSet = new Set(prev.badges || []);
        let xpBonus = 0;
        let changed = false;

        if (isInit) {
          questDeck.forEach((quest) => {
            if (
              quest.autoUnlock &&
              !activeSet.has(quest.id) &&
              !completedSet.has(quest.id)
            ) {
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
            const increment = quest.increment || 1;
            const newProgress = Math.min(
              goal,
              (questProgress[quest.id] || 0) + increment
            );
            questProgress[quest.id] = newProgress;
            changed = true;

            if (newProgress >= goal) {
              activeSet.delete(quest.id);
              completedSet.add(quest.id);
              xpBonus += quest.reward?.xp || 0;
              if (quest.reward?.badge && !badgeSet.has(quest.reward.badge)) {
                badgeSet.add(quest.reward.badge);
              }
              delete questProgress[quest.id];
            }
          });
        }

        questDeck.forEach((quest) => {
          if (activeSet.has(quest.id) || completedSet.has(quest.id)) {
            return;
          }
          const prerequisites = quest.prerequisites || [];
          const prerequisitesMet = prerequisites.every((id) =>
            completedSet.has(id)
          );
          if (
            (isInit && quest.autoUnlock) ||
            (!isInit && prerequisitesMet)
          ) {
            if (quest.autoUnlock || prerequisitesMet) {
              activeSet.add(quest.id);
              changed = true;
            }
          }
        });

        if (!changed) {
          return prev;
        }

        return {
          ...prev,
          xp: prev.xp + xpBonus,
          badges: Array.from(badgeSet),
          activeQuests: Array.from(activeSet),
          completedQuests: Array.from(completedSet),
          questProgress,
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
      "This will erase your current character and local progress. Are you sure you want to continue?"
    );

    if (!confirmed) {
      return;
    }

    if (user?.uid) {
      localStorage.removeItem(`${CHECKPOINT_PREFIX}${user.uid}`);
    }

    localStorage.removeItem("lifetimeSummary");
    localStorage.removeItem("weekData");
    localStorage.removeItem("lastOpenDate");

    setGameState({ ...INITIAL_STATE });
    setPopupMessage(null);
    setRecentBadge(null);
    setShowHome(true);
    prevXpLevel.current = 0;
    prevBadgesRef.current = [];
  }, [user]);

  const renderPhase = () => {
    if (!user) {
      if (showHome) {
        return <StartScreen onStart={() => setShowHome(false)} />;
      }
      return <LoginForm onLogin={(u) => setUser(u)} />;
    }
    if (!gameState.characterCreated)
      return <CharacterCreation gameState={gameState} setGameState={setGameState} />;

    switch (gameState.introStage) {
      case 0:
        return (
          <IntroPhase
            setGameState={setGameState}
            textToSpeech={gameState.textToSpeech}
            enhancedReading={gameState.enhancedReading}
          />
        );
      case 1:
        return (
          <WarmUpPhase
            setGameState={setGameState}
            gameState={gameState}
          />
        );
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
          />
        );
      case 5:
        return (
          <Map
            gameState={gameState}
            setGameState={setGameState}
          />
        );
      case 6:
        if (gameState.showOverlay) {
          return (
            <RoomNarrativeOverlay
              roomName={gameState.currentRoom}
              avatar={gameState.avatar}
              textToSpeech={gameState.textToSpeech}
              enhancedReading={gameState.enhancedReading}
              onContinue={() =>
                setGameState((prev) => ({
                  ...prev,
                  showOverlay: false,
                }))
              }
            />
          );
        }
        if (gameState.currentRoom === "Mr. Watkins' Room") {
          return (
            <Room1
              setGameState={setGameState}
              gameState={gameState}
              userId={user?.uid}
              onQuestEvent={handleQuestEvent}
            />
          );
        }
        if (gameState.currentRoom === "Mrs. John's Room") {
          return (
            <Room2
              setGameState={setGameState}
              gameState={gameState}
              userId={user?.uid}
              onQuestEvent={handleQuestEvent}
            />
          );
        }
        if (gameState.currentRoom === "Mrs. Roche's Room") {
          return (
            <Room3Boss
              setGameState={setGameState}
              gameState={gameState}
              userId={user?.uid}
              onQuestEvent={handleQuestEvent}
            />
          );
        }
        if (gameState.currentRoom === "Fitness Suite") {
          return (
            <FinalBossPhase
              setGameState={setGameState}
              gameState={gameState}
              userId={user?.uid}
              onQuestEvent={handleQuestEvent}
            />
          );
        }
        break;
      case 7:
        if (gameState.victory) {
          return <VictoryPhase gameState={gameState} />;
        }
        break;
      default:
        console.log("Unknown phase");
    }

    return <div>Something went wrong. No valid phase loaded.</div>;
  };

  return (
    <div className={gameState.enhancedReading ? "enhanced-reading" : ""}>
      {user && gameState.characterCreated && (
        <XPBar
          avatar={gameState.avatar}
          xp={gameState.xp}
          playerName={gameState.studentName}
        />
      )}
      {user && gameState.characterCreated && (
        <QuestTracker
          activeQuests={gameState.activeQuests}
          completedQuests={gameState.completedQuests}
          questProgress={gameState.questProgress}
        />
      )}
      {user && gameState.characterCreated && (
        <GameMenu
          setGameState={setGameState}
          gameState={gameState}
          userId={user?.uid}
          onQuestEvent={handleQuestEvent}
          onResetProgress={handleResetProgress}
        />
      )}
      {renderPhase()}
      {recentBadge && (
        <BadgeUnlockedModal
          badgeId={recentBadge}
          onClose={() => setRecentBadge(null)}
        />
      )}
      {popupMessage && (
        <AccountabilityPopup message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
      <GlobalAudioControls
        muted={muted}
        toggleMute={() => setMutedState((m) => !m)}
        tts={gameState.textToSpeech}
        toggleTts={() =>
          setGameState((prev) => ({
            ...prev,
            textToSpeech: !prev.textToSpeech,
          }))
        }
      />
    </div>
  );
}

export default App;
