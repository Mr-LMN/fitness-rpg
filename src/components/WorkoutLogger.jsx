import { useState } from "react";

function WorkoutLogger({ roomNumber, gameState, setGameState }) {
  const [exerciseInput, setExerciseInput] = useState({ name: "", sets: "", reps: "", weight: "" });
  const [workoutLog, setWorkoutLog] = useState([]);

  const handleAddExercise = () => {
    if (exerciseInput.name && exerciseInput.sets && exerciseInput.reps && exerciseInput.weight) {
      setWorkoutLog([...workoutLog, exerciseInput]);
      setExerciseInput({ name: "", sets: "", reps: "", weight: "" });
    }
  };

  const handleFinishScavenge = () => {
    const lootItems = ["Milkshake", "Croissant"];
    const randomLoot = lootItems[Math.floor(Math.random() * lootItems.length)];

    setGameState((prev) => ({
      ...prev,
      explorationLog: [...prev.explorationLog, `Room ${roomNumber} - Found ${randomLoot}`],
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Room {roomNumber} - Workout Log</h2>
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
      <ul>
        {workoutLog.map((exercise, index) => (
          <li key={index}>
            {exercise.name} - {exercise.sets}x{exercise.reps} @ {exercise.weight}kg
          </li>
        ))}
      </ul>
      <button onClick={handleFinishScavenge}>Finish Scavenge</button>
    </div>
  );
}

export default WorkoutLogger;