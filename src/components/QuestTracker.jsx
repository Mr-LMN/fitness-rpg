import React from "react";
import { questById } from "../data/questDeck";
import "./styles/QuestTracker.css";

function QuestTracker({ activeQuests = [], completedQuests = [], questProgress = {} }) {
  const activeDetails = activeQuests
    .map((id) => questById[id])
    .filter(Boolean);

  const currentQuest = activeDetails[0];

  const upcomingCount = Math.max(activeDetails.length - 1, 0);

  const recentCompletions = (completedQuests || [])
    .slice(-3)
    .map((id) => questById[id])
    .filter(Boolean);

  const currentStats = currentQuest
    ? getQuestStats(currentQuest, questProgress[currentQuest.id] || 0)
    : null;

  return (
    <aside className="quest-tracker" aria-label="Quest tracker">
      <div className="quest-header">
        <h3>Quest Focus</h3>
        <p className="quest-tagline">
          Stay on the active contract. New objectives will appear once this task is complete.
        </p>
      </div>
      {!currentQuest ? (
        <p className="quest-empty">All current quests complete. Visit the map for new leads.</p>
      ) : (
        <div className={`quest-card quest-${currentQuest.type}`} key={currentQuest.id}>
          <div className="quest-card-header">
            <div className="quest-card-title">
              <span className="quest-title">{currentQuest.title}</span>
              <span className={`quest-type quest-type-${currentQuest.type}`}>
                {currentQuest.type === "knowledge" ? "Knowledge" : "Fitness"}
              </span>
            </div>
            <span className="quest-progress-value">
              {currentStats?.safeProgress >= (currentStats?.goal || 1)
                ? "Complete"
                : `${currentStats?.percent ?? 0}%`}
            </span>
          </div>
          <QuestDetails quest={currentQuest} stats={currentStats} />
        </div>
      )}
      {upcomingCount > 0 && (
        <p className="quest-queue-hint">
          {upcomingCount === 1
            ? "1 hidden contract will reveal after this objective."
            : `${upcomingCount} hidden contracts will unlock once this objective is cleared.`}
        </p>
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

function QuestDetails({ quest, stats }) {
  const { goal, safeProgress, percent, reward, progressLabel, remainingLabel } =
    stats || getQuestStats(quest, 0);
  return (
    <div className="quest-body">
      <div className="quest-overview">
        <p className="quest-description">{quest.description}</p>
      </div>
      <div className="quest-meta">
        <div className="quest-goal">
          <span className="quest-meta-label">Objective</span>
          <span className="quest-meta-value">{progressLabel}</span>
          {safeProgress < goal && <span className="quest-meta-hint">{remainingLabel}</span>}
        </div>
        <div
          className="quest-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-valuenow={safeProgress}
        >
          <div className="quest-progress-track">
            <div className="quest-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="quest-progress-label">
            {safeProgress >= goal ? "Ready to claim" : `${percent}% complete`}
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
