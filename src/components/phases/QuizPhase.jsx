import { useEffect, useState } from "react";

function QuizPhase({ gameState, setGameState }) {
  const fullQuestionBank = [
    { q: 'What is "blue" in Spanish?', a: "azul", options: ["rojo", "verde", "azul"] },
    { q: 'What is "yellow" in Welsh?', a: "melyn", options: ["glas", "melyn", "coch"] },
    { q: 'What is "cat" in Spanish?', a: "gato", options: ["gato", "perro", "pez"] },
    { q: 'What is "black" in Welsh?', a: "du", options: ["du", "gwyn", "glas"] },
    { q: 'What is "one" in Spanish?', a: "uno", options: ["dos", "tres", "uno"] },
    { q: 'What is "six" in Welsh?', a: "chwech", options: ["tri", "pump", "chwech"] },
    { q: 'What is "red" in Spanish?', a: "rojo", options: ["rojo", "amarillo", "verde"] },
    { q: 'What is "green" in Welsh?', a: "glas", options: ["glas", "melyn", "coch"] },
    { q: 'What is "dog" in Spanish?', a: "perro", options: ["gato", "perro", "pez"] },
    { q: 'What is "white" in Welsh?', a: "gwyn", options: ["du", "gwyn", "glas"] },
  ];

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    // Randomly select 5 questions from the bank
    const shuffledQuestions = fullQuestionBank.sort(() => 0.5 - Math.random());
    const selected = shuffledQuestions.slice(0, 5);

    // Add the impossible question as the final one
    selected.push({
      q: 'Translate "Llanfair­pwllgwyngyll­gogery­chwyrn­drobwll­llan­tysilio­gogo­goch" into English.',
      a: null, // Impossible to answer
      options: ["", "", ""], // No valid options
    });

    setSelectedQuestions(selected);
  }, []);

  const handleAnswer = (answer) => {
    const currentQuestion = selectedQuestions[currentQuestionIndex];

    setGameState((prev) => ({
      ...prev,
      quizScore: answer === currentQuestion.a ? prev.quizScore + 1 : prev.quizScore,
    }));

    if (currentQuestionIndex === selectedQuestions.length - 1) {
      // Quiz is complete
      setGameState((prev) => ({ ...prev, bossReady: true }));
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (selectedQuestions.length === 0) {
    return <div>Loading Quiz...</div>;
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div style={{ padding: 20 }}>
      <h2>🚪 The Door Slams Shut!</h2>
      <p>A strange puzzle appears on the door. You hear footsteps approaching fast...</p>
      <p><strong>Answer quickly! Incorrect answers will power up the boss!</strong></p>
      <h3>{currentQuestion.q}</h3>
      {currentQuestion.options.map((opt, idx) => (
        <button key={idx} onClick={() => handleAnswer(opt)}>
          {opt || "Skip"}
        </button>
      ))}
    </div>
  );
}

export default QuizPhase;