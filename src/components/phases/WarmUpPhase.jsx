import React, { useEffect, useState } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import WarmupDisplay from "../WarmupDisplay";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";


function WarmUpPhase({ setGameState }) {
  const [stage, setStage] = useState('intro');
  const [focus, setFocus] = useState('legs');

  useEffect(() => {
    const timer = setTimeout(() => {
      playSound('rowing');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (stage === 'intro') {
    return (
      <div className="room-container">
        <img src="/RowingMachine.png" alt="Rowing Machine" className="scene-image" />
        <ParallaxDust />
        <div className="room-content rpg-text">
          <h2>🔥 Warm-Up</h2>
          {narrationLines.general.warmupIntro.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
          <button onClick={() => setStage('prompt')}>Continue</button>
        </div>
      </div>
    );
  }

  if (stage === 'prompt') {
    return (
      <div className="rpg-text room-content">
        <p>Would you like a guided RAMP warm up?</p>
        <button onClick={() => setStage('select')}>Yes</button>
        <button onClick={() => setGameState((prev) => ({ ...prev, introStage: 2 }))}>
          Skip
        </button>
      </div>
    );
  }

  if (stage === 'select') {
    return (
      <div className="rpg-text room-content">
        <p>Choose your focus.</p>
        <button onClick={() => { setFocus('legs'); setStage('warmup'); }}>Legs</button>
        <button onClick={() => { setFocus('upperBody'); setStage('warmup'); }}>Upper Body</button>
        <button onClick={() => { setFocus('full'); setStage('warmup'); }}>Both</button>
      </div>
    );
  }

  if (stage === 'warmup') {
    return (
      <WarmupDisplay
        focus={focus}
        onComplete={() => setGameState((prev) => ({ ...prev, introStage: 2 }))}
      />
    );
  }

  return null;
}

export default WarmUpPhase;
