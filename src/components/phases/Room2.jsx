import React, { useState } from "react";
import WorkoutLogger from "../WorkoutLogger";
import SafeQuizEvent from "../events/SafeQuizEvent";

const languageQuestions = [
  {
    question: "What is the Spanish word for 'red'?",
    options: [
      { label: "Rojo", correct: true },
      { label: "Azul", correct: false },
      { label: "Verde", correct: false },
      { label: "Negro", correct: false },
    ],
  },
  {
    question: "What does 'feliz' mean in Spanish?",
    options: [
      { label: "Sad", correct: false },
      { label: "Happy", correct: true },
      { label: "Tired", correct: false },
      { label: "Angry", correct: false },
    ],
  },
  {
    question: "What is the Spanish word for 'Monday'?",
    options: [
      { label: "Lunes", correct: true },
      { label: "Martes", correct: false },
      { label: "Jueves", correct: false },
      { label: "Domingo", correct: false },
    ],
  },
  {
    question: "Translate 'verde' to English:",
    options: [
      { label: "Green", correct: true },
      { label: "Blue", correct: false },
      { label: "Yellow", correct: false },
      { label: "Orange", correct: false },
    ],
  },
];

function Room2({ setGameState, gameState }) {
  const [workoutUploaded, setWorkoutUploaded] = useState(false);
  const [safeDiscovered, setSafeDiscovered] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [lootFound, setLootFound] = useState(null);

  const handleUploadWorkout = () => {
    setWorkoutUploaded(true);
    setSafeDiscovered(true);
    setGameState((prev) => ({
      ...prev,
      annotations: [
        ...prev.annotations,
        {
          room: "Mrs. John's Room",
          activity: "Workout uploaded",
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  };

  const handleQuizSuccess = (loot) => {
    setQuizCompleted(true);
    setLootFound(loot);
    setGameState((prev) => ({
      ...prev,
      inventory: [...prev.inventory, loot],
      annotations: [
        ...prev.annotations,
        {
          room: "Mrs. John's Room",
          activity: `Unlocked safe and found: ${loot}`,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  };

  const handleQuizFailure = () => {
    setQuizCompleted(true);
    setGameState((prev) => ({
      ...prev,
      annotations: [
        ...prev.annotations,
        {
          room: "Mrs. John's Room",
          activity: "Failed safe quiz - fitness penalty triggered",
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  };

  const handleReturnToMap = () => {
    setGameState((prev) => ({
      ...prev,
      completedRooms: [...prev.completedRooms, "Mrs. John's Room"],
      currentRoom: null,
      introStage: 5,
      showOverlay: true,
    }));
  };

  return (
    <div className="room-container">
      <h1>Mrs. John's Room</h1>

      {!workoutUploaded && (
        <>
          <p>You arrive in Mrs. John's classroom. It's eerily quiet, but there's space to complete your next workout.</p>
          <WorkoutLogger roomNumber={2} setGameState={setGameState} />
          <button onClick={handleUploadWorkout}>Upload Your Workout</button>
        </>
      )}

      {safeDiscovered && !quizActive && !quizCompleted && (
        <>
          <p>While catching your breath, you notice a flicker under the teacher's desk. It's a dusty digital safe with a keypad!</p>
          <button onClick={() => setQuizActive(true)}>Attempt to Unlock the Safe</button>
        </>
      )}

      {quizActive && !quizCompleted && (
        <SafeQuizEvent
          questionPool={languageQuestions}
          onSuccess={handleQuizSuccess}
          onFailure={handleQuizFailure}
          roomName="Mrs. John's Room"
        />
      )}

      {quizCompleted && (
        <>
          {lootFound ? (
            <>
              <p>You found <strong>{lootFound}</strong> inside the safe. Nicely done!</p>
              <p>Inside the safe, you also find a scribbled note:</p>
              <blockquote>
                "If anyone finds this, Roche has barricaded herself in the far room. I heard growling… Stay away unless you're ready."
              </blockquote>
              <p>You pocket the bar and steel yourself. It might be time to face what’s in there.</p>
            </>
          ) : (
            <>
              <p>You couldn't crack the safe. You'll need to complete 15 ground-to-overheads to brute force it open.</p>
              <p>After forcing it open, you find a crumpled note:</p>
              <blockquote>
                "Roche… far room… something’s wrong… don’t go alone."
              </blockquote>
              <p>You swallow hard. Time to prepare.</p>
            </>
          )}
          <button onClick={handleReturnToMap}>Return to the Map</button>
        </>
      )}
    </div>
  );
}

export default Room2;
