import React, { useEffect, useMemo, useState } from "react";
import exerciseList from "../data/exerciseList";
import cardioExercises from "../data/cardioExercises";
import {
  playSound,
  updateLifetimeSummary,
  logWorkoutMinutes,
  getUserWeight,
} from "../utils";
import { calculateWorkoutMetrics } from "../helpers/workoutMetrics";
import { persistWorkoutLog } from "../helpers/workoutPersistence";
import "./styles/GameMenu.css";

const strengthChoices = exerciseList.filter((ex) => ex.type !== "Cardio");
const cardioChoices = cardioExercises;

function getRandomItems(source, count) {
  const clone = [...source];
  const picked = [];
  while (clone.length > 0 && picked.length < count) {
    const idx = Math.floor(Math.random() * clone.length);
    picked.push(clone.splice(idx, 1)[0]);
  }
  return picked;
}

function generateStrengthPlan(userWeight) {
  const baseWeight = Math.max(6, Math.round((userWeight || 50) * 0.25));
  return getRandomItems(strengthChoices, 3).map((exercise) => {
    const sets = 3 + Math.floor(Math.random() * 2);
    const reps = 8 + Math.floor(Math.random() * 5);
    const addWeight = baseWeight + Math.floor(Math.random() * 10);
    return {
      name: exercise.name,
      sets,
      reps,
      weight: `${addWeight}`,
      numericWeight: addWeight,
      type: exercise.type || "Strength",
      category: exercise.category,
      met: exercise.met,
    };
  });
}

function generateCardioPlan() {
  return getRandomItems(cardioChoices, 1).map((exercise) => {
    const duration = 12 + Math.floor(Math.random() * 9);
    const pace = exercise.met >= 9 ? 0.18 : 0.12;
    const distance = +(duration * pace).toFixed(1);
    return {
      name: exercise.name,
      duration,
      distance,
      type: exercise.type || "Cardio",
      category: exercise.category,
      met: exercise.met,
      numericWeight: 0,
    };
  });
}

function RandomWorkoutModal({
  onClose,
  setGameState,
  userId,
  yearGroup,
  defaultFocus = "strength",
  onQuestEvent = () => {},
}) {
  const userWeight = getUserWeight();
  const [focus, setFocus] = useState(defaultFocus === "cardio" ? "cardio" : "strength");
  const [entries, setEntries] = useState(() =>
    focus === "cardio" ? generateCardioPlan() : generateStrengthPlan(userWeight)
  );

  useEffect(() => {
    setEntries(focus === "cardio" ? generateCardioPlan() : generateStrengthPlan(userWeight));
  }, [focus, userWeight]);

  const metrics = useMemo(
    () => calculateWorkoutMetrics(entries, userWeight, focus),
    [entries, userWeight, focus]
  );

  const handleRegenerate = () => {
    setEntries(focus === "cardio" ? generateCardioPlan() : generateStrengthPlan(userWeight));
  };

  const handleLog = async () => {
    if (!entries.length) return;

    try {
      await persistWorkoutLog({
        userId,
        yearGroup,
        workoutData: {
          totalWeightLifted: metrics.totalWeight,
          distanceTravelled: metrics.distance,
          caloriesBurned: Math.round(metrics.calories),
          exercisesLogged: entries.length,
          workoutDetails: entries,
          minutesLogged: metrics.minutes,
          source: "randomMenu",
        },
      });
    } catch (error) {
      // error already logged
    }

    updateLifetimeSummary({
      weightLifted: metrics.totalWeight,
      distance: metrics.distance,
      calories: metrics.calories,
    });
    logWorkoutMinutes(metrics.minutes);

    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
      annotations: [
        ...(prev.annotations || []),
        {
          room: "Free Log",
          activity: `Random ${focus} workout`,
          details: entries,
          timestamp: new Date().toISOString(),
        },
      ],
    }));

    playSound();
    onQuestEvent("workoutLogged", { room: "Free Log", focus });
    onClose();
  };

  return (
    <div className="menu-modal-overlay">
      <div className="menu-modal">
        <div className="menu-modal-header">
          <h3>Random Workout Generator</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close random workout">
            ×
          </button>
        </div>
        <div className="focus-selector">
          <label htmlFor="random-focus-select">Workout Focus</label>
          <select
            id="random-focus-select"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>
        <div className="random-workout-details">
          <p className="random-summary">
            {focus === "cardio"
              ? "Cardio sessions include a suggested duration and distance."
              : "Strength sessions feature three lifts with suggested sets, reps, and load."}
          </p>
          <ul className="random-workout-list">
            {entries.map((entry, index) => (
              <li key={`${entry.name}-${index}`}>
                <span className="random-name">{entry.name}</span>
                <span className="random-meta">
                  {focus === "cardio"
                    ? `${entry.duration} min · ${entry.distance} km`
                    : `${entry.sets} × ${entry.reps} @ ${entry.weight}kg`}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="random-metrics">
          <div>
            <span className="metric-label">Total Weight</span>
            <span>{metrics.totalWeight.toFixed(1)} kg</span>
          </div>
          <div>
            <span className="metric-label">Distance</span>
            <span>{metrics.distance.toFixed(1)} km</span>
          </div>
          <div>
            <span className="metric-label">Calories</span>
            <span>{metrics.calories.toFixed(1)} kcal</span>
          </div>
        </div>
        <div className="random-actions">
          <button className="menu-action secondary" onClick={handleRegenerate}>
            Roll Again
          </button>
          <button className="menu-action" onClick={handleLog}>
            Log This Workout
          </button>
        </div>
      </div>
    </div>
  );
}

export default RandomWorkoutModal;
