import React from "react";
import {
  IoBarbell,
  IoWalk,
  IoFlame,
  IoTrophy,
  IoShirt,
  IoCheckmarkCircle,
  IoBody,
} from "react-icons/io5";
import "./styles/LifetimeSummary.css";

function LifetimeSummaryPanel({ username, summary }) {
  if (!summary) return null;
  const {
    workouts,
    weightLifted,
    distance,
    calories,
    bossesDefeated,
    cosmetics,
    weight,
  } = summary;

  return (
    <div className="lifetime-panel">
      <h2 className="lifetime-header">Welcome back, {username}!</h2>
      <p className="lifetime-subheader">Your progress so far:</p>
      <ul className="lifetime-stats">
        <li><IoCheckmarkCircle /> <span>Workouts Completed:</span> <strong>{workouts}</strong></li>
        <li><IoBarbell /> <span>Total Weight Lifted:</span> <strong>{weightLifted}</strong></li>
        <li><IoWalk /> <span>Distance Travelled:</span> <strong>{distance}</strong></li>
        <li><IoFlame /> <span>Total Calories Burned:</span> <strong>{calories}</strong></li>
        <li><IoBody /> <span>Current Weight:</span> <strong>{weight || '-'}</strong></li>
        <li><IoTrophy /> <span>Bosses Defeated:</span> <strong>{bossesDefeated}</strong></li>
        <li><IoShirt /> <span>Cosmetics Unlocked:</span> <strong>{cosmetics}</strong></li>
      </ul>
    </div>
  );
}

export default LifetimeSummaryPanel;
