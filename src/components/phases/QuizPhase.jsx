import React, { useState } from "react";
import { playSound } from "../../utils";
import { defaultQuizPool, extraQuizPool } from "../../data/quizPool";
import "../styles/Quiz.css";

const MIN_QUESTIONS = 6;

const PENALTY_EXERCISES = [
  "3 Burpees",
  "3 Squat Jumps",
  "3 Star Jumps",
  "3 Push-ups",
];

const IMPOSSIBLE_FINAL_QUESTION = {
  q: "Translate 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch' into English:",
  options: [
    { label: "Yes", correct: false },
    { label: "No", correct: false },
    { label: "What did you just say?", correct: false },
    { label: "I give up", correct: false },
  ],
};

function buildQuestionPool(questions, showImpossibleFinal) {
  let pool = Array.isArray(questions) && questions.length > 0
    ? [...questions]
    : [...defaultQuizPool];

  pool = pool.sort(() => Math.random() - 0.5);

  // Pad to MIN_QUESTIONS if needed
  let extraIndex = 0;
  while (pool.length < MIN_QUESTIONS) {
    pool.push(extraQuizPool[extraIndex % extraQuizPool.length]);
    extraIndex += 1;
  }

  pool = pool.slice(0, MIN_QUESTIONS);

  if (showImpossibleFinal) {
    pool.push(IMPOSSIBLE_FINAL_QUESTION);
  }

  return pool;
}

function QuizPhase({ questions = [], onComplete, showImpossibleFinal = false }) {
  const [questionPool, setQuestionPool] = useState(() =>
    buildQuestionPool(questions, showImpossibleFinal)
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [penalty, setPenalty] = useState("");
  const [finalWrong, setFinalWrong] = useState(false);

  const totalQuestions = questionPool.length;
  const current = questionPool[currentQuestion];

  const handleAnswer = (option) => {
    const isCorrect = !!option.correct;
    const isLast = currentQuestion === totalQuestions - 1;

    if (isCorrect) {
      setCorrectAnswers((c) => c + 1);
      playSound("correct");
    } else if (showImpossibleFinal && isLast) {
      setFinalWrong(true);
      setPenalty("");
    } else {
      const random = PENALTY_EXERCISES[Math.floor(Math.random() * PENALTY_EXERCISES.length)];
      setPenalty(`❌ Wrong! Do ${random}!`);
      setTimeout(() => setPenalty(""), 3000);
    }

    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setQuizComplete(true);
      playSound("monsterRoar");
    }
  };

  const handleReset = () => {
    setQuestionPool(buildQuestionPool(questions, showImpossibleFinal));
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setQuizComplete(false);
    setPenalty("");
    setFinalWrong(false);
  };

  if (quizComplete) {
    return (
      <div className="quiz-container">
        <h2>🎉 Quiz Complete</h2>
        <p>You answered {correctAnswers} out of {totalQuestions} correctly.</p>
        {finalWrong && (
          <p>
            A mutated figure charges at you! You dive aside as it smashes the
            door open.
          </p>
        )}
        <button onClick={() => onComplete(correctAnswers, totalQuestions)}>Continue</button>
        {correctAnswers < totalQuestions && (
          <button className="quiz-option-btn retry" onClick={handleReset}>
            Retry from Start
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>📖 The Quiz</h2>
      <p className="quiz-question">{current.q}</p>
      <div className="quiz-options">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            className="quiz-option-btn"
          >
            {opt.label}
          </button>
        ))}
      </div>
      {penalty && <p className="penalty-message">{penalty}</p>}
    </div>
  );
}

export default QuizPhase;
