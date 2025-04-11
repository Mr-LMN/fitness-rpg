import { useState } from "react";
import WorkoutLogger from "../WorkoutLogger";

function Room1({ gameState, setGameState }) {
  const [scavengeComplete, setScavengeComplete] = useState(false);

  const handleFinishScavenge = () => {
    // Add loot and narrative to the game state
    const lootItems = ["Milkshake", "Croissant", "Energy Bar", "Bottled Water"];
    const randomLoot = lootItems[Math.floor(Math.random() * lootItems.length)];

    setGameState((prev) => ({
      ...prev,
      explorationLog: [
        ...prev.explorationLog,
        `Room 1 - Found ${randomLoot}`,
      ],
    }));

    setScavengeComplete(true);
  };

  if (scavengeComplete) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🏕️ Room 1 - Night Camp</h2>
        <p>
          After clearing the room, you feel safe enough to camp here for the night. 
          You eat the <strong>{gameState.explorationLog[gameState.explorationLog.length - 1]}</strong> to regain energy for tomorrow.
        </p>
        <p>
          The metallic dragging sound in the distance gets louder. You know you'll need 
          to stay strong for what lies ahead.
        </p>
        <button onClick={() => setGameState((prev) => ({ ...prev, introStage: 5 }))}>
          Continue to the Next Room
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Mr. Watkins' Classroom — Session 1</h2>
      <p>You scavenge the room for supplies. Log your workout below.</p>
      <WorkoutLogger roomNumber={1} gameState={gameState} setGameState={setGameState} />
      <button onClick={handleFinishScavenge}>Finish Scavenge</button>
    </div>
  );
}

export default Room1;