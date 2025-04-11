import { useState } from "react";
import WorkoutLogger from "../WorkoutLogger";

function Room3Escape({ gameState, setGameState }) {
  const [escapeTriggered, setEscapeTriggered] = useState(false);

  const handleEscape = () => {
    setEscapeTriggered(true);
    setGameState((prev) => ({ ...prev, bossReady: true, introStage: 5 }));
  };

  if (escapeTriggered) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🚪 Escape Attempt</h2>
        <p>
          You hear movement outside the door. As you finish your workout, a pop-up appears
          warning you to flee. You sprint to the nearest door, only to find it locked.
        </p>
        <p>The quiz appears on the door lock. Answer quickly to escape!</p>
        <button onClick={() => setGameState((prev) => ({ ...prev, introStage: 5 }))}>
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Mrs. Roche's Classroom — Session 3</h2>
      <p>You scavenge the room for supplies. Log your workout below.</p>
      <WorkoutLogger roomNumber={3} gameState={gameState} setGameState={setGameState} />
      <button onClick={handleEscape}>Finish Scavenge</button>
    </div>
  );
}

export default Room3Escape;