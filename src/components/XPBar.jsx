import React from "react";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import { Trophy, Backpack, AlertTriangle } from "lucide-react";
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

function XPBar({ avatar, xp, playerName, badges = [], survivorStatus, recoveryWorkoutsCompleted = 0, recoveryWorkoutsNeeded = 2, onOpenInventory }) {
  const level = Math.floor((xp || 0) / 100);
  const xpInLevel = (xp || 0) % 100;
  const title = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];
  const isInjured = survivorStatus === 'injured';

  return (
    <div className={`xpbar-wrap ${isInjured ? 'xpbar-injured' : ''}`}>
      {/* Left: avatar + name */}
      <div className="xpbar-left">
        <div className="xpbar-avatar" aria-hidden="true">
          {AVATAR_ICONS[avatar] || AVATAR_ICONS.pirate}
        </div>
        <span className="xpbar-name">{playerName || "Hero"}</span>
      </div>

      {/* Centre: XP bar */}
      <div className="xpbar-centre">
        <span className="xpbar-level-num">Lvl {level}</span>
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
        </div>
        <span className="xpbar-xp-count">{xp} XP</span>
      </div>

      {/* Right: badges + inventory + injury */}
      <div className="xpbar-right">
        {isInjured && (
          <div className="xpbar-injured-badge" role="alert" aria-live="polite">
            <span className="xpbar-injured-dot" />
            <span className="xpbar-injured-text">WEAKENED</span>
          </div>
        )}
        {badges.length > 0 && (
          <div className="xpbar-badges" aria-label={`${badges.length} badges earned`}>
            <Trophy size={14} /> <span>{badges.length}</span>
          </div>
        )}
        {onOpenInventory && (
          <button className="xpbar-inventory-btn" onClick={onOpenInventory} aria-label="Open inventory">
            <Backpack size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default XPBar;
