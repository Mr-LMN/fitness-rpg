import React from "react";
import { questById } from "../data/questDeck";
import "./styles/QuestTracker.css";

function QuestTracker({ activeQuests = [], completedQuests = [], questProgress = {} }) {
  const activeDetails = activeQuests
    .map((id) => questById[id])
    .filter(Boolean);

  const recentCompletions = (completedQuests || [])
    .slice(-3)
    .map((id) => questById[id])
    .filter(Boolean);

  return (
    <aside className="quest-tracker" aria-label="Quest tracker">
      <div className="quest-header">
        <h3>Quest Board</h3>
        <p className="quest-tagline">
          Curated contracts from the shadow faculty. Track your progress, stay on objective, and
          claim each eerie reward.
        </p>
      </div>
      {activeDetails.length === 0 ? (
        <p className="quest-empty">All current quests complete. Visit the map for new leads.</p>
      ) : (
        <ul className="quest-list">
          {activeDetails.map((quest) => {
            const goal = quest.goal || 1;
            const progress = Math.min(goal, questProgress[quest.id] || 0);
            const percent = Math.round((progress / goal) * 100);
            const reward = quest.reward || {};
            const remaining = Math.max(goal - progress, 0);
            const progressLabel =
              goal > 1 ? `${progress} / ${goal}` : progress >= goal ? "Complete" : "1 Objective";
            const remainingLabel =
              remaining === 1 ? "1 task remaining" : `${remaining} tasks remaining`;
            return (
              <li key={quest.id} className={`quest-card quest-${quest.type}`}>
                <div className="quest-card-header">
                  <div className="quest-card-title">
                    <span className="quest-title">{quest.title}</span>
                    <span className={`quest-type quest-type-${quest.type}`}>
                      {quest.type === "knowledge" ? "Knowledge" : "Fitness"}
                    </span>
                  </div>
                  <span className="quest-progress-value">
                    {progress >= goal ? "Complete" : `${percent}%`}
                  </span>
                </div>
                <p className="quest-description">{quest.description}</p>
                <div className="quest-meta">
                  <div className="quest-goal">
                    <span className="quest-meta-label">Objective</span>
                    <span className="quest-meta-value">{progressLabel}</span>
                    {progress < goal && (
                      <span className="quest-meta-hint">{remainingLabel}</span>
                    )}
                  </div>
                  <div
                    className="quest-progress"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={goal}
                    aria-valuenow={progress}
                  >
                    <div className="quest-progress-track">
                      <div className="quest-progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="quest-progress-label">
                      {progress >= goal ? "Ready to claim" : `${percent}% complete`}
                    </span>
                  </div>
                  <div className="quest-reward">
                    <span className="quest-meta-label">Rewards</span>
                    <ul className="quest-reward-list">
                      <li>⭐ {reward.xp || 0} XP</li>
                      {(reward.badgeLabel || reward.badge) && (
                        <li>🎖️ {reward.badgeLabel || "Cosmetic badge"}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {recentCompletions.length > 0 && (
        <div className="quest-completed">
          <h4>Recent Triumphs</h4>
          <ul>
            {recentCompletions.map((quest) => (
              <li key={quest.id}>{quest.title}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

export default QuestTracker;
