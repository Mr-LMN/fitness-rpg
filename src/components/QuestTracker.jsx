import React, { useState, useRef, useEffect } from "react";
import { ScrollText, X, CheckCircle, Lock, Star } from "lucide-react";
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
    <>
      {/* Trigger button */}
      <button
        className="quest-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Toggle quest tracker"
      >
        <ScrollText size={20} />
      </button>

      {/* Backdrop */}
      {open && (
        <div className="quest-backdrop" onClick={() => setOpen(false)} />
      )}

      {/* Slide-in panel from left */}
      <aside
        ref={panelRef}
        className={`quest-panel ${open ? "quest-panel-open" : ""}`}
        aria-label="Quest tracker"
      >
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
              <X size={14} />
            </button>
          </div>

          {/* Current Quest */}
          {currentQuest && (
            <div className="quest-active-card">
              <div className="quest-active-label">Active Contract</div>
              <h4 className="quest-active-name">{currentQuest.title}</h4>
              <p className="quest-active-desc">{currentQuest.description}</p>
              <div className="quest-active-progress">
                <div className="quest-progress-track">
                  <div
                    className="quest-progress-fill"
                    style={{ width: `${currentStats.percent}%` }}
                  />
                </div>
                <div className="quest-active-meta">
                  <span>{currentStats.progressLabel}</span>
                  <span className="quest-reward-inline">+{currentStats.reward.xp || 0} XP</span>
                </div>
              </div>
            </div>
          )}

          {/* Grind Roadmap — vertical timeline */}
          <div className="quest-timeline">
            <div className="quest-timeline-label">Workout Grind</div>
            <div className="quest-timeline-track">
              {GRIND_CHAIN.map((id) => {
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
                    className={`quest-tl-item ${done ? "quest-tl-done" : ""} ${active ? "quest-tl-active" : ""}`}
                  >
                    <div className="quest-tl-pip">
                      {done ? (
                        <CheckCircle size={14} />
                      ) : active ? (
                        <Star size={12} />
                      ) : (
                        <Lock size={10} />
                      )}
                    </div>
                    <div className="quest-tl-info">
                      <span className="quest-tl-title">{quest.title}</span>
                      {active && <span className="quest-tl-pct">{pct}%</span>}
                    </div>
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
                      <CheckCircle size={12} className="quest-check-icon" />
                      <span>{quest.title}</span>
                      <span className="quest-history-xp">+{quest.reward?.xp || 0} XP</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
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
