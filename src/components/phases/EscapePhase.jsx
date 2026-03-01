import React, { useState, useCallback } from "react";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";
import { getReadingProfile } from "../../helpers/readingProfile";
import { adaptNarrative, adaptSingleLine } from "../../helpers/narrativeAdapter";

function EscapePhase({ setGameState, gameState = {}, slamBallGoal = 10, squatJumpGoal = 15 }) {
  const { textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' } = gameState;
  const [narrativeDone, setNarrativeDone] = useState(false);
  const [route, setRoute] = useState(null); // 'slam' or 'squat'
  const [count, setCount] = useState(0);
  const [escaped, setEscaped] = useState(false);

  const profile = getReadingProfile(readingAge);
  const goal = route === 'slam' ? slamBallGoal : squatJumpGoal;
  const percent = Math.min(100, Math.round((count / goal) * 100));
  const isComplete = count >= goal;

  const slamLabel = adaptSingleLine(narrationLines.general.escapingOptions.slamBall, profile);
  const squatLabel = adaptSingleLine(narrationLines.general.escapingOptions.squatJump, profile);

  const handleRep = useCallback(() => {
    setCount((c) => {
      const next = c + 1;
      if (next >= goal) playSound('alarm');
      return next;
    });
  }, [goal]);

  const handleEscape = useCallback(() => {
    if (!isComplete) return;
    setEscaped(true);
    playSound('openingDoor');
    // Small delay for the success narration, then advance
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

  // Phase 3: Escape success narration
  if (escaped) {
    return (
      <div className="room-container">
        <img src="/Escape_route.png" alt="Escape" className="scene-image" />
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

  // Phase 2: Exercise tracking
  if (route) {
    const exerciseName = route === 'slam' ? 'Slam Balls' : 'Squat Jumps';
    return (
      <div className="room-container">
        <img src="/Escape_route.png" alt="Escape Route" className="scene-image" />
        <ParallaxDust />
        <div className="room-content rpg-text">
          <h2 className="phase-heading">{exerciseName.toUpperCase()}</h2>
          <p className="escape-instruction">
            {route === 'slam'
              ? 'Slam the ball as hard as you can to shift the barricade!'
              : 'Jump explosively to build the power to reach the vent!'}
          </p>

          {/* Progress bar */}
          <div className="escape-progress-wrap">
            <div className="escape-progress-track">
              <div
                className={`escape-progress-fill ${isComplete ? 'escape-progress-done' : ''}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="escape-progress-label">{count} / {goal}</span>
          </div>

          <div className="escape-actions">
            <button
              className="escape-rep-btn"
              onClick={handleRep}
              disabled={isComplete}
            >
              {route === 'slam' ? 'SLAM!' : 'JUMP!'}
            </button>
            {isComplete && (
              <button className="primary-btn escape-go-btn" onClick={handleEscape}>
                Break Free!
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Phase 1: Narration + route choice
  return (
    <div className="room-container">
      <img src="/Escape_route.png" alt="Possible Escape" className="scene-image" />
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
            <p className="escape-choice-prompt">Choose your escape route:</p>
            <div className="escape-choice-buttons">
              <button
                className="escape-option-btn escape-option--slam"
                onClick={() => setRoute('slam')}
              >
                <span className="escape-option-icon">
                  {/* placeholder: slam ball icon */}
                  [IMG: slam_ball.png]
                </span>
                <span className="escape-option-text">{slamLabel}</span>
                <span className="escape-option-target">{slamBallGoal} reps</span>
              </button>
              <button
                className="escape-option-btn escape-option--squat"
                onClick={() => setRoute('squat')}
              >
                <span className="escape-option-icon">
                  {/* placeholder: squat jump icon */}
                  [IMG: squat_jump.png]
                </span>
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
