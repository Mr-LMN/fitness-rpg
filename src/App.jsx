import React, { useState, useEffect, useRef } from "react";
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
import HomePage from "./components/HomePage";

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
};

const CHECKPOINT_PREFIX = 'checkpoint_';

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
      setPopupMessage('Remember to log your workout today!');
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


  const renderPhase = () => {
    if (!user) {
      if (showHome) {
        return <HomePage onStart={() => setShowHome(false)} />;
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
        return <Map gameState={gameState} setGameState={setGameState} />;
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
            />
          );
        }
        if (gameState.currentRoom === "Mrs. John's Room") {
          return (
            <Room2
              setGameState={setGameState}
              gameState={gameState}
              userId={user?.uid}
            />
          );
        }
        if (gameState.currentRoom === "Mrs. Roche's Room") {
          return (
            <Room3Boss setGameState={setGameState} gameState={gameState} userId={user?.uid} />
          );
        }
        if (gameState.currentRoom === "Fitness Suite") {
          return (
            <FinalBossPhase setGameState={setGameState} gameState={gameState} userId={user?.uid} />
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
