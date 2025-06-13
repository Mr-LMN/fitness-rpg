import React from "react";

function BossFightPhase({ gameState, setGameState }) {
  const lootBasedOnPerformance = () => {
    if (gameState.quizScore >= 5) {
      return ["🧾 Rare Logbook", "🎽 Golden Cosmetic"];
    } else if (gameState.quizScore >= 3) {
      return ["🧾 Standard Logbook", "🎽 Basic Cosmetic"];
    } else {
      return ["🧾 Torn Logbook"];
    }
  };

  const loot = lootBasedOnPerformance();

  const handleDefeat = () => {
    setGameState((prev) => ({ ...prev, bossDefeated: true, lootUnlocked: loot }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>👹 Boss Fight: Mutated Mrs Roche</h2>
      <p>🏋️ 21-15-9: Box jumps, slam balls, Calories</p>
      <p>
        ⚡ Missed BlazePods: {gameState.missedBlazePods} → Burn{" "}
        {gameState.missedBlazePods * 5} calories post-fight!
      </p>
      <button onClick={handleDefeat}>Complete Battle</button>
    </div>
  );
}

export default BossFightPhase;