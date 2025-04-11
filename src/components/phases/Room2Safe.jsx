import { useState } from "react";
import WorkoutLogger from "../WorkoutLogger";

function Room2({ gameState, setGameState }) {
  const [scavengeComplete, setScavengeComplete] = useState(false);

  const handleFinishScavenge = () => {
    // Add loot and narrative to the game state
    const lootItems = ["Protein Shake", "Banana", "First Aid Kit"];
    const randomLoot = lootItems[Math.floor(Math.random() * lootItems.length)];

    setGameState((prev) => ({
      ...prev,
      explorationLog: [
        ...prev.explorationLog,
        `Room 2 - Found ${randomLoot}`,
      ],
    }));

    setScavengeComplete(true);
  };

  if (scavengeComplete) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🏕️ Room 2 - Night Camp</h2>
        <p>
          After clearing the room, you notice a safe under the teacher's desk. 
          You manage to open it and find <strong>{gameState.explorationLog[gameState.explorationLog.length - 1]}</strong>.
        </p>
        <p>
          You feel more prepared for the dangers ahead. The faint sound of footsteps outside makes you uneasy.
        </p>
        <button onClick={() => setGameState((prev) => ({ ...prev, introStage: 6 }))}>
          Continue to the Next Room
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Miss John's Classroom — Session 2</h2>
      <p>You scavenge the room for supplies. Log your workout below.</p>
      <WorkoutLogger roomNumber={2} gameState={gameState} setGameState={setGameState} />
      <button onClick={handleFinishScavenge}>Finish Scavenge</button>
    </div>
  );
}

export default Room2;