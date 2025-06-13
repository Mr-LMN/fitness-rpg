import React from "react";
import IntroPhase from "./phases/IntroPhase";
import WarmUpPhase from "./phases/WarmUpPhase";
import MobilityPhase from "./phases/MobilityPhase";
import Room1 from "./phases/Room1";
import Room2 from "./phases/Room2";
import Room3Boss from "./phases/Room3Boss";
import QuizPhase from "./phases/QuizPhase";
import BossFightPhase from "./phases/BossFightPhase";
import VictoryPhase from "./phases/VictoryPhase";

function GamePhase({ gameState, setGameState }) {
  switch (gameState.introStage) {
    case 0:
      return <IntroPhase setGameState={setGameState} />;
    case 1:
      return <WarmUpPhase setGameState={setGameState} />;
    case 2:
      return <MobilityPhase setGameState={setGameState} />;
    case 3:
      return <Room1 gameState={gameState} setGameState={setGameState} />;
    case 4:
      return <Room2 gameState={gameState} setGameState={setGameState} />;
    case 5:
      return <Room3Boss gameState={gameState} setGameState={setGameState} />;
    case 6:
      return gameState.bossReady ? (
        <QuizPhase gameState={gameState} setGameState={setGameState} />
      ) : (
        <BossFightPhase gameState={gameState} setGameState={setGameState} />
      );
    case 7:
      return <VictoryPhase gameState={gameState} />;
    default:
      return null;
  }
}

export default GamePhase;