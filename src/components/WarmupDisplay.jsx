import React from "react";
import warmups from "../data/warmups";
import "./styles/WarmupDisplay.css";

/**
 * Displays a dynamic warm-up routine. It is rendered in an
 * overlay so it appears in the middle of the screen rather
 * than at the bottom of the scene.
 */

function WarmupDisplay({ focus = "full", onComplete }) {
  const warmup = warmups[focus] || warmups.full;

  return (
    <div className="warmup-overlay">
      <div className="warmup-display">
        <h3 className="warmup-title">{warmup.name}</h3>
        <ol className="warmup-list">
          {warmup.steps.map((step, i) => (
            <li key={i} className="warmup-step">
              <strong>{step.phase}:</strong> {step.action}
            </li>
          ))}
        </ol>
        <div className="warmup-actions">
          <button className="complete-btn" onClick={onComplete}>
            I’ve Completed This
          </button>
          <button className="tips-btn" disabled>
            Show Movement Tips
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarmupDisplay;
