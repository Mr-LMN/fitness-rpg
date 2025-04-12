import React, { useState } from "react";

function WorkoutLogger({ roomNumber, setGameState }) {
  const [exerciseInput, setExerciseInput] = useState({
    name: "", sets: "", reps: "", weight: "",
  });
  const [workoutLog, setWorkoutLog] = useState([]);

  const handleAddExercise = () => {
    if (exerciseInput.name && exerciseInput.sets && exerciseInput.reps && exerciseInput.weight) {
      setWorkoutLog([...workoutLog, exerciseInput]);
      setExerciseInput({ name: "", sets: "", reps: "", weight: "" });
    }
  };

  const handleFinishWorkout = () => {
    setGameState((prev) => ({
      ...prev,
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
  };

  return (
    <div>
      <h3>Log Your Workout (Room {roomNumber})</h3>
      <input placeholder="Exercise Name" value={exerciseInput.name}
        onChange={(e) => setExerciseInput({ ...exerciseInput, name: e.target.value })} />
      <input placeholder="Sets" value={exerciseInput.sets}
        onChange={(e) => setExerciseInput({ ...exerciseInput, sets: e.target.value })} />
      <input placeholder="Reps" value={exerciseInput.reps}
        onChange={(e) => setExerciseInput({ ...exerciseInput, reps: e.target.value })} />
      <input placeholder="Weight (kg)" value={exerciseInput.weight}
        onChange={(e) => setExerciseInput({ ...exerciseInput, weight: e.target.value })} />
      <button onClick={handleAddExercise}>Add Exercise</button>

      <ul>
        {workoutLog.map((ex, idx) => (
          <li key={idx}>{`${ex.name}: ${ex.sets} x ${ex.reps} @ ${ex.weight} kg`}</li>
        ))}
      </ul>

      <button onClick={handleFinishWorkout}>Finish Workout</button>
    </div>
  );
}

export default WorkoutLogger;
