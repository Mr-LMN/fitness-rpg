import React, { useEffect, useState } from "react";
import WorkoutLogger from "../WorkoutLogger";
import QuizPhase from "./QuizPhase";
import ParallaxDust from "../ParallaxDust";
import "../styles/Room3Boss.css";
import "../styles/RoomScene.css";

const bossQuizQuestions = [
  {
    question: "What is the Spanish word for 'yellow'?",
    options: [
      { label: "Amarillo", correct: true },
      { label: "Rojo", correct: false },
      { label: "Verde", correct: false },
      { label: "Gris", correct: false },
    ],
  },
  {
    question: "How do you say 'thank you' in Welsh?",
    options: [
      { label: "Diolch", correct: true },
      { label: "Croeso", correct: false },
      { label: "Hwyl", correct: false },
      { label: "Cymru", correct: false },
    ],
  },
  {
    question: "Translate 'blue' to Spanish:",
    options: [
      { label: "Azul", correct: true },
      { label: "Negro", correct: false },
      { label: "Rosa", correct: false },
      { label: "Blanco", correct: false },
    ],
  },
  {
    question: "What does 'nos da' mean in Welsh?",
    options: [
      { label: "Good night", correct: true },
      { label: "Good morning", correct: false },
      { label: "Hello", correct: false },
      { label: "Goodbye", correct: false },
    ],
  },
  {
    question: "How do you say 'dog' in Spanish?",
    options: [
      { label: "Perro", correct: true },
      { label: "Gato", correct: false },
      { label: "Caballo", correct: false },
      { label: "Vaca", correct: false },
    ],
  },
  {
    question: "Translate 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch' into English:",
    options: [
      { label: "Yes", correct: false },
      { label: "No", correct: false },
      { label: "What did you just say?", correct: false },
      { label: "I give up", correct: false },
    ],
  },
];

function Room3Boss({ setGameState, gameState }) {
  const [workoutLogged, setWorkoutLogged] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [bossPhase, setBossPhase] = useState(0);

  useEffect(() => {
    if (workoutLogged) {
      const timer = setTimeout(() => {
        setAlarmTriggered(true);
      }, 10000); // 10 seconds for dev build
      return () => clearTimeout(timer);
    }
  }, [workoutLogged]);

  const handleQuizComplete = (correctAnswers) => {
    setGameState((prev) => ({
      ...prev,
      quizScore: correctAnswers,
    }));
    setBossPhase(1);
  };

  const handlePhaseOneComplete = () => {
    setBossPhase(2);
  };

  const handlePhaseTwoComplete = () => {
    setGameState((prev) => ({
      ...prev,
      completedRooms: [...prev.completedRooms, "Mrs. Roche's Room"],
      visibleRooms: [...prev.visibleRooms, "Fitness Suite"],
      introStage: 5, // Show map next
    }));
  };

  return (
    <div className="room-container">
      <img src="/Mrs_RochesRoom.png" alt="Mrs. Roche's Room" className="scene-image" />
      <ParallaxDust />
      <h1>Mrs. Roche's Classroom</h1>

      {bossPhase === 0 && !workoutLogged && (
        <>
          <p>Everything seems normal. You take a breath and prepare to log your workout.</p>
          <WorkoutLogger
            roomNumber={3}
            setGameState={setGameState}
            workoutFocus={gameState.workoutFocus}
          />
          <button onClick={() => setWorkoutLogged(true)}>Upload Your Workout</button>
        </>
      )}

      {bossPhase === 0 && workoutLogged && !alarmTriggered && (
        <p>You feel strangely calm... but something isn't right.</p>
      )}

      {bossPhase === 0 && alarmTriggered && !quizStarted && (
        <>
          <p>⚠️ An alarm blares. The door slams shut. Six glowing locks appear. You're trapped.</p>
          <p>To escape, answer each question to unlock the bolts... but something tells you the last one isn't quite right.</p>
          <button onClick={() => setQuizStarted(true)}>Begin Quiz</button>
        </>
      )}

      {bossPhase === 0 && quizStarted && (
        <QuizPhase
          questions={bossQuizQuestions}
          onComplete={handleQuizComplete}
          showImpossibleFinal={true}
        />
      )}

      {bossPhase === 1 && (
        <>
          <h2>👹 Mutated Mrs. Roche uses Ground Stomp!</h2>
          <p>You must jump onto the desk to avoid the shockwave.</p>
          <p><strong>Complete 15 Burpee Box Jumps</strong> to survive.</p>
          <WorkoutLogger
            roomNumber={3}
            setGameState={setGameState}
            workoutFocus={gameState.workoutFocus}
          />
          <button onClick={handlePhaseOneComplete}>I Logged My Burpee Box Jumps</button>
        </>
      )}

      {bossPhase === 2 && (
        <>
          <h2>🐉 Roche spins violently with a Whipping Spiral!</h2>
          <p>You must laterally leap to avoid the tail — or risk being slammed against the walls.</p>
          <p><strong>Complete 20 Lateral Bunny Hops over the Free Weight Bench</strong> to dodge.</p>
          <WorkoutLogger
            roomNumber={3}
            setGameState={setGameState}
            workoutFocus={gameState.workoutFocus}
          />
          <button onClick={handlePhaseTwoComplete}>Run for the door!</button>
        </>
      )}
    </div>
  );
}

export default Room3Boss;
