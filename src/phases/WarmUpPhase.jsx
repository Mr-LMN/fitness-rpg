import React from "react";

function WarmUpPhase({ setGameState }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>🔥 Warm-Up</h2>
      <p>
        Your muscles ache. You shuffle across the room, rubbing your arms. You
        spot a dusty rowing machine still plugged in.
      </p>
      <p>🏃 To raise your heart rate, complete a 500m row.</p>
      <button onClick={() => setGameState((prev) => ({ ...prev, currentPhase: "next-phase" }))}>
        Row Complete
      </button>
    </div>
  );
}

export default WarmUpPhase;