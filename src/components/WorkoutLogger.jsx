import React, { useState } from "react";
import { playSound } from "../utils";
import exerciseList from "../data/exerciseList";
import cardioExercises from "../data/cardioExercises";
import "./styles/WorkoutLogger.css";

function WorkoutLogger({ roomNumber, setGameState, workoutFocus }) {
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

  return (
    <div className="workout-logger">
      <h3>Log Your Workout (Room {roomNumber})</h3>
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
        <button className="add-btn" onClick={handleAddExercise}>
          + Log Exercise
        </button>
      </div>

      <div className="logged-workout">
        {workoutLog.map((entry, i) => (
          <div key={i} className="logged-exercise">
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
    </div>
  );
}

export default WorkoutLogger;
