import { useState } from "react";

function QuizPhase({ questions, onComplete, showImpossibleFinal = false }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const questionPool =
    questions && questions.length > 0
      ? questions
      : [
          { q: "What is 'blue' in Spanish?", options: ["Azul", "Rojo", "Verde"], correct: "Azul" },
          { q: "What is 'yellow' in Welsh?", options: ["Melyn", "Du", "Glas"], correct: "Melyn" },
          { q: "Translate 'apple' to Spanish.", options: ["Manzana", "Pera", "Uva"], correct: "Manzana" },
          { q: "What is 'cat' in Spanish?", options: ["Perro", "Gato", "Caballo"], correct: "Gato" },
          { q: "What is 'black' in Welsh?", options: ["Du", "Glas", "Gwyn"], correct: "Du" },
        ];

  const totalQuestions = showImpossibleFinal
    ? questionPool.length + 1
    : questionPool.length;

  const handleAnswer = (answer) => {
    if (currentQuestion < questionPool.length) {
      if (answer === questionPool[currentQuestion].correct) {
        setCorrectAnswers((prev) => prev + 1);
      }
    }
    if (currentQuestion + 1 === totalQuestions) {
      setQuizComplete(true);
      onComplete(correctAnswers);
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  if (quizComplete) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🎉 Quiz Complete</h2>
        <p>You answered {correctAnswers} questions correctly.</p>
        <button
          onClick={() =>
            onComplete(correctAnswers)
          }
        >
          Continue
        </button>
      </div>
    );
  }

  const current = currentQuestion < questionPool.length
    ? questionPool[currentQuestion]
    : {
        q: "Translate 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch' into English:",
        options: ["Yes", "No", "What did you just say?", "I give up"],
        correct: null,
      };

  return (
    <div style={{ padding: 20 }}>
      <h2>📖 The Quiz</h2>
      <p>{current.q}</p>
      <div>
        {current.options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizPhase;