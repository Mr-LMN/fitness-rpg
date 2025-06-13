import React from "react";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import "./styles/CharacterCreation.css";

function CharacterCreation({ gameState, setGameState }) {
  const avatars = [
    { id: "pirate", icon: <GiPirateCaptain /> },
    { id: "knight", icon: <GiBlackKnightHelm /> },
    { id: "ninja", icon: <GiNinjaHead /> },
  ];

  return (
    <div className="character-creation-container">
      <div className="character-creation-box">
        <h2>Character Creation</h2>
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
          {avatars.map(({ id, icon }) => (
            <span
              key={id}
              className={`avatar-option ${gameState.avatar === id ? "selected" : ""}`}
              onClick={() => setGameState({ ...gameState, avatar: id })}
            >
              {icon}
            </span>
          ))}
        </div>
        <button onClick={() => setGameState({ ...gameState, characterCreated: true })}>
          Start Game
        </button>
      </div>
    </div>
  );
}

export default CharacterCreation;
