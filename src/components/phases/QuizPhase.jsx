import React, { useState, useMemo } from "react";
import "../styles/Quiz.css";

function QuizPhase({ questions = [], onComplete, showImpossibleFinal = false }) {
  // Default question pool
  const defaultPool = [
    {
      q: "What is 'blue' in Spanish?",
      options: [
        { label: "Azul", correct: true },
        { label: "Rojo", correct: false },
        { label: "Verde", correct: false },
      ],
    },
    {
      q: "What is 'yellow' in Welsh?",
      options: [
        { label: "Melyn", correct: true },
        { label: "Du", correct: false },
        { label: "Glas", correct: false },
      ],
    },
    {
      q: "Translate 'apple' to Spanish.",
      options: [
        { label: "Manzana", correct: true },
        { label: "Pera", correct: false },
        { label: "Uva", correct: false },
      ],
    },
    {
      q: "What is 'cat' in Spanish?",
      options: [
        { label: "Gato", correct: true },
        { label: "Perro", correct: false },
        { label: "Caballo", correct: false },
      ],
    },
    {
      q: "What is 'black' in Welsh?",
      options: [
        { label: "Du", correct: true },
        { label: "Glas", correct: false },
        { label: "Gwyn", correct: false },
      ],
    },
    {
      q: "Translate 'house' to Spanish.",
      options: [
        { label: "Casa", correct: true },
        { label: "Carro", correct: false },
        { label: "Mesa", correct: false },
      ],
    },
    {
      q: "How do you say 'book' in Welsh?",
      options: [
        { label: "Llyfr", correct: true },
        { label: "Cadair", correct: false },
        { label: "Dwr", correct: false },
      ],
    },
    {
      q: "What is 'please' in Spanish?",
      options: [
        { label: "Por favor", correct: true },
        { label: "Buenos días", correct: false },
        { label: "Gracias", correct: false },
      ],
    },
  ];

  // Build question pool
  const questionPool = useMemo(() => {
    const pool = Array.isArray(questions) && questions.length > 0 ? [...questions] : [...defaultPool];
    if (showImpossibleFinal) {
      pool.push({
        q: "Translate 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch' into English:",
        options: [
          { label: "Yes", correct: false },
          { label: "No", correct: false },
          { label: "What did you just say?", correct: false },
          { label: "I give up", correct: false },
        ],
      });
    }
    return pool.sort(() => Math.random() - 0.5);
  }, [questions, showImpossibleFinal]);

  const totalQuestions = questionPool.length;

  // State for current question and score
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [penalty, setPenalty] = useState("");

  const penaltyExercises = [
    "3 Burpees",
    "3 Squat Jumps",
    "3 Star Jumps",
    "3 Push-ups",
  ];

  // Handle answer click
  const handleAnswer = (option) => {
    const isCorrect = !!option.correct;
    if (isCorrect) {
      setCorrectAnswers((c) => c + 1);
    } else {
      const random = penaltyExercises[Math.floor(Math.random() * penaltyExercises.length)];
      setPenalty(`❌ Wrong! Do ${random}!`);
      setTimeout(() => setPenalty(""), 3000);
    }

    const nextIndex = currentQuestion + 1;
    if (nextIndex < totalQuestions) {
      setCurrentQuestion(nextIndex);
    } else {
      setQuizComplete(true);
    }
  };

  // When complete, show results and call onComplete
  if (quizComplete) {
    return (
      <div className="quiz-container">
        <h2>🎉 Quiz Complete</h2>
        <p>You answered {correctAnswers} out of {totalQuestions} correctly.</p>
        <button onClick={() => onComplete(correctAnswers)}>Continue</button>
      </div>
    );
  }

  // Current question object
  const current = questionPool[currentQuestion];

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
