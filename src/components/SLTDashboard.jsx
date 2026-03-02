import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import Leaderboard from "./Leaderboard";
import "./styles/SLTDashboard.css";

const YEAR_GROUPS = ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11"];

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className={`slt-stat-card ${highlight ? "highlight" : ""}`}>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
        {sub && <span className="stat-card-sub">{sub}</span>}
      </div>
    </div>
  );
}

function SLTDashboard({ onBack }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeYear, setActiveYear] = useState("Year 7");

  useEffect(() => {
    const q = query(
      collection(db, "userProfiles"),
      orderBy("lastActive", "desc"),
      limit(200)
    );
    const unsub = onSnapshot(q, (snap) => {
      setProfiles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  // --- Aggregate stats ---
  const totalStudents = profiles.length;
  const totalWorkouts = profiles.reduce((s, p) => s + (p.totalWorkouts || 0), 0);
  const totalCalories = profiles.reduce((s, p) => s + (p.totalCalories || 0), 0);
  const totalMinutes = profiles.reduce((s, p) => s + (p.totalMinutes || 0), 0);
  const totalXP = profiles.reduce((s, p) => s + (p.xp || 0), 0);
  const avgLevel = profiles.length
    ? Math.floor(profiles.reduce((s, p) => s + Math.floor((p.xp || 0) / 100), 0) / profiles.length)
    : 0;

  // Per year group breakdown
  const byYear = YEAR_GROUPS.map((yr) => {
    const grp = profiles.filter((p) => p.yearGroup === yr);
    return {
      year: yr,
      count: grp.length,
      workouts: grp.reduce((s, p) => s + (p.totalWorkouts || 0), 0),
      calories: grp.reduce((s, p) => s + (p.totalCalories || 0), 0),
      topStudent: grp.sort((a, b) => (b.xp || 0) - (a.xp || 0))[0],
    };
  });

  // Recent activity — last 10 active
  const recentActive = [...profiles]
    .filter((p) => p.lastActive)
    .sort((a, b) => {
      const aT = a.lastActive?.seconds || 0;
      const bT = b.lastActive?.seconds || 0;
      return bT - aT;
    })
    .slice(0, 10);

  const formatMins = (mins) => {
    if (!mins) return "0m";
    if (mins < 60) return `${Math.round(mins)}m`;
    return `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`;
  };

  const formatDate = (ts) => {
    if (!ts?.seconds) return "—";
    return new Date(ts.seconds * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="slt-dashboard">
      {/* Header */}
      <div className="slt-header">
        <div className="slt-header-left">
          <h1 className="slt-title">SLT Dashboard</h1>
          <p className="slt-subtitle">Pencoedtre High School — Fitness RPG</p>
        </div>
        <button className="slt-back-btn" onClick={onBack}>
          ← Back to Game
        </button>
      </div>

      {/* Tab navigation */}
      <div className="slt-tabs">
        {[
          { id: "overview", label: "Overview" },
          { id: "leaderboard", label: "Leaderboard" },
          { id: "year-groups", label: "Year Groups" },
          { id: "recent", label: "Recent Activity" },
        ].map((t) => (
          <button
            key={t.id}
            className={`slt-tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
            aria-pressed={activeTab === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="slt-loading">
          <div className="loading-spinner" />
          <p>Loading school data...</p>
        </div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="slt-section">
              <div className="slt-stats-grid">
                <StatCard
                  label="Active Students"
                  value={totalStudents}
                  sub="have registered"
                  highlight
                />
                <StatCard
                  label="Total Workouts"
                  value={totalWorkouts}
                  sub="logged across all students"
                />
                <StatCard
                  label="Calories Burned"
                  value={`${Math.round(totalCalories).toLocaleString()} kcal`}
                  sub="combined effort"
                />
                <StatCard
                  label="Total Active Time"
                  value={formatMins(totalMinutes)}
                  sub="school-wide"
                />
                <StatCard
                  label="Total XP Earned"
                  value={totalXP.toLocaleString()}
                  sub="across all heroes"
                  highlight
                />
                <StatCard
                  label="Average Level"
                  value={`Level ${avgLevel}`}
                  sub="school average"
                />
              </div>

              <h3 className="slt-section-title">Year Group Breakdown</h3>
              <div className="year-breakdown-grid">
                {byYear.map((yr) => (
                  <div key={yr.year} className="year-card">
                    <h4 className="year-card-title">{yr.year}</h4>
                    <div className="year-card-stats">
                      <div className="yc-stat">
                        <span className="yc-val">{yr.count}</span>
                        <span className="yc-lbl">Students</span>
                      </div>
                      <div className="yc-stat">
                        <span className="yc-val">{yr.workouts}</span>
                        <span className="yc-lbl">Workouts</span>
                      </div>
                      <div className="yc-stat">
                        <span className="yc-val">{Math.round(yr.calories).toLocaleString()}</span>
                        <span className="yc-lbl">kcal</span>
                      </div>
                    </div>
                    {yr.topStudent && (
                      <p className="year-top-student">
                        Top: {yr.topStudent.studentName || "Unknown"}
                        {" "}(Level {Math.floor((yr.topStudent.xp || 0) / 100)})
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === "leaderboard" && (
            <div className="slt-section">
              <Leaderboard showTitle={false} compact={false} />
            </div>
          )}

          {/* YEAR GROUPS TAB */}
          {activeTab === "year-groups" && (
            <div className="slt-section">
              <div className="year-group-tabs">
                {YEAR_GROUPS.map((yr) => (
                  <button
                    key={yr}
                    className={`year-tab ${activeYear === yr ? "active" : ""}`}
                    onClick={() => setActiveYear(yr)}
                  >
                    {yr}
                  </button>
                ))}
              </div>
              <div className="year-student-list">
                <table className="slt-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Level</th>
                      <th>XP</th>
                      <th>Workouts</th>
                      <th>Calories</th>
                      <th>Weight Lifted</th>
                      <th>Active Time</th>
                      <th>Badges</th>
                      <th>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles
                      .filter((p) => p.yearGroup === activeYear)
                      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
                      .map((p, i) => (
                        <tr key={p.id}>
                          <td>{i + 1}</td>
                          <td className="student-name-cell">{p.studentName || "Unknown"}</td>
                          <td>Lvl {Math.floor((p.xp || 0) / 100)}</td>
                          <td>{p.xp || 0}</td>
                          <td>{p.totalWorkouts || 0}</td>
                          <td>{Math.round(p.totalCalories || 0)} kcal</td>
                          <td>{Math.round(p.totalWeightLifted || 0)} kg</td>
                          <td>{formatMins(p.totalMinutes)}</td>
                          <td>{p.badgeCount || 0}</td>
                          <td>{formatDate(p.lastActive)}</td>
                        </tr>
                      ))}
                    {profiles.filter((p) => p.yearGroup === activeYear).length === 0 && (
                      <tr>
                        <td colSpan={10} style={{ textAlign: "center", color: "#9ca3af" }}>
                          No students in {activeYear} yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RECENT ACTIVITY TAB */}
          {activeTab === "recent" && (
            <div className="slt-section">
              <h3 className="slt-section-title">Recently Active Students</h3>
              <div className="recent-list">
                {recentActive.map((p) => (
                  <div key={p.id} className="recent-card">
                    <div className="recent-card-left">
                      <span className="recent-name">{p.studentName || "Unknown"}</span>
                      <span className="recent-meta">{p.yearGroup || "—"} · Level {Math.floor((p.xp || 0) / 100)}</span>
                    </div>
                    <div className="recent-card-right">
                      <span className="recent-stat">{p.totalWorkouts || 0} workouts</span>
                      <span className="recent-stat">{Math.round(p.totalCalories || 0)} kcal</span>
                      <span className="recent-date">{formatDate(p.lastActive)}</span>
                    </div>
                  </div>
                ))}
                {recentActive.length === 0 && (
                  <p style={{ color: "#9ca3af", textAlign: "center" }}>No recent activity found.</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SLTDashboard;
