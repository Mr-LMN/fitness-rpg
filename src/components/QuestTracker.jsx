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
        <h3>🎲 Quest Board</h3>
        <p className="quest-tagline">
          Draft encounters like a tabletop campaign. Rally your crew, conquer fitness trials,
          and earn cosmetic glory.
        </p>
      </div>
      {activeDetails.length === 0 ? (
        <p className="quest-empty">All current quests complete! Visit the map for new leads.</p>
      ) : (
        <ul className="quest-list">
          {activeDetails.map((quest) => {
            const goal = quest.goal || 1;
            const progress = Math.min(goal, questProgress[quest.id] || 0);
            const percent = Math.round((progress / goal) * 100);
            const reward = quest.reward || {};
            return (
              <li key={quest.id} className={`quest-card quest-${quest.type}`}>
                <div className="quest-card-header">
                  <span className="quest-title">{quest.title}</span>
                  <span className="quest-type">{quest.type === "knowledge" ? "Knowledge" : "Fitness"}</span>
                </div>
                <p className="quest-description">{quest.description}</p>
                <div className="quest-progress" role="progressbar" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={progress}>
                  <div className="quest-progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <div className="quest-reward">
                  Reward: {reward.xp || 0} XP
                  {reward.badgeLabel ? ` · ${reward.badgeLabel}` : reward.badge ? " · Cosmetic badge" : ""}
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
