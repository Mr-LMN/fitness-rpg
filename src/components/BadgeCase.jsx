import React from "react";
import { GiLaurelsTrophy, GiLightningTrio, GiBookmarklet } from "react-icons/gi";
import "./styles/BadgeCase.css";

const baseUrl = import.meta.env.BASE_URL || "/";

const badgeDefinitions = {
  workoutStarter: {
    icon: <GiBookmarklet />,
    image: `${baseUrl}Badges/FirstWorkout_Badge.png`,
    label: "Workout Starter",
    description: "Logged your first workout!",
  },
  bossVanquisher: {
    icon: <GiLaurelsTrophy />,
    image: `${baseUrl}Badges/BossVanquisher_Badge.png`,
    label: "Boss Vanquisher",
    description: "Defeated the final boss!",
  },
  speedRunner: {
    icon: <GiLightningTrio />,
    image: `${baseUrl}Badges/SpeedRunner_Badge.png`,
    label: "Speed Runner",
    description: "Beat the boss in record time!",
  },
  topTen: {
    icon: <GiLaurelsTrophy />,
    image: `${baseUrl}Badges/TopTen_Badge.png`,
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
                {b?.image ? (
                  <img src={b.image} alt={b.label} className="badge-img" />
                ) : (
                  <span className="icon">{b?.icon}</span>
                )}
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
