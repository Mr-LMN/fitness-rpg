import IntroPhase from "./phases/IntroPhase";
import WarmUpPhase from "./phases/WarmUpPhase";
import MobilityPhase from "./phases/MobilityPhase";
import EscapePhase from "./phases/EscapePhase";
import Room1 from "./phases/Room1";
import Room2 from "./phases/Room2Safe";
import Room3Escape from "./phases/Room3Escape";
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
      return <EscapePhase setGameState={setGameState} />;
    case 4:
      return <Room1 gameState={gameState} setGameState={setGameState} />;
    case 5:
      // Ensure quiz only triggers after Room 3 Escape
      if (gameState.bossReady) {
        return <QuizPhase gameState={gameState} setGameState={setGameState} />;
      }
      return <Room3Escape setGameState={setGameState} />;
    case 6:
      if (gameState.bossDefeated) {
        return <VictoryPhase gameState={gameState} />;
      }
      return <BossFightPhase gameState={gameState} setGameState={setGameState} />;
    default:
      return null;
  }
}

export default GamePhase;