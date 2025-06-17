import React, { useState } from "react";
import "../styles/SafeQuizEvent.css";
import { playSound } from "../../utils";

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

  const currentQuestion = questionPool[currentQuestionIndex];

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      if (currentQuestionIndex + 1 < questionPool.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setFeedback("Correct! ✅");
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
      setFeedback("Incorrect ❌");

      if (lives - 1 === 0) {
        const exercise = FAILURE_EXERCISES[Math.floor(Math.random() * FAILURE_EXERCISES.length)];
        setQuizCompleted(true);
        setFeedback(`Access Denied. You must now complete ${exercise} to break it open.`);
        onFailure(exercise);
      }
    }
  };

  if (quizCompleted && loot) {
    return (
      <div>
        <p>
          You’ve finished scavenging and discovered{' '}
          <strong className={`rarity-${loot.rarity}`}>{loot.name}</strong>. It’s been added to your backpack for later use.
        </p>
        <button onClick={onComplete}>Continue</button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div>
        <p>{feedback}</p>
        <button onClick={onComplete}>Continue</button>
      </div>
    );
  }

  return (
    <div className="safe-event">
      <img src={`${baseUrl}safe.png`} alt="Digital Safe" className="safe-image" />
      <h2>🔐 Digital Safe - {roomName}</h2>
      <p><strong>Lives:</strong> {"❤️".repeat(lives)} {"🤍".repeat(3 - lives)}</p>
      <p>{currentQuestion?.question}</p>
      {currentQuestion?.options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(option.correct)}>
          {option.label}
        </button>
      ))}
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default SafeQuizEvent;
