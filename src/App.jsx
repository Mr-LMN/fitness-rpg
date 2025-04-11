import { useState } from "react";
import SignIn from "./SignIn";
import CharacterCreation from "./CharacterCreation";
import GamePhase from "./GamePhase"; // Ensure this matches the exact file name

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [gameState, setGameState] = useState({
    characterCreated: false,
    currentPhase: "intro",
  });

  if (!signedIn) {
    return <SignIn onSignIn={() => setSignedIn(true)} />;
  }

  if (!gameState.characterCreated) {
    return (
      <CharacterCreation
        onComplete={(characterData) =>
          setGameState({ ...gameState, ...characterData, characterCreated: true })
        }
      />
    );
  }

  return <GamePhase gameState={gameState} setGameState={setGameState} />;
}

export default App;