import React, { useState } from "react";
import { playSound } from "../utils";
import exerciseList from "../data/exerciseList";
import cardioExercises from "../data/cardioExercises";
import {
  GiBiceps,
  GiLeg,
  GiChestArmor,
  GiBackboneShell,
  GiBodyBalance,
  GiRunningShoe,
} from "react-icons/gi";
import "./styles/WorkoutLogger.css";

function WorkoutLogger({ roomNumber, setGameState, workoutFocus }) {
  const cardioMode = workoutFocus === "cardio";
  const [exerciseInput, setExerciseInput] = useState(
    cardioMode
      ? { name: "", duration: "", distance: "" }
      : { name: "", sets: "", reps: "", weight: "" }
  );
  const [workoutLog, setWorkoutLog] = useState([]);

  const categoryIcons = {
    Arms: <GiBiceps />,
    "Arms/Back": <GiBiceps />,
    Shoulders: <GiBiceps />,
    Back: <GiBackboneShell />,
    Chest: <GiChestArmor />,
    Core: <GiBodyBalance />,
    Legs: <GiLeg />,
    Functional: <GiRunningShoe />,
    Cardio: <GiRunningShoe />,
  };

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
          {(cardioMode ? cardioExercises : exerciseList).map((ex) => (
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

      <div className="log-grid">
        {workoutLog.map((ex, idx) => (
          <div className="log-card" key={idx}>
            <div className="log-header">
              <span className="log-icon">
                {categoryIcons[ex.category] || <GiRunningShoe />}
              </span>
              <span>{ex.name}</span>
            </div>
            <div className="log-details">
              {cardioMode
                ? `${ex.duration}min / ${ex.distance}km`
                : `${ex.sets} x ${ex.reps} @ ${ex.weight} kg`}
            </div>
            <div className="log-tags">
              <span className="tag">{ex.type || ""}</span>
              {" | "}
              <span className="tag">{ex.category || ""}</span>
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
