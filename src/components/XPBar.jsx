import React from "react";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import "./styles/XPBar.css";

const icons = {
  pirate: <GiPirateCaptain />,
  knight: <GiBlackKnightHelm />,
  ninja: <GiNinjaHead />,
};

function XPBar({ avatar, xp, playerName }) {
  const level = Math.floor(xp / 100);
  const xpInLevel = xp % 100;
  return (
    <div className="xpbar-container">
      <div className="xpbar-avatar">{icons[avatar]}</div>
      <div className="xpbar-info">
        <div className="xpbar-text">{playerName} - Lvl {level}</div>
        <div className="xpbar-progress">
          <div className="xpbar-fill" style={{ width: `${xpInLevel}%` }} />
        </div>
      </div>
    </div>
  );
}

export default XPBar;
