import { useState } from "react";
import WorkoutLogger from "../WorkoutLogger";

function Room2({ gameState, setGameState }) {
  const [safeEventTriggered, setSafeEventTriggered] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(3);
  const [keypadCode, setKeypadCode] = useState([]);
  const [safeOpened, setSafeOpened] = useState(false);

  const questions = [
    { q: "What is 'blue' in Spanish?", options: ["Azul", "Rojo", "Verde"], correct: "Azul", digit: 5 },
    { q: "What is 'yellow' in Welsh?", options: ["Melyn", "Du", "Glas"], correct: "Melyn", digit: 3 },
    { q: "Translate 'cat' into Spanish.", options: ["Perro", "Gato", "Caballo"], correct: "Gato", digit: 8 },
    { q: "What is 'black' in Welsh?", options: ["Du", "Glas", "Gwyn"], correct: "Du", digit: 7 },
  ];

  const handleAnswer = (answer) => {
    const current = questions[currentQuestion];

    if (answer === current.correct) {
      // Add digit to keypad code
      setKeypadCode((prev) => [...prev, current.digit]);
      alert(`Correct! You received digit ${current.digit} for the keypad.`);
    } else {
      setLives((prev) => prev - 1);
      alert(`Incorrect! You have ${lives - 1} lives remaining.`);
    }

    if (lives - 1 === 0) {
      alert("You've lost all your lives! You'll need to brute force the safe.");
      setQuizActive(false);
      return;
    }

    // Move to the next question or unlock the safe
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      alert(`You unlocked the safe! The code is ${keypadCode.join("")}.`);
      const loot = "Golden Croissant";
      setGameState((prev) => ({
        ...prev,
        explorationLog: [
          ...prev.explorationLog,
          `Room 2 - Unlocked the safe with code ${keypadCode.join("")} and found a ${loot}`,
        ],
      }));
      setSafeOpened(true);
    }
  };

  const handleBruteForce = () => {
    alert(
      "You brute force the safe open! Perform 15 Ground to Overheads to retrieve the loot."
    );
    const loot = "Basic Survival Kit";
    setGameState((prev) => ({
      ...prev,
      explorationLog: [
        ...prev.explorationLog,
        `Room 2 - Brute forced the safe and found a ${loot}`,
      ],
    }));
    setSafeOpened(true);
  };

  const handleFinishScavenge = () => {
    setSafeEventTriggered(true);
  };

  if (quizActive && !safeOpened) {
    const current = questions[currentQuestion];
    return (
      <div style={{ padding: 20 }}>
        <h2>🔒 The Safe - Quiz</h2>
        <p>{current.q}</p>
        <div>
          {current.options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(option)}>
              {option}
            </button>
          ))}
        </div>
        <p>Lives Remaining: {Array.from({ length: lives }, (_, i) => "❤️").join(" ")}</p>
        <p>Keypad Code: {keypadCode.join("") || "____"}</p>
        {lives === 0 && (
          <button onClick={handleBruteForce}>Brute Force the Safe</button>
        )}
      </div>
    );
  }

  if (safeOpened) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🏕️ Room 2 - Resting Spot</h2>
        <p>
          After unlocking the safe, you retrieve the item and prepare for the
          challenges ahead.
        </p>
        <button onClick={() => setGameState((prev) => ({ ...prev, introStage: 5 }))}>
          Proceed to Mrs. Roche's Classroom
        </button>
      </div>
    );
  }

  if (safeEventTriggered && !quizActive) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🔒 The Safe</h2>
        <p>
          You find a safe under Miss John's desk. The combination is locked,
          but a note hints at the answers to some KS3 language questions.
        </p>
        <button onClick={() => setQuizActive(true)}>Start Quiz</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Miss John's Classroom — Session 2</h2>
      <p>You scavenge the room for supplies. Log your workout below.</p>
      <WorkoutLogger roomNumber={2} gameState={gameState} setGameState={setGameState} />
      <button onClick={handleFinishScavenge}>Finish Scavenge</button>
    </div>
  );
}

export default Room2;