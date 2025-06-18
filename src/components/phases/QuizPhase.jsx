import React, { useState, useMemo } from "react";
import { playSound } from "../../utils";
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

  const extraPool = [
    {
      q: "How do you say 'hello' in Welsh?",
      options: [
        { label: "Helo", correct: true },
        { label: "Diolch", correct: false },
        { label: "Hwyl", correct: false },
      ],
    },
    {
      q: "Translate 'school' to Welsh.",
      options: [
        { label: "Ysgol", correct: true },
        { label: "Ty", correct: false },
        { label: "Bws", correct: false },
      ],
    },
    {
      q: "What is 'red' in Spanish?",
      options: [
        { label: "Rojo", correct: true },
        { label: "Negro", correct: false },
        { label: "Verde", correct: false },
      ],
    },
    {
      q: "How do you say 'goodbye' in Welsh?",
      options: [
        { label: "Hwyl fawr", correct: true },
        { label: "Nos da", correct: false },
        { label: "Croeso", correct: false },
      ],
    },
  ];

  // Build question pool
  const questionPool = useMemo(() => {
    let pool = Array.isArray(questions) && questions.length > 0 ? [...questions] : [...defaultPool];
    pool = pool.sort(() => Math.random() - 0.5);

    // ensure at least 6 questions before the final one
    let extraIndex = 0;
    while (pool.length < 6) {
      pool.push(extraPool[extraIndex % extraPool.length]);
      extraIndex += 1;
    }
    pool = pool.slice(0, 6);

    if (showImpossibleFinal) {
      const finalQ = {
        q: "Translate 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch' into English:",
        options: [
          { label: "Yes", correct: false },
          { label: "No", correct: false },
          { label: "What did you just say?", correct: false },
          { label: "I give up", correct: false },
        ],
      };
      pool.push(finalQ);
    }

    return pool;
  }, [questions, showImpossibleFinal]);

  const totalQuestions = questionPool.length;

  // State for current question and score
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [penalty, setPenalty] = useState("");
  const [finalWrong, setFinalWrong] = useState(false);

  const penaltyExercises = [
    "3 Burpees",
    "3 Squat Jumps",
    "3 Star Jumps",
    "3 Push-ups",
  ];

  // Handle answer click
  const handleAnswer = (option) => {
    const isCorrect = !!option.correct;
    const isLast = currentQuestion === totalQuestions - 1;

    if (isCorrect) {
      setCorrectAnswers((c) => c + 1);
      playSound('correct');
    } else if (showImpossibleFinal && isLast) {
      setFinalWrong(true);
      setPenalty("");
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
      playSound('monsterRoar');
    }
  };

  // When complete, show results and call onComplete
  if (quizComplete) {
    return (
      <div className="quiz-container">
        <h2>🎉 Quiz Complete</h2>
        <p>You answered {correctAnswers} out of {totalQuestions} correctly.</p>
        <p>The monster suddenly barges the door. You notice the bolt loosen slightly.</p>
        <button onClick={() => onComplete(correctAnswers, totalQuestions)}>Continue</button>
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
