import React, { useState } from "react";
import { playSound } from "../../utils";
import WorkoutLogger from "../WorkoutLogger";
import SafeQuizEvent from "../events/SafeQuizEvent";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import narrationLines from "../../data/narrationLines";

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
  const [mapUpdated, setMapUpdated] = useState(false);

  const handleUploadWorkout = () => {
    setWorkoutUploaded(true);
    setSafeDiscovered(true);
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
      annotations: [
        ...prev.annotations,
        {
          room: "Mrs. John's Room",
          activity: "Workout uploaded",
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    playSound();
  };

  const handleQuizSuccess = (loot, perfect) => {
    setQuizCompleted(true);
    setLootFound(loot);
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + (perfect ? 20 : 15),
      inventory: [...prev.inventory, loot],
      badges:
        perfect && !prev.badges.includes("quizMaster")
          ? [...prev.badges, "quizMaster"]
          : prev.badges,
      annotations: [
        ...prev.annotations,
        {
          room: "Mrs. John's Room",
          activity: `Unlocked safe and found: ${loot}`,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    playSound('safeOpen');
  };

  const handleQuizFailure = () => {
    setQuizCompleted(true);
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 5,
      annotations: [
        ...prev.annotations,
        {
          room: "Mrs. John's Room",
          activity: "Failed safe quiz - fitness penalty triggered",
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    playSound();
  };

  const handleReturnToMap = () => {
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 5,
      completedRooms: [...prev.completedRooms, "Mrs. John's Room"],
      visibleRooms: [...prev.visibleRooms, "Mrs. Roche's Room"],
      currentRoom: null,
      introStage: 5,
      showOverlay: true,
    }));
    playSound();
  };

  return (
    <div className={`room-container ${(!workoutUploaded || quizActive) ? "interaction" : ""}`}>
      <img src="/Mrs_JohnsRoom.png" alt="Mrs. John's Room" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h1>Mrs. John's Room</h1>

      {!workoutUploaded && (
        <>
          <p>{narrationLines.room2.intro}</p>
          <WorkoutLogger
            roomNumber={2}
            setGameState={setGameState}
            workoutFocus={gameState.workoutFocus}
            userId={gameState.studentName}
            onComplete={handleUploadWorkout}
            completeLabel="Upload Your Workout"
          />
        </>
      )}

      {safeDiscovered && !quizActive && !quizCompleted && (
        <>
          <p>{narrationLines.room2.safeDiscovery}</p>
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
              <p>{narrationLines.room2.lootFound.replace('{loot}', lootFound)}</p>
              <p>{narrationLines.room2.noteFound}</p>
              <blockquote>{narrationLines.room2.noteQuote}</blockquote>
              <p>{narrationLines.room2.readyMessage}</p>
            </>
          ) : (
            <>
              <p>{narrationLines.room2.lootFailure}</p>
              <p>{narrationLines.room2.failureNote}</p>
              <blockquote>{narrationLines.room2.noteQuote}</blockquote>
              <p>{narrationLines.room2.swallowHard}</p>
            </>
          )}
          <button onClick={handleReturnToMap}>Return to the Map</button>
        </>
      )}
      </div>
    </div>
  );
}

export default Room2;
