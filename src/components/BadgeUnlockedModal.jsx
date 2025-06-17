import React from "react";
import { badgeDefinitions } from "./BadgeCase";
import "./styles/Overlay.css";
import "./styles/BadgePopup.css";

function BadgeUnlockedModal({ badgeId, onClose }) {
  if (!badgeId) return null;
  const badge = badgeDefinitions[badgeId] || {};
  return (
    <div className="overlay-bg">
      <div className="overlay-box badge-earned">
        {badge.image ? (
          <img src={badge.image} alt={badge.label} className="badge-img" />
        ) : (
          <span className="icon">{badge.icon}</span>
        )}
        <h3>Badge Unlocked!</h3>
        <p className="label">{badge.label}</p>
        <p className="desc">{badge.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default BadgeUnlockedModal;
