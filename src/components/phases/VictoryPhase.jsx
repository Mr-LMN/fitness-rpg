import React, { useEffect } from "react";
import { playSound } from "../../utils";
import TTSLine from "../TTSLine";

function VictoryPhase({ gameState }) {
  useEffect(() => {
    playSound('xpLevel');
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h2>🎉 Victory!</h2>
      <TTSLine text="You earn:" />
      <ul>
        {gameState.lootUnlocked.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      {gameState.badges?.length > 0 && (
        <>
          <h3>Your Badges</h3>
          <ul>
            {gameState.badges.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </>
      )}
      <button onClick={() => window.location.reload()}>Restart Game</button>
    </div>
  );
}

export default VictoryPhase;
