import { useState } from "react";
import SignIn from "./components/SignIn";
import CharacterCreation from "./components/CharacterCreation";
import GamePhase from "./components/GamePhase";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [gameState, setGameState] = useState({
    characterCreated: false,
    introStage: 0,
    quizStage: 0,
    bossReady: false,
    bossDefeated: false,
    missedBlazePods: 2,
    lootUnlocked: [],
  });

  if (!signedIn) {
    return <SignIn onSignIn={() => setSignedIn(true)} />;
  }

  if (!gameState.characterCreated) {
    return <CharacterCreation gameState={gameState} setGameState={setGameState} />;
  }

  return <GamePhase gameState={gameState} setGameState={setGameState} />;
}

export default App;