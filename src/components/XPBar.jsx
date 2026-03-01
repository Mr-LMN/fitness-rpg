import React from "react";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import "./styles/XPBar.css";

const AVATAR_ICONS = {
  pirate: <GiPirateCaptain />,
  knight: <GiBlackKnightHelm />,
  ninja: <GiNinjaHead />,
};

const LEVEL_TITLES = [
  "Rookie",
  "Trainee",
  "Challenger",
  "Fighter",
  "Warrior",
  "Champion",
  "Hero",
  "Legend",
];

function XPBar({ avatar, xp, playerName, badges = [] }) {
  const level = Math.floor((xp || 0) / 100);
  const xpInLevel = (xp || 0) % 100;
  const title = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];

  return (
    <div className="xpbar-wrap">
      <div className="xpbar-avatar" aria-hidden="true">
        {AVATAR_ICONS[avatar] || AVATAR_ICONS.pirate}
      </div>
      <div className="xpbar-body">
        <div className="xpbar-top">
          <span className="xpbar-name">{playerName || "Hero"}</span>
          <span className="xpbar-level">
            <span className="xpbar-level-num">Lvl {level}</span>
            <span className="xpbar-title">{title}</span>
          </span>
        </div>
        <div
          className="xpbar-track"
          role="progressbar"
          aria-valuenow={xpInLevel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`XP: ${xpInLevel}/100 to next level`}
        >
          <div
            className="xpbar-fill"
            style={{ width: `${xpInLevel}%` }}
          />
          <span className="xpbar-xp-label">{xp} XP</span>
        </div>
      </div>
      {badges.length > 0 && (
        <div className="xpbar-badges" aria-label={`${badges.length} badges earned`}>
          🏅 <span>{badges.length}</span>
        </div>
      )}
    </div>
  );
}

export default XPBar;
