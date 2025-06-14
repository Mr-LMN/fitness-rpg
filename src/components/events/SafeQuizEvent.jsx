import React, { useState } from "react";
import "../styles/SafeQuizEvent.css";

const baseUrl = import.meta.env.BASE_URL || "/";

const SafeQuizEvent = ({ questionPool, onSuccess, onFailure, roomName }) => {
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
      } else {
        const reward = "✨ Energy Bar (Loot) ✨";
        setLoot(reward);
        setQuizCompleted(true);
        setFeedback("Safe unlocked!");
        onSuccess(reward, mistakes === 0);
      }
    } else {
      setLives((prev) => prev - 1);
      setMistakes((m) => m + 1);
      setFeedback("Incorrect ❌");

      if (lives - 1 === 0) {
        setQuizCompleted(true);
        setFeedback("Access Denied. You must now complete a physical challenge.");
        onFailure();
      }
    }
  };

  if (quizCompleted && loot) {
    return <p>{feedback} You found: <strong>{loot}</strong></p>;
  }

  if (quizCompleted) {
    return <p>{feedback}</p>;
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
