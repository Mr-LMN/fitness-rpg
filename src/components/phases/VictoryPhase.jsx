import React, { useEffect, useMemo } from "react";
import { playSound } from "../../utils";
import TTSLine from "../TTSLine";
import { questById } from "../../data/questDeck";

function VictoryPhase({ gameState }) {
  useEffect(() => {
    playSound('xpLevel');
  }, []);

  const completedQuests = useMemo(
    () =>
      (gameState.completedQuests || [])
        .map((id) => questById[id])
        .filter(Boolean),
    [gameState.completedQuests]
  );

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
      {completedQuests.length > 0 && (
        <>
          <h3>Completed Quests</h3>
          <ul>
            {completedQuests.map((quest) => (
              <li key={quest.id}>{quest.title}</li>
            ))}
          </ul>
        </>
      )}
      <button onClick={() => window.location.reload()}>Restart Game</button>
    </div>
  );
}

export default VictoryPhase;
