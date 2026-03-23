import React, { useEffect, useState, useRef } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import "./WarmUpPhase.css";
import { playSound } from "../../utils";
import { showXPPopup } from "../XPPopup";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";

const ROW_TARGET = 500;

const COACHING_TIPS = [
  "Drive hard with your legs \u2014 they\u2019re the engine!",
  "Keep your back straight, pull to your lower chest.",
  "Breathe out on the pull, in on the recovery.",
  "Short rest between strokes \u2014 keep it consistent.",
  "Every metre counts against TITAN. You\u2019ve got this!",
];

const TITAN_ROW_TAUNTS = [
  "Slow. Predictable. I expected more.",
  "The machine works harder than you do.",
  "At this rate, I\u2019ll have locked down the entire county.",
  "Interesting. Your heart rate is climbing. Good.",
  "Perhaps you aren\u2019t entirely useless after all.",
];

function WarmUpPhase({ setGameState, gameState = {} }) {
  const [showRow, setShowRow]   = useState(false);
  const [distance, setDistance] = useState(0);
  const [tipIdx, setTipIdx]     = useState(0);
  const [done, setDone]         = useState(false);
  const [repFlash, setRepFlash] = useState(false);
  const tipRef                  = useRef(null);

  const { textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' } = gameState;

  useEffect(() => {
    const t = setTimeout(() => playSound('rowing'), 5000);
    return () => clearTimeout(t);
  }, []);

  // Rotate coaching tip every 10 seconds while rowing
  useEffect(() => {
    if (!showRow || done) return;
    tipRef.current = setInterval(() => setTipIdx((i) => (i + 1) % COACHING_TIPS.length), 10000);
    return () => clearInterval(tipRef.current);
  }, [showRow, done]);

  const [tauntIdx, setTauntIdx] = useState(0);

  const addMetres = (m) => {
    setDistance((prev) => {
      const next = Math.min(prev + m, ROW_TARGET);
      if (next >= ROW_TARGET) {
        setDone(true);
        playSound('correct');
        showXPPopup("500m COMPLETE!", { variant: "xp" });
      } else {
        playSound('repClick');
        showXPPopup(`+${m}m`, { variant: "xp" });
      }
      return next;
    });
    setTauntIdx((prev) => (prev + 1) % TITAN_ROW_TAUNTS.length);
    setRepFlash(true);
    setTimeout(() => setRepFlash(false), 320);
  };

  const pct        = Math.round((distance / ROW_TARGET) * 100);
  const barColor   = pct >= 100 ? '#4ade80' : pct >= 60 ? '#ffd166' : '#60a5fa';

  const confirmDone = () => {
    playSound('footsteps');
    setGameState((prev) => ({ ...prev, introStage: 2 }));
  };

  return (
    <div className="room-container">
      <img src="/images/RowingMachine.png" alt="Rowing Machine" className="scene-image" />
      <ParallaxDust />

      <div className="room-content rpg-text">
        <h2 className="phase-heading warmup-heading">WARM-UP PROTOCOL</h2>

        {!showRow ? (
          <ScrollingNarrationBox
            lines={narrationLines.general.warmupIntro}
            autoRead={textToSpeech}
            enhancedMode={enhancedReading}
            readingAge={readingAge}
            speaker="TITAN"
            speakerColor="#ff4444"
            onComplete={() => setShowRow(true)}
          />
        ) : (
          <div className={`warmup-panel ${repFlash ? 'warmup-flash' : ''}`}>

            {/* Challenge badge */}
            <div className="warmup-target-badge titan-border">
              <span className="warmup-target-icon">🚣</span>
              <div>
                <p className="warmup-target-title">500m ROW</p>
                <p className="warmup-target-sub">TITAN's Challenge — Prove Your Worth</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="warmup-progress-section">
              <div className="warmup-progress-header">
                <span className="warmup-dist-label">Distance Rowed</span>
                <span className="warmup-dist-value" style={{ color: barColor }}>
                  {distance}m / {ROW_TARGET}m
                </span>
              </div>
              <div className="warmup-progress-track">
                <div
                  className="warmup-progress-fill"
                  style={{ width: `${pct}%`, background: barColor, transition: 'width 0.4s ease' }}
                />
                <span className="warmup-pct">{pct}%</span>
              </div>
            </div>

            {/* TITAN taunt */}
            {distance > 0 && !done && (
              <div className="titan-terminal" style={{ padding: '8px 14px', fontSize: '0.78rem' }} key={`taunt-${tauntIdx}`}>
                <span style={{ color: '#ff4444', marginRight: '6px', fontWeight: 700 }}>TITAN:</span>
                <span style={{ color: 'rgba(255,60,60,0.7)', fontStyle: 'italic' }}>
                  {TITAN_ROW_TAUNTS[tauntIdx]}
                </span>
              </div>
            )}

            {/* Coaching tip */}
            <div className="warmup-tip" key={tipIdx}>
              <span className="warmup-tip-icon">💡</span>
              <span>{COACHING_TIPS[tipIdx]}</span>
            </div>

            {/* Log metres buttons */}
            {!done && (
              <div className="warmup-add-btns">
                <p className="warmup-add-label">Log metres as you row:</p>
                <div className="warmup-add-row">
                  {[50, 100, 250].map((m) => (
                    <button
                      key={m}
                      className="warmup-add-btn"
                      onClick={() => addMetres(m)}
                      disabled={distance >= ROW_TARGET}
                    >
                      +{m}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm */}
            <button
              className={`${done ? 'btn-neon btn-neon--green' : 'btn-neon'} warmup-confirm-btn`}
              onClick={confirmDone}
              style={{ width: '100%' }}
            >
              {done ? '\u2713  500m Complete \u2014 Move On!' : "I\u2019ve rowed 500m"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WarmUpPhase;
