import { useState } from "react";

function QuizPhase({ setGameState }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = [
    { q: "What is 'blue' in Spanish?", options: ["Azul", "Rojo", "Verde"], correct: "Azul" },
    { q: "What is 'yellow' in Welsh?", options: ["Melyn", "Du", "Glas"], correct: "Melyn" },
    { q: "Translate 'apple' to Spanish.", options: ["Manzana", "Pera", "Uva"], correct: "Manzana" },
    { q: "What is 'cat' in Spanish?", options: ["Perro", "Gato", "Caballo"], correct: "Gato" },
    { q: "What is 'black' in Welsh?", options: ["Du", "Glas", "Gwyn"], correct: "Du" },
    {
      // The final fixed question
      q: "Translate 'El burrito está en el baño' into English.",
      options: ["The sun is in the sky", "The burrito is in the bathroom", "Candle"], // Funny answers
      correct: null, // No correct answer; all are wrong
    },
  ];

  const handleAnswer = (answer) => {
    // Check if the answer is correct (except for the last question)
    if (currentQuestion < questions.length - 1) {
      if (answer === questions[currentQuestion].correct) {
        setCorrectAnswers((prev) => prev + 1);
      }
    }

    // If it's the final question, trigger the boss encounter
    if (currentQuestion === questions.length - 1) {
      alert("The door bursts open, and a Mutated Mrs. Roche appears!");
      setQuizComplete(true);
      return;
    }

    // Move to the next question
    setCurrentQuestion((prev) => prev + 1);
  };

  if (quizComplete) {
    // Display rewards based on correct answers
    const rewards = [
      "Nothing... better luck next time!",
      "A bottle of water!",
      "A protein bar!",
      "An energy drink!",
      "A survival kit!",
      "A golden trophy!", // Max reward
    ];

    return (
      <div style={{ padding: 20 }}>
        <h2>🎉 Quiz Complete</h2>
        <p>You answered {correctAnswers} questions correctly.</p>
        <p>Your reward: {rewards[correctAnswers]}</p>
        <button
          onClick={() =>
            setGameState((prev) => ({
              ...prev,
              introStage: 6, // Move to the boss battle
            }))
          }
        >
          Continue to Boss Battle
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📖 The Quiz</h2>
      <p>{questions[currentQuestion].q}</p>
      <div>
        {questions[currentQuestion].options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizPhase;