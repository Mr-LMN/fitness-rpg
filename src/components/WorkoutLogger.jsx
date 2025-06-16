import React, { useState } from "react";
import { playSound } from "../utils";
import cardioExercises from "../data/cardioExercises";

function WorkoutLogger({ roomNumber, setGameState, workoutFocus }) {
  const cardioMode = workoutFocus === "cardio";
  const [exerciseInput, setExerciseInput] = useState(
    cardioMode
      ? { name: cardioExercises[0].name, duration: "", distance: "" }
      : { name: "", sets: "", reps: "", weight: "" }
  );
  const [workoutLog, setWorkoutLog] = useState([]);

  const handleAddExercise = () => {
    if (cardioMode) {
      if (exerciseInput.name && exerciseInput.duration && exerciseInput.distance) {
        setWorkoutLog([...workoutLog, exerciseInput]);
        setExerciseInput({ name: cardioExercises[0].name, duration: "", distance: "" });
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
    <div>
      <h3>Log Your Workout (Room {roomNumber})</h3>
      {cardioMode ? (
        <>
          <select
            value={exerciseInput.name}
            onChange={(e) =>
              setExerciseInput({ ...exerciseInput, name: e.target.value })
            }
          >
            {cardioExercises.map((ex) => (
              <option key={ex.name} value={ex.name}>
                {ex.name}
              </option>
            ))}
          </select>
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
            placeholder="Exercise Name"
            value={exerciseInput.name}
            onChange={(e) =>
              setExerciseInput({ ...exerciseInput, name: e.target.value })
            }
          />
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
      <button onClick={handleAddExercise}>Add Exercise</button>

      <ul>
        {workoutLog.map((ex, idx) => (
          <li key={idx}>
            {cardioMode
              ? `${ex.name}: ${ex.duration}min / ${ex.distance}km`
              : `${ex.name}: ${ex.sets} x ${ex.reps} @ ${ex.weight} kg`}
          </li>
        ))}
      </ul>

      <button onClick={handleFinishWorkout}>Finish Workout</button>
    </div>
  );
}

export default WorkoutLogger;
