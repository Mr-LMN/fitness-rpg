import React from "react";
import { GiLaurelsTrophy, GiLightningTrio, GiBookmarklet } from "react-icons/gi";
import "./styles/BadgeCase.css";

const badgeDefinitions = {
  workoutStarter: {
    icon: <GiBookmarklet />,
    label: "Workout Starter",
    description: "Logged your first workout!",
  },
  bossVanquisher: {
    icon: <GiLaurelsTrophy />,
    label: "Boss Vanquisher",
    description: "Defeated the final boss!",
  },
  speedRunner: {
    icon: <GiLightningTrio />,
    label: "Speed Runner",
    description: "Beat the boss in record time!",
  },
  topTen: {
    icon: <GiLaurelsTrophy />,
    label: "Top 10",
    description: "Reached the leaderboard Top 10!",
  },
};

function BadgeCase({ badges = [], onClose }) {
  return (
    <div className="badge-overlay">
      <div className="badge-case">
        <h2>🏆 Badge Case</h2>
        {badges.length === 0 && <p>No badges earned yet.</p>}
        <ul>
          {badges.map((id) => {
            const b = badgeDefinitions[id];
            return (
              <li key={id} className="badge-item">
                <span className="icon">{b?.icon}</span>
                <span className="label">{b?.label}</span>
                <span className="desc">{b?.description}</span>
              </li>
            );
          })}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default BadgeCase;
