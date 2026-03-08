import React, { useState } from "react";
import "../styles/SafeQuizEvent.css";
import { playSound } from "../../utils";
import TTSLine from "../TTSLine";

const baseUrl = import.meta.env.BASE_URL || "/";

const FAILURE_EXERCISES = [
  "10 burpees",
  "15 jump squats",
  "10 slam balls",
  "15 wall balls",
  "50 skips",
  "10 push ups",
  "30 second plank",
  "12 box jumps",
  "10 ground-to-overheads",
];

const SafeQuizEvent = ({
  questionPool,
  onSuccess,
  onFailure,
  onComplete,
  roomName,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loot, setLoot] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [forfeitExercise, setForfeitExercise] = useState(null);

  const currentQuestion = questionPool[currentQuestionIndex];

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      if (currentQuestionIndex + 1 < questionPool.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setFeedback("Correct!");
        playSound('correct');
      } else {
        const reward = {
          id: 'safe_energy_bar',
          name: 'Energy Bar',
          rarity: 'uncommon',
          description: 'Restores stamina when used.',
        };
        setLoot(reward);
        setQuizCompleted(true);
        setFeedback('Safe unlocked!');
        onSuccess(reward, mistakes === 0);
      }
    } else {
      setLives((prev) => prev - 1);
      setMistakes((m) => m + 1);
      setFeedback("Incorrect");

      if (lives - 1 === 0) {
        const exercise = FAILURE_EXERCISES[Math.floor(Math.random() * FAILURE_EXERCISES.length)];
        setForfeitExercise(exercise);
        setQuizCompleted(true);
        setFeedback(`TITAN: "The code failed, but I can override the lock. Complete ${exercise} and I'll force the safe open for you."`);
        onFailure(exercise);
      }
    }
  };

  if (quizCompleted && loot) {
    return (
      <div className="safe-event">
        <TTSLine
          text={`You've finished scavenging and discovered ${loot.name}. It's been added to your backpack for later use.`}
        />
        <button onClick={onComplete}>Continue</button>
      </div>
    );
  }

  if (quizCompleted && forfeitExercise) {
    return (
      <div className="safe-event">
        <h2>TITAN Override</h2>
        <TTSLine text="You didn't crack the code this time, but TITAN can override the lock." />
        <p className="safe-forfeit-exercise">
          Complete <strong>{forfeitExercise}</strong> to force the safe open!
        </p>
        <button onClick={onComplete}>I've done it - Open the Safe!</button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="safe-event">
        <TTSLine text={feedback} />
        <button onClick={onComplete}>Continue</button>
      </div>
    );
  }

  return (
    <div className="safe-event">
      <img src={`${baseUrl}images/safe.png`} alt="Digital Safe" className="safe-image" />
      <h2>Digital Safe - {roomName}</h2>
      <TTSLine text={`Lives: ${lives} / 3`} />
      {currentQuestion?.question && <TTSLine text={currentQuestion.question} />}
      {currentQuestion?.options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(option.correct)}>
          {option.label}
        </button>
      ))}
      {feedback && <TTSLine text={feedback} />}
    </div>
  );
};

export default SafeQuizEvent;
