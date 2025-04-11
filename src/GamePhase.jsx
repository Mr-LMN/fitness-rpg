import React from "react";
import IntroPhase from "./phases/IntroPhase";
import WarmUpPhase from "./phases/WarmUpPhase";

function GamePhase({ gameState, setGameState }) {
  const { currentPhase } = gameState;

  console.log("Current Phase:", currentPhase); // Debugging log

  switch (currentPhase) {
    case "intro":
      return <IntroPhase setGameState={setGameState} />;
    case "warm-up":
      return <WarmUpPhase setGameState={setGameState} />;
    case "next-phase": // Add the name of the next phase here
      return <div>Next Phase Placeholder</div>; // Replace with your next phase component
    default:
      return <div>Unknown Phase</div>;
  }
}

export default GamePhase;