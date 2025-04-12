import { useState } from "react";
import SignIn from "./components/SignIn";
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
import BossFightPhase from "./components/phases/BossFightPhase";
import GamePhase from "./components/GamePhase";
import VictoryPhase from "./components/phases/VictoryPhase";
import RoomNarrativeOverlay from "./components/RoomNarrativeOverlay";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [gameState, setGameState] = useState({
    characterCreated: false,
    introStage: 0,
    currentRoom: "Mr. Watkins' Room", // Game starts here
    annotations: [],
    inventory: [],
    visibleRooms: ["Mr. Watkins' Room"], // Initially visible rooms
    completedRooms: [],
    bossReady: false,
    bossDefeated: false,
    missedBlazePods: 0,
    lootUnlocked: [],
    triggeredQuiz: false,
    bossPhase: 0,
    victory: false,
    showOverlay: true,
  });

  const renderPhase = () => {
    if (!signedIn) return <SignIn onSignIn={() => setSignedIn(true)} />;
    if (!gameState.characterCreated)
      return <CharacterCreation gameState={gameState} setGameState={setGameState} />;

    switch (gameState.introStage) {
      case 0:
        return <IntroPhase setGameState={setGameState} />;
      case 1:
        return <WarmUpPhase setGameState={setGameState} />;
      case 2:
        return <MobilityPhase setGameState={setGameState} />;
      case 3:
        return <EscapePhase setGameState={setGameState} />;
      case 4:
        return <MapIntroduction setGameState={setGameState} />;
      case 5:
        return <Map gameState={gameState} setGameState={setGameState} />;
      case 6:
        if (gameState.showOverlay) {
          return (
            <RoomNarrativeOverlay
              roomName={gameState.currentRoom}
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
          return <Room1 setGameState={setGameState} gameState={gameState} />;
        }
        if (gameState.currentRoom === "Mrs. John's Room") {
          return <Room2 setGameState={setGameState} gameState={gameState} />;
        }
        if (gameState.currentRoom === "Mrs. Roche's Room") {
          if (!gameState.triggeredQuiz) {
            return <Room3Boss setGameState={setGameState} gameState={gameState} />;
          }
          if (gameState.triggeredQuiz && gameState.bossPhase === 0) {
            return <QuizPhase setGameState={setGameState} gameState={gameState} />;
          }
          if (gameState.bossPhase === 1 || gameState.bossPhase === 2) {
            return <BossFightPhase setGameState={setGameState} gameState={gameState} />;
          }
          if (gameState.bossPhase === 3) {
            return <GamePhase setGameState={setGameState} gameState={gameState} />;
          }
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

  return <div>{renderPhase()}</div>;
}

export default App;