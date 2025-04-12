import React, { useState } from "react";

function WorkoutLogger({ roomNumber, gameState, setGameState }) {
  const [exerciseInput, setExerciseInput] = useState({ name: "", sets: "", reps: "", weight: "" });
  const [workoutLog, setWorkoutLog] = useState([]);

  const handleAddExercise = () => {
    if (exerciseInput.name && exerciseInput.sets && exerciseInput.reps && exerciseInput.weight) {
      setWorkoutLog([...workoutLog, exerciseInput]);
      setExerciseInput({ name: "", sets: "", reps: "", weight: "" });
    }
  };

  const handleFinishWorkout = () => {
    // Ensure explorationLog exists and is iterable
    setGameState((prev) => ({
      ...prev,
      explorationLog: Array.isArray(prev.explorationLog)
        ? [...prev.explorationLog, `Room ${roomNumber} - Workout Logged`]
        : [`Room ${roomNumber} - Workout Logged`],
    }));
  };

  return (
    <div>
      <h3>Room {roomNumber} - Workout Log</h3>
      <div>
        <input
          placeholder="Exercise Name"
          value={exerciseInput.name}
          onChange={(e) => setExerciseInput({ ...exerciseInput, name: e.target.value })}
        />
        <input
          placeholder="Sets"
          value={exerciseInput.sets}
          onChange={(e) => setExerciseInput({ ...exerciseInput, sets: e.target.value })}
        />
        <input
          placeholder="Reps"
          value={exerciseInput.reps}
          onChange={(e) => setExerciseInput({ ...exerciseInput, reps: e.target.value })}
        />
        <input
          placeholder="Weight (kg)"
          value={exerciseInput.weight}
          onChange={(e) => setExerciseInput({ ...exerciseInput, weight: e.target.value })}
        />
        <button onClick={handleAddExercise}>Add Exercise</button>
      </div>
      <ul>
        {workoutLog.map((exercise, index) => (
          <li key={index}>
            {exercise.name} - {exercise.sets}x{exercise.reps} @ {exercise.weight}kg
          </li>
        ))}
      </ul>
      <button onClick={handleFinishWorkout}>Finish Workout</button>
    </div>
  );
}

export default WorkoutLogger;