import React, { useState } from "react";
import { playSound, updateLifetimeSummary, logWorkoutMinutes } from "../utils";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import SessionSummaryModal from "./SessionSummaryModal";
import exerciseList from "../data/exerciseList";
import cardioExercises from "../data/cardioExercises";
import "./styles/WorkoutLogger.css";

function WorkoutLogger({
  roomNumber,
  setGameState,
  workoutFocus,
  userId,
  onComplete,
  completeLabel = "Continue",
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

  const handleAddExercise = () => {
    if (cardioMode) {
      if (exerciseInput.name && exerciseInput.duration && exerciseInput.distance) {
        setWorkoutLog([
          ...workoutLog,
          { ...exerciseInput, type: "Cardio", category: "Cardio" },
        ]);
        setExerciseInput({ name: "", duration: "", distance: "" });
      }
    } else {
      if (exerciseInput.name && exerciseInput.sets && exerciseInput.reps && exerciseInput.weight) {
        setWorkoutLog([...workoutLog, exerciseInput]);
        setExerciseInput({ name: "", sets: "", reps: "", weight: "" });
      }
    }
  };

  const handleFinishWorkout = () => {
    const totalWeight = workoutLog.reduce(
      (sum, w) => sum + ((parseFloat(w.sets) || 0) * (parseFloat(w.reps) || 0) * (parseFloat(w.weight) || 0)),
      0
    );
    const distance = workoutLog.reduce((sum, w) => sum + (parseFloat(w.distance) || 0), 0);
    const calories = Math.round(distance * 60 + totalWeight * 0.1);
    const minutes = workoutLog.reduce((sum, w) => {
      if (cardioMode) return sum + (parseFloat(w.duration) || 0);
      const sets = parseFloat(w.sets) || 0;
      const reps = parseFloat(w.reps) || 0;
      return sum + (sets * reps * 3) / 60;
    }, 0);

    const summary = {
      totalWeight: `${totalWeight.toFixed(1)} kg`,
      distance: `${distance.toFixed(1)} km`,
      calories: `${calories} kcal`,
      exerciseCount: workoutLog.length,
    };

    setSummaryData(summary);
    setShowSummary(true);

    // Save data to Firestore
    saveWorkoutToFirestore({
      totalWeightLifted: totalWeight,
      distanceTravelled: distance,
      caloriesBurned: calories,
      exercisesLogged: workoutLog.length,
      workoutDetails: workoutLog, // Optional, detailed logs
      minutesLogged: minutes,
    });

    updateLifetimeSummary({ weightLifted: totalWeight, distance, calories });
    logWorkoutMinutes(minutes);

    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
      annotations: [
        ...prev.annotations,
        {
          room: `Room ${roomNumber}`,
          activity: "Workout completed",
          details: workoutLog,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    playSound();
  };

  const handleSummaryContinue = () => {
    setShowSummary(false);
    if (onComplete) {
      onComplete();
    }
  };

  const saveWorkoutToFirestore = async (workoutData) => {
    const userId = "test-user"; // Replace this with real user ID once authentication is set up
    try {
      await addDoc(collection(db, "students", userId, "workouts"), {
        ...workoutData,
        createdAt: serverTimestamp(),
      });
      console.log("✅ Workout successfully logged in Firestore");
    } catch (error) {
      console.error("❌ Error logging workout to Firestore:", error);
    }
  };

  return (
    <div className="log-container">
      <h3 className="log-title">Log Your Workout (Room {roomNumber})</h3>
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
        />
      )}
    </div>
  );
}

export default WorkoutLogger;
