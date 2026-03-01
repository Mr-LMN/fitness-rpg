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
  "TITAN ANALYSIS: Subject performance exceeds baseline. Threat level upgraded.",
  "TITAN LOG: Physical output remarkable. Recalibrating difficulty parameters.",
  "TITAN WARNING: Subject is growing stronger. Countermeasures insufficient.",
  "Workout logged. Every session weakens TITAN's hold on the school.",
  "TITAN ALERT: Anomalous effort detected. Subject classified as high-priority.",
  "Mr. Watkins would be proud. That's what Pencoedtre students are made of.",
  "Another session in the books. TITAN's defences are cracking.",
  "TITAN STATUS: Subject resilience exceeding all projections. Remarkable.",
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
        <h2 className="session-summary-header">WORKOUT LOGGED</h2>

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
