import React from "react";

function VictoryPhase({ gameState }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>🎉 Victory!</h2>
      <p>You earn:</p>
      <ul>
        {gameState.lootUnlocked.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <button onClick={() => window.location.reload()}>Restart Game</button>
    </div>
  );
}

export default VictoryPhase;