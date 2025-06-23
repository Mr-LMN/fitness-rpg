import React from "react";
import { setUserWeight } from "../utils";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import { FaBrain, FaVolumeUp } from "react-icons/fa";
import "./styles/CharacterCreation.css";

function CharacterCreation({ gameState, setGameState }) {
  const avatars = [
    { id: "pirate", icon: <GiPirateCaptain />, label: "Pirate" },
    { id: "knight", icon: <GiBlackKnightHelm />, label: "Knight" },
    { id: "ninja", icon: <GiNinjaHead />, label: "Ninja" },
  ];

  const allFilled =
    gameState.studentName &&
    gameState.yearGroup &&
    gameState.gender &&
    gameState.weight &&
    gameState.workoutFocus;

  return (
    <div
      className={`character-creation-container ${
        gameState.enhancedReading ? "enhanced-reading" : ""
      }`}
    >
      <div className="character-creation-box">
        <h2>Character Creation</h2>
        <p className="subtitle">Reclaim your identity. The school is waiting.</p>
        <input
          placeholder="Name"
          value={gameState.studentName || ""}
          onChange={(e) =>
            setGameState({ ...gameState, studentName: e.target.value })
          }
        />
        <select
          value={gameState.yearGroup || ""}
          onChange={(e) =>
            setGameState({ ...gameState, yearGroup: e.target.value })
          }
        >
          <option value="">Select Year Group</option>
          <option value="Year 7">Year 7</option>
          <option value="Year 8">Year 8</option>
          <option value="Year 9">Year 9</option>
          <option value="Year 10">Year 10</option>
          <option value="Year 11">Year 11</option>
        </select>
        <select
          value={gameState.gender || ""}
          onChange={(e) =>
            setGameState({ ...gameState, gender: e.target.value })
          }
        >
          <option value="">Gender</option>
          <option value="M">M</option>
          <option value="F">F</option>
        </select>
        <label>
          Weight (kg)
          <input
            type="number"
            value={gameState.weight || ""}
            onChange={(e) =>
              setGameState({ ...gameState, weight: e.target.value })
            }
          />
        </label>
        <select
          value={gameState.workoutFocus || ""}
          onChange={(e) =>
            setGameState({ ...gameState, workoutFocus: e.target.value })
          }
        >
          <option value="">Workout Focus</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
        </select>
        <div className="avatar-selection">
          {avatars.map(({ id, icon, label }) => (
            <span
              key={id}
              title={label}
              className={`avatar-option ${gameState.avatar === id ? "selected" : ""}`}
              onClick={() => setGameState({ ...gameState, avatar: id })}
            >
              {icon}
            </span>
          ))}
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={gameState.enhancedReading || false}
            onChange={(e) => {
              const checked = e.target.checked;
              setGameState({
                ...gameState,
                enhancedReading: checked,
                textToSpeech: checked,
              });
            }}
          />
          <FaBrain /> Enhanced Reading
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={gameState.textToSpeech || false}
            onChange={(e) =>
              setGameState({
                ...gameState,
                textToSpeech: e.target.checked,
              })
            }
          />
          <FaVolumeUp /> TTS
        </label>
        {!allFilled && (
          <p className="error-message">❗ Please fill out all fields</p>
        )}
        <button
          className={allFilled ? "start-btn ready" : "start-btn"}
          onClick={() => {
            const wt = parseFloat(gameState.weight) || 50;
            setUserWeight(wt);
            setGameState({
              ...gameState,
              weight: wt,
              characterCreated: true,
            });
          }}
          disabled={!allFilled}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

export default CharacterCreation;
