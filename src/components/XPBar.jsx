import React, { useState, useEffect, useRef } from "react";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import { Trophy, Backpack, AlertTriangle, Zap } from "lucide-react";
import { CLASSES } from "../constants";
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

function XPBar({
  avatar,
  xp,
  playerName,
  badges = [],
  survivorStatus,
  recoveryWorkoutsCompleted = 0,
  recoveryWorkoutsNeeded = 2,
  onOpenInventory,
  playerClass,
  combo = 0,
}) {
  const level = Math.floor((xp || 0) / 100);
  const xpInLevel = (xp || 0) % 100;
  const title = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];
  const isInjured = survivorStatus === "injured";
  const cls = playerClass ? CLASSES[playerClass] : null;

  // XP gain animation
  const [xpFlash, setXpFlash] = useState(false);
  const prevXp = useRef(xp);
  useEffect(() => {
    if (xp > prevXp.current) {
      setXpFlash(true);
      const t = setTimeout(() => setXpFlash(false), 600);
      prevXp.current = xp;
      return () => clearTimeout(t);
    }
    prevXp.current = xp;
  }, [xp]);

  return (
    <div className={`xpbar-wrap ${isInjured ? "xpbar-injured" : ""}`}>
      {/* Left: avatar + name + class */}
      <div className="xpbar-left">
        <div
          className="xpbar-avatar"
          aria-hidden="true"
          style={cls ? { color: cls.color } : {}}
        >
          {AVATAR_ICONS[avatar] || AVATAR_ICONS.pirate}
        </div>
        <div className="xpbar-identity">
          <span className="xpbar-name">{playerName || "Hero"}</span>
          <div className="xpbar-meta">
            {cls && (
              <span className="xpbar-class" style={{ color: cls.color }}>
                {cls.icon} {cls.name}
              </span>
            )}
            <span className="xpbar-title">{title}</span>
          </div>
        </div>
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
            className={`xpbar-fill ${xpFlash ? "xpbar-fill--flash" : ""}`}
            style={{ width: `${xpInLevel}%` }}
          />
        </div>
        <span className={`xpbar-xp-count ${xpFlash ? "xp-flash" : ""}`}>
          {xp} XP
        </span>
      </div>

      {/* Right: badges + inventory + injury */}
      <div className="xpbar-right">
        {isInjured && (
          <div
            className="xpbar-injured-badge"
            role="alert"
            aria-live="polite"
          >
            <span className="xpbar-injured-dot" />
            <span className="xpbar-injured-text">WEAKENED</span>
          </div>
        )}
        {badges.length > 0 && (
          <div
            className="xpbar-badges"
            aria-label={`${badges.length} badges earned`}
          >
            <Trophy size={14} /> <span>{badges.length}</span>
          </div>
        )}
        {onOpenInventory && (
          <button
            className="xpbar-inventory-btn"
            onClick={onOpenInventory}
            aria-label="Open inventory"
          >
            <Backpack size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default XPBar;
