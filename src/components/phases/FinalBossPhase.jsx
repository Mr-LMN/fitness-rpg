import React, { useState, useEffect, useRef, useMemo } from "react";
import ParallaxDust from "../ParallaxDust";
import BlazePods from "../BlazePods";
import VideoSlot from "../VideoSlot";
import Confetti from "../Confetti";
import { showXPPopup } from "../XPPopup";
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
    icon: "🚴",
    tip: "Drive the Assault Bike hard — arms and legs together! Every calorie is a blow to TITAN!",
    titanTaunt: "TITAN: \"Your cardiovascular output is... disappointing.\"",
  },
  {
    id: "slam",
    label: "Slam Balls",
    target: 15,
    unit: "Reps",
    hpChunk: 33,
    icon: "💥",
    tip: "Grab the ball. Reach overhead. SLAM it down! Each slam sends a shockwave through TITAN's systems!",
    titanTaunt: "TITAN: \"Impact detected... systems destabilising...\"",
  },
  {
    id: "burpee",
    label: "Burpees",
    target: 9,
    unit: "Reps",
    hpChunk: 33,
    icon: "🔥",
    tip: "Drop, push up, explode upward! Your speed is TITAN's weakness! This is the final push!",
    titanTaunt: "TITAN: \"ERROR... CANNOT TRACK SUBJECT... TOO FAST...\"",
  },
];

