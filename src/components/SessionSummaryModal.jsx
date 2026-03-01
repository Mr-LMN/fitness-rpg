import React, { useMemo } from "react";
import {
  IoBarbell,
  IoWalk,
  IoFlame,
  IoBook,
  IoRepeat,
  IoTimer,
  IoFlag,
  IoList,
  IoTrophy,
  IoStar,
} from "react-icons/io5";
import "./styles/SessionSummary.css";

const MOTIVATIONAL_MESSAGES = [
  "You crushed it! Every rep makes you stronger.",
  "Beast mode activated! Keep pushing your limits.",
  "That was legendary! Your future self will thank you.",
  "Workout complete! You're levelling up in real life.",
  "Power level increasing! Nothing can stop you now.",
  "You showed up and gave it everything. That's what champions do.",
  "Another session banked! You're building something amazing.",
  "Gains unlocked! Your body is getting stronger every session.",
];

function SessionSummaryModal({
  summary,
  onContinue,
  onViewLog,
  continueLabel = "Continue",
  variant = "standard",
  xpGained = 10,
}) {
  if (!summary) return null;
  const { totalWeight, distance, calories, exerciseCount } = summary;
  const movementText =
    Array.isArray(summary?.movements) && summary.movements.length
      ? summary.movements.join(" • ")
      : null;

  const motivationalMsg = useMemo(
    () => MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)],
    []
  );

  return (
    <div className="session-summary-overlay">
      <div className="session-summary-box">
        <h2 className="session-summary-header">SESSION COMPLETE</h2>

        <div className="xp-gain-banner">
          <IoStar className="xp-icon" />
          <span>+{xpGained} XP earned!</span>
        </div>

        <ul className="summary-list">
          {variant === "amrap" ? (
            <>
              <li className="multi-line">
                <div className="summary-row-heading">
                  <IoRepeat /> <span>Rounds Completed:</span>
                </div>
                <strong>{summary.roundsCompleted ?? "—"}</strong>
              </li>
              {summary.timeCap && (
                <li className="multi-line">
                  <div className="summary-row-heading">
                    <IoTimer /> <span>Time Cap:</span>
                  </div>
                  <strong>{summary.timeCap}</strong>
                </li>
              )}
              {summary.notes && (
                <li className="multi-line">
                  <div className="summary-row-heading">
                    <IoFlag /> <span>Notes:</span>
                  </div>
                  <strong>{summary.notes}</strong>
                </li>
              )}
              {movementText && (
                <li className="multi-line">
                  <div className="summary-row-heading">
                    <IoList /> <span>Movements:</span>
                  </div>
                  <strong>{movementText}</strong>
                </li>
              )}
            </>
          ) : (
            <>
              <li>
                <IoBarbell /> <span>Total Weight Lifted:</span>{" "}
                <strong>{totalWeight}</strong>
              </li>
              <li>
                <IoWalk /> <span>Distance Travelled:</span> <strong>{distance}</strong>
              </li>
              <li>
                <IoFlame /> <span>Estimated Calories Burned:</span>{" "}
                <strong>{calories}</strong>
              </li>
              <li>
                <IoBook /> <span>Exercises Logged:</span> <strong>{exerciseCount}</strong>
              </li>
            </>
          )}
        </ul>

        <p className="motivational-message">
          <IoTrophy className="trophy-icon" /> {motivationalMsg}
        </p>

        <div className="session-summary-actions">
          {onViewLog && (
            <button className="log-btn" onClick={onViewLog}>View My Logbook</button>
          )}
          <button className="continue-btn" onClick={onContinue}>{continueLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default SessionSummaryModal;
