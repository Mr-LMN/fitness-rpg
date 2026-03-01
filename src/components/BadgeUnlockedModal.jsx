import React, { useEffect, useState } from "react";
import { badgeDefinitions } from "./BadgeCase";
import "./styles/BadgePopup.css";

function BadgeUnlockedModal({ badgeId, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (badgeId) {
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    }
  }, [badgeId]);

  if (!badgeId) return null;
  const badge = badgeDefinitions[badgeId] || {};

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className={`badge-overlay-bg ${visible ? "badge-overlay-visible" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`badge-reveal-card ${visible ? "badge-reveal-visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="badge-glow" />
        <div className="badge-burst">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="badge-ray" style={{ "--ray-i": i }} />
          ))}
        </div>
        <div className="badge-icon-wrap">
          {badge.image ? (
            <img src={badge.image} alt={badge.label} className="badge-reveal-img" />
          ) : (
            <span className="badge-reveal-icon">{badge.icon}</span>
          )}
        </div>
        <div className="badge-reveal-tag">Badge Unlocked</div>
        <h3 className="badge-reveal-label">{badge.label}</h3>
        <p className="badge-reveal-desc">{badge.description}</p>
        <button className="badge-reveal-btn" onClick={handleClose}>
          Claim
        </button>
      </div>
    </div>
  );
}

export default BadgeUnlockedModal;
