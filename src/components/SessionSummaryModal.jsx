import React from "react";
import { IoBarbell, IoWalk, IoFlame, IoBook } from "react-icons/io5";
import "./styles/SessionSummary.css";

function SessionSummaryModal({ summary, onContinue, onViewLog, continueLabel = "Continue" }) {
  if (!summary) return null;
  const { totalWeight, distance, calories, exerciseCount } = summary;
  return (
    <div className="session-summary-overlay">
      <div className="session-summary-box">
        <h2 className="session-summary-header">SESSION COMPLETE</h2>
        <ul className="summary-list">
          <li><IoBarbell /> <span>Total Weight Lifted:</span> <strong>{totalWeight}</strong></li>
          <li><IoWalk /> <span>Distance Travelled:</span> <strong>{distance}</strong></li>
          <li><IoFlame /> <span>Estimated Calories Burned:</span> <strong>{calories}</strong></li>
          <li><IoBook /> <span>Exercises Logged:</span> <strong>{exerciseCount}</strong></li>
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
