import React, { useState } from "react";
import {
  playSound,
  updateLifetimeSummary,
  logWorkoutMinutes,
  getUserWeight,
  parseWeightInput,
  formatWeightDisplay,
} from "../utils";
import SessionSummaryModal from "./SessionSummaryModal";
import exerciseList from "../data/exerciseList";
import cardioExercises from "../data/cardioExercises";
import {
  calculateWorkoutMetrics,
  getExerciseMeta,
} from "../helpers/workoutMetrics";
import { persistWorkoutLog } from "../helpers/workoutPersistence";
import { updateUserProfile } from "../helpers/userProfile";
import BenchmarkAmrapTracker from "./BenchmarkAmrapTracker";
import "./styles/WorkoutLogger.css";

const ALLOWED_CATEGORIES = ["Core", "Legs", "Chest", "Back", "Arms", "Functional"];

const EMPTY_CARDIO_INPUT = { name: "", duration: "", distance: "" };
const EMPTY_STRENGTH_INPUT = { name: "", sets: "", reps: "", weight: "" };

function WorkoutLogger({
  roomNumber,
  gameState = { inventory: [] },
  setGameState,
  workoutFocus,
  userId,
  yearGroup,
  studentName,
  avatar,
  onComplete,
  onWorkoutLogged,
  title,
  completeLabel = "Continue",
  specialWorkout = null,
}) {
  const cardioMode = workoutFocus === "cardio";
  const isBenchmarkAmrap = specialWorkout?.variant === "benchmark-amrap";

  const filteredExerciseList = exerciseList.filter((ex) =>
    ALLOWED_CATEGORIES.includes(ex.category)
  );

  const [exerciseInput, setExerciseInput] = useState(
    cardioMode ? EMPTY_CARDIO_INPUT : EMPTY_STRENGTH_INPUT
  );
  const [workoutLog, setWorkoutLog] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryVariant, setSummaryVariant] = useState("standard");
  const [formError, setFormError] = useState("");
  const [boostToast, setBoostToast] = useState("");

  const userWeight = getUserWeight();
  const heading =
    specialWorkout?.title ||
    title ||
    (roomNumber ? `Log Your Workout (${roomNumber})` : "Log Your Workout");
  const roomLabel = roomNumber || specialWorkout?.title || "Free Log";

  // Shared: award XP (with optional boost), append annotation, notify quest system, play sound
  const finaliseWorkout = ({ focus, metrics, entries, logEntry, usedBoostItem = null }) => {
    setGameState((prev) => {
      const baseXP = 10;
      const xpMultiplier = 1 + (usedBoostItem?.effect?.xpBoost || 0);
      const xpGain = Math.round(baseXP * xpMultiplier);

      let inventory = prev.inventory || [];
      if (usedBoostItem) {
        // Remove the first instance of the used item from inventory
        const idx = inventory.findIndex((it) => it.id === usedBoostItem.id);
        if (idx !== -1) {
          inventory = [...inventory.slice(0, idx), ...inventory.slice(idx + 1)];
        }
      }

      return {
        ...prev,
        xp: (prev.xp || 0) + xpGain,
        inventory,
        annotations: [
          ...(prev.annotations || []),
          { room: roomLabel, ...logEntry, timestamp: new Date().toISOString() },
        ],
      };
    });
    playSound("xpLevel", { volume: 0.5 });

    if (typeof onWorkoutLogged === "function") {
      onWorkoutLogged({ focus, metrics, entries, room: roomLabel });
    }
  };

  // --- AMRAP path ---

  const handleAmrapSubmit = async ({ roundsCompleted, roundsState }) => {
    if (!roundsCompleted) {
      setFormError("Tick off at least one round before finishing.");
      return;
    }
    setFormError("");

    const summary = {
      roundsCompleted,
      timeCap: specialWorkout?.timeCapMinutes
        ? `${specialWorkout.timeCapMinutes}-minute cap`
        : null,
      notes: specialWorkout?.notes || specialWorkout?.subtitle || null,
      movements: specialWorkout?.movements || [],
    };
    setSummaryVariant("amrap");
    setSummaryData(summary);
    setShowSummary(true);

    const amrapWorkoutData = {
      type: "benchmarkAmrap",
      roundsCompleted,
      roundHistory: roundsState,
      timeCapMinutes: specialWorkout?.timeCapMinutes || null,
      workoutTitle: heading,
      movements: specialWorkout?.movements || [],
      studentName: studentName || null,
    };

    try {
      await persistWorkoutLog({
        userId,
        yearGroup,
        workoutData: amrapWorkoutData,
      });
      // Sync profile — increment workout count and XP
      await updateUserProfile({
        userId,
        studentName,
        yearGroup,
        avatar,
        xpGain: 10,
        workoutData: { minutesLogged: specialWorkout?.timeCapMinutes || 0 },
      });
    } catch {
      // Error already logged in helper
    }

    updateLifetimeSummary({ weightLifted: 0, distance: 0, calories: 0 });
    logWorkoutMinutes(specialWorkout?.timeCapMinutes || 0);

    finaliseWorkout({
      focus: specialWorkout?.variant || workoutFocus,
      metrics: { roundsCompleted },
      entries: roundsState,
      logEntry: {
        activity: heading,
        details: { type: "benchmarkAmrap", roundsCompleted, roundHistory: roundsState },
      },
    });
  };

  // --- Standard path ---

  const handleAddExercise = () => {
    const { name } = exerciseInput;
    const meta = getExerciseMeta(name) || {};

    if (cardioMode) {
      const { duration, distance } = exerciseInput;
      if (!name || !duration || !distance) return;

      setWorkoutLog((prev) => [
        ...prev,
        {
          name,
          duration: Number(duration),
          distance: Number(distance),
          type: meta.type || "Cardio",
          category: meta.category || "Cardio",
          met: meta.met ?? 8,
          numericWeight: 0,
        },
      ]);
      setExerciseInput(EMPTY_CARDIO_INPUT);
      playSound("correct", { volume: 0.4 });
    } else {
      const { sets, reps, weight } = exerciseInput;
      if (!name || !sets || !reps || !weight) return;

      setWorkoutLog((prev) => [
        ...prev,
        {
          name,
          sets: Number(sets),
          reps: Number(reps),
          weight: formatWeightDisplay(weight),
          numericWeight: parseWeightInput(weight, userWeight),
          type: meta.type || "Strength",
          category: meta.category || "Strength",
          met: meta.met,
        },
      ]);
      setExerciseInput(EMPTY_STRENGTH_INPUT);
      playSound("correct", { volume: 0.4 });
    }
    setFormError("");
  };

  const handleFinishWorkout = async () => {
    if (workoutLog.length === 0) {
      setFormError("Add at least one exercise before finishing.");
      return;
    }

    // Check inventory for consumable boosts to apply this session
    const inventory = gameState.inventory || [];
    const xpItem = inventory.find((it) => it.effect?.xpBoost);
    const weightItem = inventory.find((it) => it.effect?.weightBoost);
    const distanceItem = inventory.find((it) => it.effect?.distanceBoost);
    // Priority: XP boost > weight boost > distance boost
    const activeBoost = xpItem || weightItem || distanceItem;

    const rawMetrics = calculateWorkoutMetrics(workoutLog, userWeight, workoutFocus);

    // Apply weight/distance boosts to metrics if present
    const metrics = {
      ...rawMetrics,
      totalWeight: weightItem
        ? rawMetrics.totalWeight * (1 + weightItem.effect.weightBoost)
        : rawMetrics.totalWeight,
      distance: distanceItem
        ? rawMetrics.distance * (1 + distanceItem.effect.distanceBoost)
        : rawMetrics.distance,
    };

    if (activeBoost) {
      setBoostToast(`✨ ${activeBoost.name} used — boost applied this session!`);
      setTimeout(() => setBoostToast(""), 4000);
    }

    setSummaryVariant("standard");
    setSummaryData({
      totalWeight: `${metrics.totalWeight.toFixed(1)} kg`,
      distance: `${metrics.distance.toFixed(1)} km`,
      calories: `${metrics.calories.toFixed(1)} kcal`,
      exerciseCount: workoutLog.length,
    });
    setShowSummary(true);

    const stdWorkoutData = {
      totalWeightLifted: metrics.totalWeight,
      distanceTravelled: metrics.distance,
      caloriesBurned: Math.round(metrics.calories),
      exercisesLogged: workoutLog.length,
      workoutDetails: workoutLog,
      minutesLogged: metrics.minutes,
      studentName: studentName || null,
    };

    try {
      await persistWorkoutLog({
        userId,
        yearGroup,
        workoutData: stdWorkoutData,
      });
      // Sync aggregated profile data and XP to Firestore
      await updateUserProfile({
        userId,
        studentName,
        yearGroup,
        avatar,
        xpGain: 10,
        workoutData: {
          caloriesBurned: Math.round(metrics.calories),
          totalWeightLifted: metrics.totalWeight,
          minutesLogged: metrics.minutes,
        },
      });
    } catch {
      // Error already logged in helper
    }

    updateLifetimeSummary({
      weightLifted: metrics.totalWeight,
      distance: metrics.distance,
      calories: metrics.calories,
    });
    logWorkoutMinutes(metrics.minutes);

    finaliseWorkout({
      focus: workoutFocus,
      metrics,
      entries: workoutLog,
      logEntry: { activity: "Workout completed", details: workoutLog },
      usedBoostItem: activeBoost || null,
    });
  };

  const handleSummaryContinue = () => {
    setShowSummary(false);
    setSummaryVariant("standard");
    onComplete?.();
  };

  // --- AMRAP render ---
  if (isBenchmarkAmrap) {
    return (
      <div className="log-container amrap-mode">
        <h3 className="log-title">{heading}</h3>
        <BenchmarkAmrapTracker
          config={specialWorkout}
          onSubmit={handleAmrapSubmit}
          error={formError}
        />
        {showSummary && (
          <SessionSummaryModal
            summary={summaryData}
            onContinue={handleSummaryContinue}
            continueLabel={completeLabel}
            variant={summaryVariant}
          />
        )}
      </div>
    );
  }

  // --- Standard render ---
  return (
    <div className="log-container">
      <h3 className="log-title">{heading}</h3>
      <div className="input-row">
        <input
          list="exerciseOptions"
          className="exercise-input"
          placeholder="Start typing..."
          value={exerciseInput.name}
          onChange={(e) =>
            setExerciseInput((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <datalist id="exerciseOptions">
          {(cardioMode ? cardioExercises : filteredExerciseList).map((ex) => (
            <option key={ex.name || ex} value={ex.name || ex} />
          ))}
        </datalist>

        {cardioMode ? (
          <>
            <input
              placeholder="Duration (min)"
              value={exerciseInput.duration}
              onChange={(e) =>
                setExerciseInput((prev) => ({ ...prev, duration: e.target.value }))
              }
            />
            <input
              placeholder="Distance (km)"
              value={exerciseInput.distance}
              onChange={(e) =>
                setExerciseInput((prev) => ({ ...prev, distance: e.target.value }))
              }
            />
          </>
        ) : (
          <>
            <input
              placeholder="Sets"
              value={exerciseInput.sets}
              onChange={(e) =>
                setExerciseInput((prev) => ({ ...prev, sets: e.target.value }))
              }
            />
            <input
              placeholder="Reps"
              value={exerciseInput.reps}
              onChange={(e) =>
                setExerciseInput((prev) => ({ ...prev, reps: e.target.value }))
              }
            />
            <input
              placeholder="Weight (kg)"
              value={exerciseInput.weight}
              onChange={(e) =>
                setExerciseInput((prev) => ({ ...prev, weight: e.target.value }))
              }
            />
          </>
        )}

        <button onClick={handleAddExercise}>+ Log Exercise</button>
      </div>

      {formError && <p className="form-error">{formError}</p>}

      <div className="logged-workout">
        {workoutLog.map((entry, i) => (
          <div key={i} className="logged-card">
            <h4>{entry.name}</h4>
            <div className="meta">
              {cardioMode
                ? `${entry.duration} min / ${entry.distance} km`
                : `${entry.sets} sets × ${entry.reps} reps @ ${entry.weight}`}
            </div>
            <div className="tags">
              {entry.type || "—"} | {entry.category || "—"}
            </div>
          </div>
        ))}
      </div>

      {boostToast && <p className="boost-toast">{boostToast}</p>}
      <button className="primary-btn finish-btn" onClick={handleFinishWorkout}>
        Finish Workout
      </button>

      {showSummary && (
        <SessionSummaryModal
          summary={summaryData}
          onContinue={handleSummaryContinue}
          continueLabel={completeLabel}
          variant={summaryVariant}
        />
      )}
    </div>
  );
}

export default WorkoutLogger;
