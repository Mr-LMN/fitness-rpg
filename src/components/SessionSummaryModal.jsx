import React from "react";
import {
  IoBarbell,
  IoWalk,
  IoFlame,
  IoBook,
  IoRepeat,
  IoTimer,
  IoFlag,
  IoList,
} from "react-icons/io5";
import "./styles/SessionSummary.css";

function SessionSummaryModal({
  summary,
  onContinue,
  onViewLog,
  continueLabel = "Continue",
  variant = "standard",
}) {
  if (!summary) return null;
  const { totalWeight, distance, calories, exerciseCount } = summary;
  const movementText =
    Array.isArray(summary?.movements) && summary.movements.length
      ? summary.movements.join(" • ")
      : null;
  return (
    <div className="session-summary-overlay">
      <div className="session-summary-box">
        <h2 className="session-summary-header">SESSION COMPLETE</h2>
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
