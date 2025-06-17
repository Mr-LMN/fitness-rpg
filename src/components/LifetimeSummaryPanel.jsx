import React, { useEffect, useState } from "react";
import {
  IoBarbell,
  IoWalk,
  IoFlame,
  IoTrophy,
  IoShirt,
  IoCheckmarkCircle,
  IoBody,
} from "react-icons/io5";
import "./styles/LifetimeSummary.css";

import { fetchWorkoutSummary } from "../helpers/fetchWorkoutSummary";

function LifetimeSummaryPanel({ userId, username }) {
  const [summary, setSummary] = useState({
    totalWorkouts: 0,
    totalWeight: 0,
    totalDistance: 0,
    totalCalories: 0,
    bossesDefeated: 0,
    cosmetics: 0,
    weight: null,
  });

  useEffect(() => {
    const loadSummary = async () => {
      const liveSummary = await fetchWorkoutSummary(userId);
      if (liveSummary) {
        setSummary((prev) => ({ ...prev, ...liveSummary }));
        localStorage.setItem("lifetimeSummary", JSON.stringify(liveSummary));
      } else {
        const cached = localStorage.getItem("lifetimeSummary");
        if (cached) setSummary(JSON.parse(cached));
      }
    };

    loadSummary();
  }, [userId]);

  const {
    totalWorkouts,
    totalWeight,
    totalDistance,
    totalCalories,
    bossesDefeated,
    cosmetics,
    weight,
  } = summary;

  return (
    <div className="lifetime-panel">
      <h2 className="lifetime-header">Welcome back{username ? `, ${username}!` : "!"}</h2>
      <p className="lifetime-subheader">Your progress so far:</p>
      <ul className="lifetime-stats">
        <li>
          <IoCheckmarkCircle /> <span>Workouts Completed:</span>{" "}
          <strong>{totalWorkouts}</strong>
        </li>
        <li>
          <IoBarbell /> <span>Total Weight Lifted:</span>{" "}
          <strong>{totalWeight.toFixed ? totalWeight.toFixed(1) : totalWeight}</strong>
        </li>
        <li>
          <IoWalk /> <span>Distance Travelled:</span>{" "}
          <strong>{totalDistance.toFixed ? totalDistance.toFixed(1) : totalDistance}</strong>
        </li>
        <li>
          <IoFlame /> <span>Total Calories Burned:</span>{" "}
          <strong>{totalCalories}</strong>
        </li>
        <li>
          <IoBody /> <span>Current Weight:</span> <strong>{weight || "-"}</strong>
        </li>
        <li>
          <IoTrophy /> <span>Bosses Defeated:</span> <strong>{bossesDefeated}</strong>
        </li>
        <li>
          <IoShirt /> <span>Cosmetics Unlocked:</span> <strong>{cosmetics}</strong>
        </li>
      </ul>
    </div>
  );
}

export default LifetimeSummaryPanel;
