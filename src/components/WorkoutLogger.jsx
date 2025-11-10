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
import BenchmarkAmrapTracker from "./BenchmarkAmrapTracker";
import "./styles/WorkoutLogger.css";

function WorkoutLogger({
  roomNumber,
  setGameState,
  workoutFocus,
  userId,
  yearGroup,
  onComplete,
  onWorkoutLogged,
  title,
  completeLabel = "Continue",
  specialWorkout = null,
}) {
  const cardioMode = workoutFocus === "cardio";
  const allowedCategories = ["Core", "Legs", "Chest", "Back", "Arms", "Functional"];
  const filteredExerciseList = exerciseList.filter((ex) =>
    allowedCategories.includes(ex.category)
  );
  const [exerciseInput, setExerciseInput] = useState(
    cardioMode
      ? { name: "", duration: "", distance: "" }
      : { name: "", sets: "", reps: "", weight: "" }
  );
  const [workoutLog, setWorkoutLog] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryVariant, setSummaryVariant] = useState("standard");
  const [formError, setFormError] = useState("");
  const userWeight = getUserWeight();
  const heading =
    specialWorkout?.title ||
    title ||
    (roomNumber ? `Log Your Workout (${roomNumber})` : "Log Your Workout");
  const isBenchmarkAmrap = specialWorkout?.variant === "benchmark-amrap";

  const handleAmrapSubmit = async ({ roundsCompleted, roundsState }) => {
    if (!isBenchmarkAmrap) return;
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

    try {
      await persistWorkoutLog({
        userId,
        yearGroup,
        workoutData: {
          type: "benchmarkAmrap",
          roundsCompleted,
          roundHistory: roundsState,
          timeCapMinutes: specialWorkout?.timeCapMinutes || null,
          workoutTitle: heading,
          movements: specialWorkout?.movements || [],
        },
      });
    } catch (error) {
      // Error already logged in helper
    }

    updateLifetimeSummary({ weightLifted: 0, distance: 0, calories: 0 });
    logWorkoutMinutes(specialWorkout?.timeCapMinutes || 0);

    const roomLabel = roomNumber || specialWorkout?.title || "Free Log";
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
      annotations: [
        ...(prev.annotations || []),
        {
          room: roomLabel,
          activity: heading,
          details: {
            type: "benchmarkAmrap",
            roundsCompleted,
            roundHistory: roundsState,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }));

    playSound();

    if (typeof onWorkoutLogged === "function") {
      onWorkoutLogged({
        focus: specialWorkout?.variant || workoutFocus,
        metrics: { roundsCompleted },
        entries: roundsState,
        room: roomLabel,
      });
    }
  };

  const handleSummaryContinue = () => {
    setShowSummary(false);
    setSummaryVariant("standard");
    if (onComplete) {
      onComplete();
    }
  };

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

  const handleAddExercise = () => {
    if (cardioMode) {
      if (exerciseInput.name && exerciseInput.duration && exerciseInput.distance) {
        const meta = getExerciseMeta(exerciseInput.name) || {
          category: "Cardio",
          type: "Cardio",
          met: 8,
        };
        setWorkoutLog([
          ...workoutLog,
          {
            name: exerciseInput.name,
            duration: Number(exerciseInput.duration),
            distance: Number(exerciseInput.distance),
            type: meta.type || "Cardio",
            category: meta.category || "Cardio",
            met: meta.met,
            numericWeight: 0,
          },
        ]);
        setExerciseInput({ name: "", duration: "", distance: "" });
        setFormError("");
      }
    } else {
      if (exerciseInput.name && exerciseInput.sets && exerciseInput.reps && exerciseInput.weight) {
        const numericWeight = parseWeightInput(exerciseInput.weight, userWeight);
        const displayWeight = formatWeightDisplay(exerciseInput.weight);
        const meta = getExerciseMeta(exerciseInput.name) || {};
        setWorkoutLog([
          ...workoutLog,
          {
            name: exerciseInput.name,
            sets: Number(exerciseInput.sets),
            reps: Number(exerciseInput.reps),
            weight: displayWeight,
            numericWeight,
            type: meta.type || "Strength",
            category: meta.category || "Strength",
            met: meta.met,
          },
        ]);
        setExerciseInput({ name: "", sets: "", reps: "", weight: "" });
        setFormError("");
      }
    }
  };

  const handleFinishWorkout = async () => {
    if (workoutLog.length === 0) {
      setFormError("Add at least one exercise before finishing.");
      return;
    }

    const metrics = calculateWorkoutMetrics(workoutLog, userWeight, workoutFocus);
    const summary = {
      totalWeight: `${metrics.totalWeight.toFixed(1)} kg`,
      distance: `${metrics.distance.toFixed(1)} km`,
      calories: `${metrics.calories.toFixed(1)} kcal`,
      exerciseCount: workoutLog.length,
    };

    setSummaryVariant("standard");
    setSummaryData(summary);
    setShowSummary(true);

    try {
      await persistWorkoutLog({
        userId,
        yearGroup,
        workoutData: {
          totalWeightLifted: metrics.totalWeight,
          distanceTravelled: metrics.distance,
          caloriesBurned: Math.round(metrics.calories),
          exercisesLogged: workoutLog.length,
          workoutDetails: workoutLog,
          minutesLogged: metrics.minutes,
        },
      });
    } catch (error) {
      // Error already logged in helper
    }

    updateLifetimeSummary({
      weightLifted: metrics.totalWeight,
      distance: metrics.distance,
      calories: metrics.calories,
    });
    logWorkoutMinutes(metrics.minutes);

    const roomLabel = roomNumber || "Free Log";
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
      annotations: [
        ...(prev.annotations || []),
        {
          room: roomLabel,
          activity: "Workout completed",
          details: workoutLog,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    playSound();

    if (typeof onWorkoutLogged === "function") {
      onWorkoutLogged({
        focus: workoutFocus,
        metrics,
        entries: workoutLog,
        room: roomLabel,
      });
    }
  };

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
            setExerciseInput({ ...exerciseInput, name: e.target.value })
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
                setExerciseInput({ ...exerciseInput, duration: e.target.value })
              }
            />
            <input
              placeholder="Distance (km)"
              value={exerciseInput.distance}
              onChange={(e) =>
                setExerciseInput({ ...exerciseInput, distance: e.target.value })
              }
            />
          </>
        ) : (
          <>
            <input
              placeholder="Sets"
              value={exerciseInput.sets}
              onChange={(e) =>
                setExerciseInput({ ...exerciseInput, sets: e.target.value })
              }
            />
            <input
              placeholder="Reps"
              value={exerciseInput.reps}
              onChange={(e) =>
                setExerciseInput({ ...exerciseInput, reps: e.target.value })
              }
            />
            <input
              placeholder="Weight (kg)"
              value={exerciseInput.weight}
              onChange={(e) =>
                setExerciseInput({ ...exerciseInput, weight: e.target.value })
              }
            />
          </>
        )}
        <button onClick={handleAddExercise}>
          + Log Exercise
        </button>
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
