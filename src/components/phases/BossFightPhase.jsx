import React, { useState } from "react";

function BossFightPhase({ config = {}, gameState, setGameState, onComplete }) {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => s + 1);

  if (step === 0) {
    return (
      <div className="rpg-text room-content">
        <p>The monster barges the door, the bolt beginning to loosen.</p>
        <button onClick={next}>Prepare</button>
      </div>
    );
  }

  if (step === 1) {
    const p = config.phases?.[0] || { reps: 12, exercise: "Burpees" };
    return (
      <div className="rpg-text room-content">
        <p>The mutated boss swings a ruler at you!</p>
        <p>Perform {p.reps} {p.exercise} to dodge.</p>
        <button onClick={next}>I've done it</button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="rpg-text room-content">
        <p>
          You have successfully avoided the shadowy figure's attacks and one of
          the missed hits has loosened the lock. One more attack should do it.
        </p>
        <button onClick={next}>Continue</button>
      </div>
    );
  }

  if (step === 3) {
    const p = config.phases?.[1] || { reps: 20, exercise: "Side Bunny Hops" };
    return (
      <div className="rpg-text room-content">
        <p>The boss lashes out even quicker in irritation.</p>
        <p>Complete {p.reps} {p.exercise} to stay unharmed.</p>
        <button onClick={next}>I've done it</button>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="rpg-text room-content">
        <p>The boss misses and smashes the door open, the lock falling off.</p>
        <p>You sprint down the hallway toward the fitness suite.</p>
        <button
          onClick={() => {
            setGameState && setGameState((prev) => ({ ...prev, bossDefeated: true }));
            onComplete && onComplete();
          }}
        >
          Enter Fitness Suite
        </button>
      </div>
    );
  }

  return null;
}

export default BossFightPhase;
