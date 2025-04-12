import { useState } from "react";
import SignIn from "./components/SignIn";
import CharacterCreation from "./components/CharacterCreation";
import IntroPhase from "./phases/IntroPhase";
import WarmUpPhase from "./phases/WarmUpPhase";
import MobilityPhase from "./phases/MobilityPhase";
import EscapePhase from "./phases/EscapePhase";
import MapIntroduction from "./MapIntroduction";
import Map from "./Map";
import Room1 from "./phases/Room1";
import Room2 from "./phases/Room2";
import Room3Boss from "./phases/Room3Boss";
import QuizPhase from "./phases/QuizPhase";
import BossFightPhase from "./phases/BossFightPhase";
import GamePhase from "./GamePhase";
import VictoryPhase from "./phases/VictoryPhase";
import RoomNarrativeOverlay from "./RoomNarrativeOverlay";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [gameState, setGameState] = useState({
    characterCreated: false,
    introStage: 0,
    currentRoom: null,
    completedRooms: [],
    visibleRooms: [],
    annotations: [],
    bossReady: false,
    bossDefeated: false,
    missedBlazePods: 0,
    lootUnlocked: [],
    triggeredQuiz: false,
    bossPhase: 0,
    victory: false,
    showOverlay: true, // NEW
  });

  const renderPhase = () => {
    if (!signedIn) return <SignIn onSignIn={() => setSignedIn(true)} />;
    if (!gameState.characterCreated)
      return <CharacterCreation gameState={gameState} setGameState={setGameState} />;

    switch (gameState.introStage) {
      case 0: return <IntroPhase setGameState={setGameState} />;
      case 1: return <WarmUpPhase setGameState={setGameState} />;
      case 2: return <MobilityPhase setGameState={setGameState} />;
      case 3: return <EscapePhase setGameState={setGameState} />;
      case 4: return <MapIntroduction setGameState={setGameState} />;
      case 5: return <Map gameState={gameState} setGameState={setGameState} />;
      case 6:
        if (gameState.showOverlay) {
          return (
            <RoomNarrativeOverlay
              roomName={gameState.currentRoom}
              onContinue={() =>
                setGameState((prev) => ({ ...prev, showOverlay: false }))
              }
            />
          );
        }
        if (gameState.currentRoom === "Mr. Watkins' Room")
          return <Room1 setGameState={setGameState} gameState={gameState} />;
        if (gameState.currentRoom === "Mrs. John's Room")
          return <Room2 setGameState={setGameState} gameState={gameState} />;
        if (gameState.currentRoom === "Mrs. Roche's Room") {
          if (!gameState.triggeredQuiz)
            return <Room3Boss setGameState={setGameState} />;
          if (gameState.triggeredQuiz && gameState.bossPhase === 0)
            return <QuizPhase setGameState={setGameState} />;
          if (gameState.bossPhase === 1 || gameState.bossPhase === 2)
            return (
              <BossFightPhase
                gameState={gameState}
                setGameState={setGameState}
              />
            );
          if (gameState.bossPhase === 3)
            return (
              <GamePhase
                gameState={gameState}
                setGameState={setGameState}
              />
            );
        }
        break;
      default:
        break;
    }

    if (gameState.victory) return <VictoryPhase setGameState={setGameState} />;

    return <div>Something went wrong. No valid phase loaded.</div>;
  };

  return <div>{renderPhase()}</div>;
}

export default App;
