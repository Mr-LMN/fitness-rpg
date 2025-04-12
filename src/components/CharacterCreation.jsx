function CharacterCreation({ gameState, setGameState }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>🎮 Character Creation</h2>
      <input
        placeholder="Name"
        value={gameState.studentName || ""}
        onChange={(e) => setGameState({ ...gameState, studentName: e.target.value })}
      />
      <br />
      <select
        value={gameState.yearGroup || ""}
        onChange={(e) => setGameState({ ...gameState, yearGroup: e.target.value })}
      >
        <option value="">Select Year Group</option>
        <option value="Year 7">Year 7</option>
        <option value="Year 8">Year 8</option>
        <option value="Year 9">Year 9</option>
        <option value="Year 10">Year 10</option>
        <option value="Year 11">Year 11</option>
      </select>
      <br />
      <select
        value={gameState.goal || ""}
        onChange={(e) => setGameState({ ...gameState, goal: e.target.value })}
      >
        <option value="">Select Goal</option>
        <option value="strength">Strength</option>
        <option value="endurance">Endurance</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <br />
      <input
        type="number"
        placeholder="Your Body Weight (kg)"
        value={gameState.bodyWeight || ""}
        onChange={(e) => setGameState({ ...gameState, bodyWeight: +e.target.value })}
      />
      <br />
      <button onClick={() => setGameState({ ...gameState, characterCreated: true })}>
        Start Game
      </button>
    </div>
  );
}

export default CharacterCreation;