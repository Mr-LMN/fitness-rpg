import React, { useState } from "react";

const SafeQuizEvent = ({ questionPool, onSuccess, onFailure, roomName }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loot, setLoot] = useState(null);

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
        onSuccess(reward);
      }
    } else {
      setLives((prev) => prev - 1);
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
