import React from "react";
import { GiLaurelsTrophy, GiLightningTrio, GiBookmarklet } from "react-icons/gi";
import { FaMedal, FaFeatherAlt, FaChessKnight } from "react-icons/fa";
import "./styles/BadgeCase.css";

const baseUrl = import.meta.env.BASE_URL || "/";

export const badgeDefinitions = {
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
  lockerEscapee: {
    icon: <GiBookmarklet />,
    image: `${baseUrl}Badges/LockerRoomEscape_Badge.png`,
    label: "Locker Escapee",
    description: "Escaped the locker room!",
  },
  quizMaster: {
    icon: <GiBookmarklet />,
    image: `${baseUrl}Badges/QuizMaster.png`,
    label: "Quiz Master",
    description: "Answered every quiz question correctly!",
  },
  warmupChampion: {
    icon: <FaChessKnight />,
    label: "Warm-Up Vanguard",
    description: "Completed the Spark Gauntlet tabletop quest.",
  },
  strengthCaptain: {
    icon: <FaMedal />,
    label: "Squad Captain Pennant",
    description: "Logged a strength workout for your crew.",
  },
  ks3Polyglot: {
    icon: <FaFeatherAlt />,
    label: "KS3 Polyglot Pin",
    description: "Aced the KS3 knowledge challenge in Mrs. Roche's room.",
  },
  arenaChampion: {
    icon: <GiLaurelsTrophy />,
    label: "Championship Pennant",
    description: "Triumphed in the Arena Finale tabletop encounter.",
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
