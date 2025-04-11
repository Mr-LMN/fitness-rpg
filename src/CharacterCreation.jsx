import React, { useState } from "react";

function CharacterCreation({ onComplete }) {
  const [name, setName] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [goal, setGoal] = useState("");
  const [bodyWeight, setBodyWeight] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h2>🎮 Character Creation</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <select
        value={yearGroup}
        onChange={(e) => setYearGroup(e.target.value)}
      >
        <option value="">Select Year Group</option>
        <option value="Year 7">Year 7</option>
        <option value="Year 8">Year 8</option>
        <option value="Year 9">Year 9</option>
        <option value="Year 10">Year 10</option>
        <option value="Year 11">Year 11</option>
      </select>
      <br />
      <select value={goal} onChange={(e) => setGoal(e.target.value)}>
        <option value="">Select Goal</option>
        <option value="strength">Strength</option>
        <option value="endurance">Endurance</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <br />
      <input
        type="number"
        placeholder="Your Body Weight (kg)"
        value={bodyWeight}
        onChange={(e) => setBodyWeight(e.target.value)}
      />
      <br />
      <button
        onClick={() =>
          onComplete({ studentName: name, yearGroup, goal, bodyWeight })
        }
      >
        Start Game
      </button>
    </div>
  );
}

export default CharacterCreation;