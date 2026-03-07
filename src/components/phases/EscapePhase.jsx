import React, { useState, useCallback, useRef } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import "./EscapePhase.css";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";
import { getReadingProfile } from "../../helpers/readingProfile";
import { adaptNarrative, adaptSingleLine } from "../../helpers/narrativeAdapter";

function EscapePhase({ setGameState, gameState = {}, slamBallGoal = 10, squatJumpGoal = 15 }) {
  const { textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' } = gameState;
  const [narrativeDone, setNarrativeDone] = useState(false);
  const [route, setRoute]                 = useState(null);
  const [count, setCount]                 = useState(0);
  const [escaped, setEscaped]             = useState(false);
  const [repBounce, setRepBounce]         = useState(false);
  const bounceRef                         = useRef(null);

  const profile    = getReadingProfile(readingAge);
  const goal       = route === 'slam' ? slamBallGoal : squatJumpGoal;
  const percent    = Math.min(100, Math.round((count / goal) * 100));
  const isComplete = count >= goal;

  const slamLabel  = adaptSingleLine(narrationLines.general.escapingOptions.slamBall, profile);
  const squatLabel = adaptSingleLine(narrationLines.general.escapingOptions.squatJump, profile);

  const handleRep = useCallback(() => {
    playSound('repClick');
    setCount((c) => {
      const next = c + 1;
      if (next >= goal) playSound('alarm');
      return next;
    });
    clearTimeout(bounceRef.current);
    setRepBounce(true);
    bounceRef.current = setTimeout(() => setRepBounce(false), 300);
  }, [goal]);

  const handleEscape = useCallback(() => {
    if (!isComplete) return;
    setEscaped(true);
    playSound('openingDoor');
  }, [isComplete]);

  const handleSuccessDone = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      introStage: 4,
      badges: prev.badges.includes("lockerEscapee")
        ? prev.badges
        : [...prev.badges, "lockerEscapee"],
    }));
  }, [setGameState]);

  // ── Success narration ─────────────────────────────────────────────────────
  if (escaped) {
    return (
      <div className="room-container">
        <img src="/images/Escape_route.png" alt="Escape" className="scene-image" />
        <ParallaxDust />
        <div className="room-content rpg-text">
          <h2 className="phase-heading phase-heading--success">ESCAPED!</h2>
          <ScrollingNarrationBox
            lines={narrationLines.general.escapeSuccess}
            autoRead={textToSpeech}
            enhancedMode={enhancedReading}
            readingAge={readingAge}
            onComplete={handleSuccessDone}
          />
        </div>
      </div>
    );
  }

  // ── Exercise counter ──────────────────────────────────────────────────────
  if (route) {
    const isSlamRoute  = route === 'slam';
    const exerciseName = isSlamRoute ? 'Slam Balls' : 'Squat Jumps';
    const btnEmoji     = isSlamRoute ? '💥' : '⬆️';
    const btnLabel     = isSlamRoute ? 'SLAM!' : 'JUMP!';
    const coachingTip  = isSlamRoute
      ? 'Pick up, reach overhead, then slam it with everything you've got!'
      : 'Squat deep, then explode upward — arms drive you higher!';
    const barColor     = isComplete ? '#4ade80' : percent >= 60 ? '#ffd166' : '#f87171';

    return (
      <div className="room-container">
        <img src="/images/Escape_route.png" alt="Escape Route" className="scene-image" />
        <ParallaxDust />
        <div className="room-content rpg-text">
          <h2 className="phase-heading escape-active-heading">{exerciseName.toUpperCase()}</h2>

          <div className="escape-coaching-tip">
            <span>💡</span>
            <span>{coachingTip}</span>
          </div>

          {/* Large rep counter */}
          <div className={`escape-rep-counter ${repBounce ? 'rep-bounce' : ''}`}>
            <span className="escape-rep-num" style={{ color: barColor }}>{count}</span>
            <span className="escape-rep-slash">/</span>
            <span className="escape-rep-goal">{goal}</span>
          </div>

          {/* Progress bar */}
          <div className="escape-progress-wrap">
            <div className="escape-progress-track">
              <div
                className={`escape-progress-fill ${isComplete ? 'escape-progress-done' : ''}`}
                style={{ width: `${percent}%`, background: barColor }}
              />
            </div>
            <span className="escape-progress-label">{percent}%</span>
          </div>

          <div className="escape-actions">
            <button
              className={`escape-rep-btn ${repBounce ? 'escape-rep-btn-active' : ''}`}
              onClick={handleRep}
              disabled={isComplete}
            >
              {btnEmoji} {btnLabel}
            </button>
            {isComplete && (
              <button className="primary-btn escape-go-btn" onClick={handleEscape}>
                🚪 Break Free!
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Route choice ──────────────────────────────────────────────────────────
  return (
    <div className="room-container">
      <img src="/images/Escape_route.png" alt="Possible Escape" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2 className="phase-heading">ESCAPE ROUTE</h2>
        {!narrativeDone ? (
          <ScrollingNarrationBox
            lines={narrationLines.general.escaping}
            autoRead={textToSpeech}
            enhancedMode={enhancedReading}
            readingAge={readingAge}
            onComplete={() => setNarrativeDone(true)}
          />
        ) : (
          <div className="escape-choice">
            <p className="escape-choice-prompt">Choose your escape method:</p>
            <div className="escape-choice-buttons">

              {/* Slam Ball option */}
              <button
                className="escape-option-btn escape-option--slam"
                onClick={() => { playSound('menuPress'); setRoute('slam'); }}
              >
                <span className="escape-option-icon">
                  <img
                    src="/images/exercises/slam-ball.png"
                    alt="Slam Ball"
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                  />
                  <span style={{ display:'none', fontSize:'2.5rem' }}>💥</span>
                </span>
                <span className="escape-option-title">Slam Balls</span>
                <span className="escape-option-text">{slamLabel}</span>
                <span className="escape-option-target">{slamBallGoal} reps</span>
              </button>

              {/* Squat Jump option */}
              <button
                className="escape-option-btn escape-option--squat"
                onClick={() => { playSound('menuPress'); setRoute('squat'); }}
              >
                <span className="escape-option-icon">
                  <img
                    src="/images/exercises/squat-jump.png"
                    alt="Squat Jump"
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                  />
                  <span style={{ display:'none', fontSize:'2.5rem' }}>⬆️</span>
                </span>
                <span className="escape-option-title">Squat Jumps</span>
                <span className="escape-option-text">{squatLabel}</span>
                <span className="escape-option-target">{squatJumpGoal} reps</span>
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EscapePhase;
