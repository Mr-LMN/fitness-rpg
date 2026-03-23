import React from "react";

/**
 * Combo counter HUD element. Shows current combo streak and XP multiplier.
 * Combo tiers: 1-2 = normal, 3-5 = hot, 6+ = fire
 */
export default function ComboCounter({ combo = 0, multiplier = 1 }) {
  if (combo < 2) return null;

  const tier =
    combo >= 6 ? "combo-counter--fire" : combo >= 3 ? "combo-counter--hot" : "";

  const flame = combo >= 6 ? "🔥🔥" : combo >= 3 ? "🔥" : "⚡";

  return (
    <div className={`combo-counter ${tier}`}>
      <span className="combo-label">COMBO</span>
      <span className="combo-number">
        {flame} {combo}x
      </span>
      <span className="combo-multiplier">×{multiplier.toFixed(1)} XP</span>
    </div>
  );
}