function FinalBossPhase({ setGameState, gameState, onQuestEvent = () => {} }) {
  const [introVideoWatched, setIntroVideoWatched] = useState(false);
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [titanTaunt, setTitanTaunt] = useState("");
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

  const triggerHit = (newHp, dmg) => {
    setHitFlash(true);
    setShake(true);
    setTimeout(() => {
      setHitFlash(false);
      setShake(false);
    }, 650);
    playSound("alarm");
    setBossHp(Math.max(0, newHp));
    // Floating damage number
    showXPPopup(`-${dmg} HP`, { variant: "damage", x: window.innerWidth / 2, y: 200 });
  };

  const handleStart = () => {
    playSound("alarm");
    playSound("bossMusic");
    setBattleStarted(true);
    addLog("⚔ BATTLE STARTED! Complete all 3 exercises to shut down TITAN!");
    addLog(`Phase 1: ${WORKOUT_PHASES[0].icon} ${WORKOUT_PHASES[0].label} — ${WORKOUT_PHASES[0].target} ${WORKOUT_PHASES[0].unit}`);
  };

  const handlePhaseSubmit = () => {
    const val = parseInt(phaseInput, 10);
    if (!val || val < 1) return;

    const actual = Math.min(val, currentPhase.target);
    const ratio = actual / currentPhase.target;
    const dmg = Math.round(ratio * currentPhase.hpChunk);
    const newHp = Math.max(0, bossHp - dmg);

    addLog(
      `${currentPhase.icon} ${currentPhase.label}: ${actual}/${currentPhase.target} ${currentPhase.unit} — ${dmg} DAMAGE!`
    );
    triggerHit(newHp, dmg);

    // Show TITAN taunt after phase
    setTitanTaunt(currentPhase.titanTaunt);
    setTimeout(() => setTitanTaunt(""), 4000);

    const newCompleted = [...completedPhases, currentPhase.id];
    setCompletedPhases(newCompleted);
    setPhaseInput("");

    const nextIdx = currentPhaseIdx + 1;
    if (nextIdx < WORKOUT_PHASES.length) {
      setCurrentPhaseIdx(nextIdx);
      setTimeout(() => {
        addLog(
          `Phase ${nextIdx + 1}: ${WORKOUT_PHASES[nextIdx].icon} ${WORKOUT_PHASES[nextIdx].label} — ${WORKOUT_PHASES[nextIdx].target} ${WORKOUT_PHASES[nextIdx].unit}`
        );
      }, 800);
    } else {
      setTimeout(() => doFinish(newHp, newCompleted.length), 500);
    }
  };

  const doFinish = (finalHp, phasesCount) => {
    finalTimerRef.current = timer;
    setBattleFinished(true);
    setShowConfetti(true);

    const dealtDamage = BOSS_MAX_HP - Math.max(0, finalHp);
    addLog(`🏆 TITAN DEFEATED! ${dealtDamage} total damage dealt!`);

    showXPPopup("+50 XP — TITAN DESTROYED!", { variant: "xp", y: 100 });

    setGameState((prev) => {
      const newBadges = [BADGES.BOSS_VANQUISHER];
      if (finalTimerRef.current <= SPEED_THRESHOLDS.SPEED_RUNNER)
        newBadges.push(BADGES.SPEED_RUNNER);
      if (finalTimerRef.current <= SPEED_THRESHOLDS.TOP_TEN)
        newBadges.push(BADGES.TOP_TEN);

      const badgesToAdd = newBadges.filter((b) => !prev.badges.includes(b));

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
  const hpColor =
    hpPercent > 50 ? "#ef4444" : hpPercent > 20 ? "#f59e0b" : "#7f1d1d";
  const isCritical = hpPercent <= 20 && hpPercent > 0;

  return (
    <div className="final-boss-page">
      <img
        src="/images/FitnessSuite.png"
        alt="Fitness Suite"
        className="final-boss-bg"
      />
      <ParallaxDust />
      {showConfetti && <Confetti count={80} duration={5000} />}

      {/* Boss intro video */}
      {!introVideoWatched && (
        <div className="final-boss-intro-video-wrap">
          <VideoSlot
            src="/videos/Boss-Intro.mp4"
            onEnd={() => setIntroVideoWatched(true)}
            poster="/images/FitnessSuite.png"
            label="TITAN final boss introduction"
          />
        </div>
      )}

      {introVideoWatched && (
        <div
          className={`final-boss-arena ${shake ? "screen-shake" : ""}`}
        >
          {/* TITAN face panel */}
          {!battleStarted && !battleFinished && (
            <div className="titan-face-panel scanlines">
              <div className="titan-face-grid">
                <span className="titan-face-char flicker">T</span>
                <span className="titan-face-char">I</span>
                <span className="titan-face-char flicker" style={{ animationDelay: "0.3s" }}>T</span>
                <span className="titan-face-char">A</span>
                <span className="titan-face-char flicker" style={{ animationDelay: "0.7s" }}>N</span>
              </div>
              <div className="titan-face-status">
                <span className="titan-eye" />
                <span className="titan-face-status-text">
                  MAINFRAME ACTIVE — THREAT LEVEL: MAXIMUM
                </span>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="final-boss-header">
            <h1 className="final-boss-title glitch-v2">
              OPERATION SLAMSTORM
            </h1>
            <div className="final-boss-timer">
              {battleStarted ? (
                <span
                  className={`timer-value ${
                    !battleFinished ? "timer-ticking" : "timer-done"
                  }`}
                >
                  {formattedTime}
                </span>
              ) : (
                <span className="timer-standby">Ready to engage</span>
              )}
            </div>
          </div>

          {/* Boss HP Bar (Enhanced) */}
          <div
            className={`boss-hp-container ${
              isCritical ? "boss-hp-container--critical" : ""
            } ${hitFlash ? "boss-hp-container--hit" : ""}`}
          >
            <div className="boss-hp-name">
              TITAN MAINFRAME {isCritical && "— CRITICAL"}
            </div>
            <div className="boss-hp-track">
              <div
                className="boss-hp-fill"
                style={{ width: `${hpPercent}%`, background: hpColor }}
              />
            </div>
            <div className="boss-hp-text">
              {Math.max(0, bossHp)} / {BOSS_MAX_HP} HP
            </div>
            {/* Exercise phase tracker */}
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
                  <span className="dot-icon">{ph.icon}</span>
                  <span className="dot-nm">
                    {ph.target} {ph.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TITAN Taunt */}
          {titanTaunt && (
            <div className="titan-terminal" style={{ margin: "12px 0", textAlign: "center" }}>
              <p style={{ color: "var(--titan-red)", margin: 0, fontSize: "0.85rem" }}>
                {titanTaunt}
              </p>
            </div>
          )}

          {/* PRE-BATTLE */}
          {!battleStarted && (
            <div className="final-prebattle">
              <p className="final-lore">
                TITAN's arena blazes red. The assault bikes, slam balls, and
                burpee stations form a gauntlet designed to break you.
              </p>
              <p className="final-lore" style={{ color: "var(--color-accent)" }}>
                Complete the <strong>21-15-9 Hero Workout</strong> to shut TITAN
                down for good!
              </p>
              <div className="final-workout-preview">
                {WORKOUT_PHASES.map((ph) => (
                  <div key={ph.id} className="preview-row">
                    <span className="preview-icon">{ph.icon}</span>
                    <span className="preview-txt">
                      <strong>{ph.target}</strong> {ph.label} ({ph.unit})
                    </span>
                  </div>
                ))}
              </div>
              <button className="btn-neon btn-neon--danger" onClick={handleStart} style={{ width: "100%", marginTop: 16 }}>
                ⚔ ENGAGE TITAN
              </button>
            </div>
          )}

          {/* ACTIVE BATTLE */}
          {battleStarted && !battleFinished && !allPhasesComplete && (
            <div className="final-active">
              <div className="final-phase-card">
                <div className="final-phase-top">
                  <span className="final-phase-pill">
                    {currentPhase.icon} Phase {currentPhaseIdx + 1} /{" "}
                    {WORKOUT_PHASES.length}
                  </span>
                  <h3 className="final-phase-name">{currentPhase.label}</h3>
                </div>
                <p className="final-phase-tip">{currentPhase.tip}</p>
                <p className="final-phase-target">
                  Target:{" "}
                  <strong>
                    {currentPhase.target} {currentPhase.unit}
                  </strong>
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
                    className="btn-neon btn-neon--danger"
                    onClick={handlePhaseSubmit}
                    disabled={!phaseInput}
                  >
                    ⚔ ATTACK!
                  </button>
                </div>
              </div>

              <BlazePods />
            </div>
          )}

          {/* MANUAL FINISH */}
          {battleStarted && !battleFinished && allPhasesComplete && (
            <div className="final-wrap-up">
              <p className="wrap-up-msg">
                All exercises complete! TITAN's systems are failing!
              </p>
              <button
                className="btn-neon btn-neon--gold"
                onClick={handleManualFinish}
                style={{ width: "100%" }}
              >
                🏆 DELIVER FINAL BLOW
              </button>
            </div>
          )}

          {/* VICTORY */}
          {battleFinished && (
            <div className="final-victory-panel celebration-burst">
              <h2 className="fv-title neon-text-green">TITAN DESTROYED!</h2>
              <p className="fv-sub">
                TITAN's systems collapse. The red lights shift to green. Every
                door unlocks. The steel shutters grind open — the pathway to the
                Maths Department is clear.
              </p>
              <div className="fv-stats">
                <div className="fvs-item">
                  <span className="fvs-val">{formattedTime}</span>
                  <span className="fvs-lbl">Time</span>
                </div>
                <div className="fvs-item">
                  <span className="fvs-val" style={{ color: "var(--color-accent)" }}>
                    +50 XP
                  </span>
                  <span className="fvs-lbl">Earned</span>
                </div>
                <div className="fvs-item">
                  <span className="fvs-val">
                    {completedPhases.length}/{WORKOUT_PHASES.length}
                  </span>
                  <span className="fvs-lbl">Phases</span>
                </div>
              </div>
              {finalTimerRef.current <= SPEED_THRESHOLDS.SPEED_RUNNER && (
                <div className="fv-speed-badge">
                  ⚡ SPEED BADGE UNLOCKED!{" "}
                  {finalTimerRef.current <= SPEED_THRESHOLDS.TOP_TEN
                    ? "TOP TEN — Elite performance!"
                    : "Speed Runner — Under 2 minutes!"}
                </div>
              )}
              <p className="fv-loot">
                Found: <strong>Map Piece #2 — Maths Department</strong> (added
                to backpack)
              </p>
              <button
                className="btn-neon btn-neon--gold"
                onClick={() =>
                  setGameState((prev) => ({ ...prev, introStage: 7 }))
                }
                style={{ width: "100%", marginTop: 12 }}
              >
                VIEW VICTORY REPORT →
              </button>
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
            <p className="fbl-hdr">
              <span className="titan-eye" style={{ width: 8, height: 8 }} /> Battle Log
            </p>
            {battleLog.length === 0 && (
              <p className="fbl-empty">Engage TITAN to begin...</p>
            )}
            {battleLog.map((line, i) => (
              <p key={i} className="fbl-line">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FinalBossPhase;
