import React, { useState, useRef, useEffect } from "react";
import questDeck, { questById } from "../data/questDeck";
import "./styles/QuestTracker.css";

// Workout grind chain IDs in order for the roadmap
const GRIND_CHAIN = [
  "quest_workout_1",
  "quest_workout_3",
  "quest_workout_5",
  "quest_workout_10",
  "quest_workout_15",
  "quest_workout_25",
];

function QuestTracker({ activeQuests = [], completedQuests = [], questProgress = {} }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const completedSet = new Set(completedQuests);
  const activeSet = new Set(activeQuests);

  // Current active quest (first one)
  const activeDetails = activeQuests
    .map((id) => questById[id])
    .filter(Boolean);
  const currentQuest = activeDetails[0];
  const currentStats = currentQuest
    ? getQuestStats(currentQuest, questProgress[currentQuest.id] || 0)
    : null;

  // Side quests (non-grind-chain active quests)
  const sideQuests = activeDetails.filter((q) => !GRIND_CHAIN.includes(q.id));

  // Total stats
  const totalCompleted = completedQuests.length;
  const totalQuests = questDeck.length;

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div className="quest-toggle-wrap" ref={panelRef}>
      {/* ── Compact toggle button ── */}
      <button
        className={`quest-toggle-btn ${open ? "quest-toggle-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Toggle quest tracker"
      >
        <span className="quest-toggle-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l2.35 4.76 5.25.76-3.8 3.7.9 5.24L8 13.27l-4.7 2.19.9-5.24-3.8-3.7 5.25-.76L8 1z" fill="currentColor" />
          </svg>
        </span>
        {currentQuest ? (
          <>
            <span className="quest-toggle-title">{currentQuest.title}</span>
            <span className="quest-toggle-pct">{currentStats?.percent ?? 0}%</span>
            <span className="quest-toggle-ring">
              <svg viewBox="0 0 36 36" className="quest-ring-svg">
                <circle
                  cx="18" cy="18" r="15.5"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                <circle
                  cx="18" cy="18" r="15.5"
                  fill="none"
                  stroke="url(#questGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(currentStats?.percent ?? 0) * 0.974} 97.4`}
                  transform="rotate(-90 18 18)"
                  className="quest-ring-progress"
                />
                <defs>
                  <linearGradient id="questGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#935cff" />
                    <stop offset="100%" stopColor="#42e9bb" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </>
        ) : (
          <span className="quest-toggle-title quest-toggle-done">All quests cleared</span>
        )}
      </button>

      {/* ── Expanded panel ── */}
      {open && (
        <aside className="quest-panel" aria-label="Quest tracker">
          <div className="quest-panel-inner">
            {/* Header */}
            <div className="quest-panel-header">
              <div className="quest-panel-heading">
                <h3>Quest Log</h3>
                <span className="quest-panel-count">
                  {totalCompleted}/{totalQuests}
                </span>
              </div>
              <button
                className="quest-panel-close"
                onClick={() => setOpen(false)}
                aria-label="Close quest panel"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Current Quest */}
            {currentQuest && (
              <div className="quest-active-card">
                <div className="quest-active-label">Active Contract</div>
                <div className="quest-active-row">
                  <div className="quest-active-info">
                    <span className="quest-active-name">{currentQuest.title}</span>
                    <span className={`quest-badge quest-badge-${currentQuest.type}`}>
                      {currentQuest.type === "knowledge" ? "Knowledge" : "Fitness"}
                    </span>
                  </div>
                  <span className="quest-active-pct">
                    {currentStats.percent >= 100 ? "Ready!" : `${currentStats.percent}%`}
                  </span>
                </div>
                <p className="quest-active-desc">{currentQuest.description}</p>
                <div className="quest-active-progress">
                  <div className="quest-progress-track">
                    <div
                      className="quest-progress-fill"
                      style={{ width: `${currentStats.percent}%` }}
                    />
                    <div className="quest-progress-shimmer" />
                  </div>
                  <div className="quest-active-meta">
                    <span>{currentStats.progressLabel}</span>
                    <span className="quest-reward-inline">+{currentStats.reward.xp || 0} XP</span>
                  </div>
                </div>
              </div>
            )}

            {/* Grind Roadmap */}
            <div className="quest-roadmap">
              <div className="quest-roadmap-label">Workout Grind</div>
              <div className="quest-roadmap-track">
                {GRIND_CHAIN.map((id, i) => {
                  const quest = questById[id];
                  if (!quest) return null;
                  const done = completedSet.has(id);
                  const active = activeSet.has(id);
                  const progress = active ? questProgress[id] || 0 : 0;
                  const pct = done
                    ? 100
                    : active
                    ? Math.round((progress / (quest.goal || 1)) * 100)
                    : 0;
                  return (
                    <div
                      key={id}
                      className={`quest-node ${done ? "quest-node-done" : ""} ${active ? "quest-node-active" : ""}`}
                      title={`${quest.title} — ${done ? "Complete" : active ? `${pct}%` : "Locked"}`}
                    >
                      <div className="quest-node-pip">
                        {done ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <span className="quest-node-goal">{quest.goal}</span>
                        )}
                      </div>
                      {i < GRIND_CHAIN.length - 1 && (
                        <div className={`quest-node-line ${done ? "quest-node-line-done" : ""}`} />
                      )}
                      <span className="quest-node-label">{quest.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side Quests */}
            {sideQuests.length > 0 && (
              <div className="quest-side">
                <div className="quest-side-label">Side Contracts</div>
                {sideQuests.map((quest) => {
                  const stats = getQuestStats(quest, questProgress[quest.id] || 0);
                  return (
                    <div key={quest.id} className="quest-side-item">
                      <div className="quest-side-row">
                        <span className="quest-side-name">{quest.title}</span>
                        <span className="quest-side-pct">{stats.percent}%</span>
                      </div>
                      <div className="quest-progress-track quest-progress-sm">
                        <div className="quest-progress-fill" style={{ width: `${stats.percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recent Completions */}
            {completedQuests.length > 0 && (
              <div className="quest-history">
                <div className="quest-history-label">Completed</div>
                <div className="quest-history-list">
                  {completedQuests
                    .slice(-4)
                    .reverse()
                    .map((id) => questById[id])
                    .filter(Boolean)
                    .map((quest) => (
                      <div key={quest.id} className="quest-history-item">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="quest-check-icon">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{quest.title}</span>
                        <span className="quest-history-xp">+{quest.reward?.xp || 0} XP</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

function getQuestStats(quest, progress = 0) {
  const goal = quest.goal || 1;
  const safeProgress = Math.min(goal, progress);
  const percent = Math.round((safeProgress / goal) * 100);
  const reward = quest.reward || {};
  const remaining = Math.max(goal - safeProgress, 0);
  const progressLabel =
    goal > 1 ? `${safeProgress} / ${goal}` : safeProgress >= goal ? "Complete" : "1 Objective";
  const remainingLabel = remaining === 1 ? "1 task remaining" : `${remaining} tasks remaining`;

  return { goal, safeProgress, percent, reward, remaining, progressLabel, remainingLabel };
}

export default QuestTracker;
