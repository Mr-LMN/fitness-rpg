import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import "./styles/Leaderboard.css";

const YEAR_GROUPS = ["All", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11"];

const AVATAR_ICONS = {
  pirate: <GiPirateCaptain />,
  knight: <GiBlackKnightHelm />,
  ninja: <GiNinjaHead />,
};

const MEDAL = ["🥇", "🥈", "🥉"];

const SORT_MODES = [
  { key: "xp", label: "⚡ XP" },
  { key: "totalWorkouts", label: "🏋️ Workouts" },
  { key: "totalCalories", label: "🔥 Calories" },
  { key: "totalWeightLifted", label: "💪 Weight" },
];

function Leaderboard({ currentUserId, compact = false, showTitle = true }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState("All");
  const [sortMode, setSortMode] = useState("xp");

  useEffect(() => {
    setLoading(true);
    const sortField = sortMode === "xp" ? "xp" : sortMode;

    let q;
    if (activeYear !== "All") {
      q = query(
        collection(db, "userProfiles"),
        where("yearGroup", "==", activeYear),
        orderBy(sortField, "desc"),
        limit(compact ? 10 : 50)
      );
    } else {
      q = query(
        collection(db, "userProfiles"),
        orderBy(sortField, "desc"),
        limit(compact ? 10 : 50)
      );
    }

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProfiles(data);
        setLoading(false);
      },
      (err) => {
        console.error("Leaderboard error:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, [activeYear, sortMode, compact]);

  const level = (xp) => Math.floor((xp || 0) / 100);
  const xpInLevel = (xp) => (xp || 0) % 100;

  return (
    <div className={`leaderboard-wrapper ${compact ? "compact" : ""}`}>
      {showTitle && (
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">🏆 Hall of Champions</h2>
          <p className="leaderboard-subtitle">Pencoedtre High School — Fitness RPG</p>
        </div>
      )}

      {!compact && (
        <div className="leaderboard-year-tabs">
          {YEAR_GROUPS.map((yr) => (
            <button
              key={yr}
              className={`year-tab ${activeYear === yr ? "active" : ""}`}
              onClick={() => setActiveYear(yr)}
              aria-pressed={activeYear === yr}
            >
              {yr}
            </button>
          ))}
        </div>
      )}

      <div className="leaderboard-sort-bar">
        <span className="sort-label">Sort:</span>
        {SORT_MODES.map((m) => (
          <button
            key={m.key}
            className={`sort-btn ${sortMode === m.key ? "active" : ""}`}
            onClick={() => setSortMode(m.key)}
            aria-pressed={sortMode === m.key}
          >
            {m.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="leaderboard-loading">
          <div className="loading-spinner" />
          <p>Loading champions...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="leaderboard-empty">
          <p>🏋️ No heroes yet — be the first to log a workout!</p>
        </div>
      ) : (
        <ol className="leaderboard-list">
          {profiles.map((p, idx) => (
            <li
              key={p.id}
              className={[
                "leaderboard-row",
                p.id === currentUserId ? "my-row" : "",
                idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : idx === 2 ? "rank-3" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="rank-badge">
                {idx < 3 ? MEDAL[idx] : `#${idx + 1}`}
              </span>
              <span className="player-avatar" aria-hidden="true">
                {AVATAR_ICONS[p.avatar] || AVATAR_ICONS.pirate}
              </span>
              <div className="player-info">
                <span className="player-name">
                  {p.studentName || "Unknown Hero"}
                  {p.id === currentUserId && <span className="you-tag"> (You)</span>}
                </span>
                <span className="player-meta">{p.yearGroup || "—"} · Level {level(p.xp)}</span>
                <div className="mini-xp-bar" aria-label={`${xpInLevel(p.xp)}% to next level`}>
                  <div
                    className="mini-xp-fill"
                    style={{ width: `${xpInLevel(p.xp)}%` }}
                  />
                </div>
              </div>
              <div className="player-stats">
                <span className="stat">⚡ <strong>{p.xp || 0}</strong></span>
                <span className="stat">🏋️ <strong>{p.totalWorkouts || 0}</strong></span>
                {!compact && (
                  <>
                    <span className="stat">🔥 <strong>{Math.round(p.totalCalories || 0)}</strong></span>
                    <span className="stat">💪 <strong>{Math.round(p.totalWeightLifted || 0)}kg</strong></span>
                  </>
                )}
                {(p.badgeCount || 0) > 0 && (
                  <span className="stat">🏅 <strong>{p.badgeCount}</strong></span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Leaderboard;
