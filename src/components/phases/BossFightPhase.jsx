import React, { useState, useEffect, useRef } from "react";
import { playSound } from "../../utils";
import VideoBackground from "../VideoBackground";
import "./BossFightPhase.css";

const TOTAL_HP = 100;

function BossFightPhase({ config, gameState, setGameState, onComplete }) {
  const phases = config?.phases || [];
  const bossName = config?.name || "Boss";

  const [currentPhase, setCurrentPhase] = useState(0);
  const [bossHp, setBossHp] = useState(TOTAL_HP);
  const [repsLeft, setRepsLeft] = useState(phases[0]?.reps || 10);
  const [repsInput, setRepsInput] = useState("");
  const [battleLog, setBattleLog] = useState([]);
  const [shake, setShake] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const [defeated, setDefeated] = useState(false);
  const logRef = useRef(null);

  const totalReps = phases.reduce((s, p) => s + (p.reps || 10), 0);
  const hpPerRep = totalReps > 0 ? TOTAL_HP / totalReps : 10;

  const phase = phases[currentPhase];

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  const triggerHit = (damage, onHpZero) => {
    setHitFlash(true);
    setShake(true);
    setTimeout(() => { setHitFlash(false); setShake(false); }, 600);
    playSound("xpLevel");

    setBossHp((prev) => {
      const next = Math.max(0, prev - damage);
      if (next <= 0 && !defeated) {
        setTimeout(handleVictory, 400);
      }
      return next;
    });
  };

  const addLog = (line) => setBattleLog((prev) => [...prev, line]);

  const handleSubmitReps = () => {
    const n = parseInt(repsInput, 10);
    if (!n || n < 1) return;

    const cap = Math.min(n, repsLeft);
    const damage = Math.round(cap * hpPerRep);
    addLog(`${phase?.exercise || "Exercise"}: ${cap} reps → ${damage} damage!`);
    triggerHit(damage);

    const newLeft = repsLeft - cap;
    setRepsInput("");

    if (newLeft <= 0) {
      const next = currentPhase + 1;
      if (next < phases.length) {
        addLog(`Phase ${currentPhase + 1} complete! Next: ${phases[next].title}`);
        setCurrentPhase(next);
        setRepsLeft(phases[next].reps || 10);
      }
    } else {
      setRepsLeft(newLeft);
    }
  };

  const handleAllDone = () => {
    const remaining = repsLeft + phases.slice(currentPhase + 1).reduce((s, p) => s + (p.reps || 0), 0);
    const damage = Math.round(remaining * hpPerRep) + bossHp;
    addLog(`All exercises done! Final burst — boss defeated!`);
    triggerHit(damage);
  };

  const handleVictory = () => {
    setDefeated(true);
    addLog(`${bossName} has been defeated!`);
    playSound("alarm");
    setGameState((prev) => ({ ...prev, xp: (prev.xp || 0) + 30 }));
  };

  const hpPercent = (bossHp / TOTAL_HP) * 100;
  const hpColor = hpPercent > 50 ? "#ef4444" : hpPercent > 20 ? "#f59e0b" : "#b91c1c";

  return (
    <div className="boss-fight-page">
      <VideoBackground src="/videos/Boss-Intro.mp4" fallbackImage="/images/boss-intro.png" />
      <div className={`boss-arena ${shake ? "boss-shake" : ""}`}>

        {/* Boss Portrait */}
        <div className={`boss-portrait ${hitFlash ? "boss-hit" : ""}`}>
          <div className="boss-portrait-inner">
            <span className="boss-emoji" aria-hidden="true"></span>
            <h2 className="boss-name">{bossName}</h2>
          </div>
        </div>

        {/* HP Bar */}
        <div className="boss-hp-section">
          <div className="boss-hp-label">
            <span>BOSS HP</span>
            <span className="boss-hp-num">{Math.max(0, bossHp)} / {TOTAL_HP}</span>
          </div>
          <div className="boss-hp-track">
            <div
              className="boss-hp-fill"
              style={{ width: `${hpPercent}%`, background: hpColor }}
            />
          </div>
          {phases.length > 1 && (
            <div className="boss-phase-pips">
              {phases.map((_, i) => (
                <span
                  key={i}
                  className={`phase-pip ${i < currentPhase ? "done" : i === currentPhase ? "active" : ""}`}
                />
              ))}
            </div>
          )}
        </div>

        {!defeated ? (
          <>
            {/* Phase card */}
            <div className="boss-phase-card">
              <div className="phase-header">
                <span className="phase-badge">Phase {currentPhase + 1}/{phases.length}</span>
                <h3 className="phase-title">{phase?.title || "Combat"}</h3>
              </div>
              <p className="phase-description">{phase?.description}</p>
              <div className="phase-exercise">
                <span className="exercise-label">Exercise:</span>
                <span className="exercise-name">{phase?.exercise}</span>
              </div>
              <div className="reps-progress">
                <div className="reps-track">
                  <div
                    className="reps-fill"
                    style={{
                      width: `${Math.max(0, ((phase?.reps - repsLeft) / (phase?.reps || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="reps-label">
                  {Math.max(0, (phase?.reps || 0) - repsLeft)}/{phase?.reps || 0} reps
                </span>
              </div>
            </div>

            {/* Rep input */}
            <div className="boss-input-row">
              <label htmlFor="boss-reps" className="boss-input-label">
                How many reps did you complete?
              </label>
              <div className="boss-input-group">
                <input
                  id="boss-reps"
                  type="number"
                  min="1"
                  max={repsLeft}
                  value={repsInput}
                  onChange={(e) => setRepsInput(e.target.value)}
                  placeholder={`Max ${repsLeft}`}
                  className="boss-reps-input"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmitReps(); }}
                />
                <button
                  className="boss-hit-btn"
                  onClick={handleSubmitReps}
                  disabled={!repsInput}
                >
                  Attack!
                </button>
              </div>
              <button className="boss-done-btn" onClick={handleAllDone}>
                All exercises done — Finish Boss
              </button>
            </div>
          </>
        ) : (
          <div className="boss-victory-panel">
            <div className="victory-burst"></div>
            <h3 className="victory-title">Victory!</h3>
            <p className="victory-desc">
              {bossName} has been defeated! Your strength and determination won the day.
            </p>
            <p className="victory-xp">+30 XP earned!</p>
            <button className="boss-continue-btn" onClick={onComplete}>
              Continue Adventure
            </button>
          </div>
        )}

        {/* Battle Log */}
        <div
          className="battle-log"
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Battle log"
        >
          <h4 className="battle-log-title">Battle Log</h4>
          {battleLog.length === 0 ? (
            <p className="battle-log-empty">Complete your exercises to deal damage to the boss!</p>
          ) : (
            battleLog.map((line, i) => (
              <p key={i} className="battle-log-line">{line}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BossFightPhase;
