import React, { useState, useEffect, useRef, useMemo } from "react";
import ParallaxDust from "../ParallaxDust";
import BlazePods from "../BlazePods";
import { playSound, updateLifetimeSummary, logWorkoutMinutes } from "../../utils";
import TTSLine from "../TTSLine";
import "../styles/RoomScene.css";
import "./BossFightPhase.css";
import "./FinalBossPhase.css";
import { BADGES, SPEED_THRESHOLDS } from "../../constants";

const BOSS_MAX_HP = 100;

const WORKOUT_PHASES = [
  {
    id: "bike",
    label: "Assault Bike",
    target: 21,
    unit: "Calories",
    hpChunk: 34,
    tip: "Drive the Assault Bike hard — arm and legs together!",
  },
  {
    id: "slam",
    label: "Slam Balls",
    target: 15,
    unit: "Reps",
    hpChunk: 33,
    tip: "Pick up the ball, reach overhead, then slam it hard!",
  },
  {
    id: "burpee",
    label: "Burpees",
    target: 9,
    unit: "Reps",
    hpChunk: 33,
    tip: "Drop to the floor, push up, then jump with hands above head!",
  },
];

function FinalBossPhase({ setGameState, onQuestEvent = () => {} }) {
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleFinished, setBattleFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [bossHp, setBossHp] = useState(BOSS_MAX_HP);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [phaseInput, setPhaseInput] = useState("");
  const [completedPhases, setCompletedPhases] = useState([]);
  const [battleLog, setBattleLog] = useState([]);
  const [shake, setShake] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const finalTimerRef = useRef(0);
  const logRef = useRef(null);

  const currentPhase = WORKOUT_PHASES[currentPhaseIdx];
  const allPhasesComplete = completedPhases.length === WORKOUT_PHASES.length;

  const formattedTime = useMemo(() => {
    const t = battleFinished ? finalTimerRef.current : timer;
    if (t < 60) return `${t}s`;
    const m = Math.floor(t / 60);
    const s = t % 60;
    return s === 0 ? `${m}m` : `${m}m ${s.toString().padStart(2, "0")}s`;
  }, [timer, battleFinished]);

  // Timer
  useEffect(() => {
    if (!battleStarted || battleFinished) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [battleStarted, battleFinished]);

  // Scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [battleLog]);

  const addLog = (line) => setBattleLog((prev) => [...prev, line]);

  const triggerHit = (newHp) => {
    setHitFlash(true);
    setShake(true);
    setTimeout(() => { setHitFlash(false); setShake(false); }, 650);
    playSound("alarm");
    setBossHp(Math.max(0, newHp));
  };

  const handleStart = () => {
    playSound("alarm");
    setBattleStarted(true);
    addLog("BATTLE STARTED! Complete all 3 exercises to shut down TITAN!");
  };

  const handlePhaseSubmit = () => {
    const val = parseInt(phaseInput, 10);
    if (!val || val < 1) return;

    const actual = Math.min(val, currentPhase.target);
    const ratio = actual / currentPhase.target;
    const dmg = Math.round(ratio * currentPhase.hpChunk);
    const newHp = Math.max(0, bossHp - dmg);

    addLog(
      `${currentPhase.label}: ${actual}/${currentPhase.target} ${currentPhase.unit} — ${dmg} damage dealt!`
    );
    triggerHit(newHp);

    const newCompleted = [...completedPhases, currentPhase.id];
    setCompletedPhases(newCompleted);
    setPhaseInput("");

    const nextIdx = currentPhaseIdx + 1;
    if (nextIdx < WORKOUT_PHASES.length) {
      setCurrentPhaseIdx(nextIdx);
      setTimeout(() => {
        addLog(`Phase ${currentPhaseIdx + 1} done! Next: ${WORKOUT_PHASES[nextIdx].label}`);
      }, 300);
    } else {
      // All phases complete
      setTimeout(() => doFinish(newHp, newCompleted.length), 500);
    }
  };

  const doFinish = (finalHp, phasesCount) => {
    finalTimerRef.current = timer;
    setBattleFinished(true);

    const dealtDamage = BOSS_MAX_HP - Math.max(0, finalHp);
    addLog(`TITAN DEFEATED! ${dealtDamage} total damage dealt!`);

    setGameState((prev) => {
      const newBadges = [BADGES.BOSS_VANQUISHER];
      if (finalTimerRef.current <= SPEED_THRESHOLDS.SPEED_RUNNER)
        newBadges.push(BADGES.SPEED_RUNNER);
      if (finalTimerRef.current <= SPEED_THRESHOLDS.TOP_TEN)
        newBadges.push(BADGES.TOP_TEN);

      const badgesToAdd = newBadges.filter((b) => !prev.badges.includes(b));

      // Apply xpBoost from first matching consumable in inventory
      const inventory = prev.inventory || [];
      const xpItem = inventory.find((it) => it.effect?.xpBoost);
      const baseXP = 50;
      const xpGain = Math.round(baseXP * (1 + (xpItem?.effect?.xpBoost || 0)));

      let updatedInventory = inventory;
      if (xpItem) {
        const idx = inventory.findIndex((it) => it.id === xpItem.id);
        if (idx !== -1) {
          updatedInventory = [
            ...inventory.slice(0, idx),
            ...inventory.slice(idx + 1),
          ];
        }
      }

      return {
        ...prev,
        xp: (prev.xp || 0) + xpGain,
        bossDefeated: true,
        victory: true,
        inventory: [
          ...updatedInventory,
          {
            id: "map_piece_2",
            name: "Map Piece #2 (Maths Department)",
            rarity: "rare",
            description: "A scrap leading to the Maths Department.",
            isNew: true,
          },
        ],
        badges: [...prev.badges, ...badgesToAdd],
        leaderboardEntry: {
          time: finalTimerRef.current,
          date: new Date().toISOString(),
          workout: "Operation Slamstorm",
        },
      };
    });

    updateLifetimeSummary({ calories: 0, bossesDefeated: 1 });
    logWorkoutMinutes(finalTimerRef.current / 60);
    onQuestEvent("bossDefeated", {
      room: "Fitness Suite",
      timer: finalTimerRef.current,
    });
  };

  const handleManualFinish = () => doFinish(bossHp, completedPhases.length);

  const hpPercent = (bossHp / BOSS_MAX_HP) * 100;
  const hpColor = hpPercent > 50 ? "#ef4444" : hpPercent > 20 ? "#f59e0b" : "#7f1d1d";

  return (
    <div className="final-boss-page">
      <img src="/images/FitnessSuite.png" alt="Fitness Suite" className="final-boss-bg" />
      <ParallaxDust />

      <div className={`final-boss-arena ${shake ? "boss-shake" : ""}`}>

        {/* Header */}
        <div className="final-boss-header">
          <h1 className="final-boss-title">FINAL BOSS: OPERATION SLAMSTORM</h1>
          <div className="final-boss-timer">
            {battleStarted ? (
              <span className={`timer-value ${!battleFinished ? "timer-ticking" : "timer-done"}`}>
                {formattedTime}
              </span>
            ) : (
              <span className="timer-standby">Ready to start</span>
            )}
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className={`final-hp-section ${hitFlash ? "hp-hit-flash" : ""}`}>
          <div className="final-hp-label">
            <span>TITAN MAINFRAME</span>
            <span className="final-hp-num">{Math.max(0, bossHp)} / {BOSS_MAX_HP} HP</span>
          </div>
          <div className="final-hp-track">
            <div
              className="final-hp-fill"
              style={{ width: `${hpPercent}%`, background: hpColor }}
            />
          </div>
          {/* Exercise tracker dots */}
          <div className="final-exercise-dots">
            {WORKOUT_PHASES.map((ph, i) => (
              <div
                key={ph.id}
                className={`exercise-dot ${
                  completedPhases.includes(ph.id)
                    ? "dot-complete"
                    : i === currentPhaseIdx && battleStarted && !battleFinished
                    ? "dot-current"
                    : ""
                }`}
              >
                <span className="dot-nm">{ph.target} {ph.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRE-BATTLE */}
        {!battleStarted && (
          <div className="final-prebattle">
            <p className="final-lore">
              TITAN's arena flares to life. Every screen blazes red. The assault bikes,
              slam balls, and burpee stations form a gauntlet designed to break you.
            </p>
            <p className="final-lore">
              Complete the <strong>21-15-9 Hero Workout</strong> to shut TITAN down for good!
            </p>
            <div className="final-workout-preview">
              {WORKOUT_PHASES.map((ph) => (
                <div key={ph.id} className="preview-row">
                  <span className="preview-txt">
                    <strong>{ph.target}</strong> {ph.label} ({ph.unit})
                  </span>
                </div>
              ))}
            </div>
            <TTSLine text="Mrs. Roche reels, the Blaze Pods primed around you. Strap in and start the finisher before she rallies." />
            <button className="final-start-btn" onClick={handleStart}>
              Start Boss Battle
            </button>
          </div>
        )}

        {/* ACTIVE BATTLE */}
        {battleStarted && !battleFinished && !allPhasesComplete && (
          <div className="final-active">
            <div className="final-phase-card">
              <div className="final-phase-top">
                <span className="final-phase-pill">
                  Exercise {currentPhaseIdx + 1} / {WORKOUT_PHASES.length}
                </span>
                <h3 className="final-phase-name">
                  {currentPhase.label}
                </h3>
              </div>
              <p className="final-phase-tip">{currentPhase.tip}</p>
              <p className="final-phase-target">
                Target: <strong>{currentPhase.target} {currentPhase.unit}</strong>
              </p>
            </div>

            <div className="final-input-row">
              <label htmlFor="final-reps" className="final-input-label">
                Enter your {currentPhase.unit.toLowerCase()} completed:
              </label>
              <div className="final-input-group">
                <input
                  id="final-reps"
                  type="number"
                  min="1"
                  max={currentPhase.target}
                  value={phaseInput}
                  onChange={(e) => setPhaseInput(e.target.value)}
                  placeholder={`0 – ${currentPhase.target}`}
                  className="final-reps-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePhaseSubmit();
                  }}
                  autoFocus
                />
                <button
                  className="final-attack-btn"
                  onClick={handlePhaseSubmit}
                  disabled={!phaseInput}
                >
                  Attack!
                </button>
              </div>
            </div>

            <BlazePods />
          </div>
        )}

        {/* MANUAL FINISH */}
        {battleStarted && !battleFinished && allPhasesComplete && (
          <div className="final-wrap-up">
            <p className="wrap-up-msg">All exercises done! You've destroyed the boss!</p>
            <button className="final-finish-btn" onClick={handleManualFinish}>
              Finish Battle
            </button>
          </div>
        )}

        {/* VICTORY */}
        {battleFinished && (
          <div className="final-victory-panel">
            <div className="fv-burst"></div>
            <h2 className="fv-title">VICTORY!</h2>
            <p className="fv-sub">
              TITAN's systems collapse. The red lights shift to green. Every door in the school unlocks.
            </p>
            <div className="fv-stats">
              <div className="fvs-item">
                <span className="fvs-val">{formattedTime}</span>
                <span className="fvs-lbl">Completion Time</span>
              </div>
              <div className="fvs-item">
                <span className="fvs-val">+50 XP</span>
                <span className="fvs-lbl">Earned</span>
              </div>
              <div className="fvs-item">
                <span className="fvs-val">{completedPhases.length}/{WORKOUT_PHASES.length}</span>
                <span className="fvs-lbl">Exercises</span>
              </div>
            </div>
            <TTSLine text={`You completed Operation Slamstorm in ${formattedTime}!`} />
            <TTSLine text="Your heroic effort has been recorded on the school leaderboard." />
            <p className="fv-loot">
              Found: <strong>Map Piece #2 — Maths Department</strong> (added to backpack)
            </p>
          </div>
        )}

        {/* Battle Log */}
        <div
          className="final-battle-log"
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Battle log"
        >
          <p className="fbl-hdr">Battle Log</p>
          {battleLog.length === 0 && (
            <p className="fbl-empty">Start the battle to see the action!</p>
          )}
          {battleLog.map((line, i) => (
            <p key={i} className="fbl-line">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FinalBossPhase;
