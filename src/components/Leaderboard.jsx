import React, { useState } from "react";
import "./Leaderboard.css"; // Add styles for leaderboard visuals

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([
    { name: "Alice", time: 900 },
    { name: "Bob", time: 950 },
    { name: "Charlie", time: 1000 },
  ]);
  const [playerName, setPlayerName] = useState("");
  const [playerTime, setPlayerTime] = useState("");

  const addPlayer = () => {
    const newPlayer = { name: playerName, time: Number(playerTime) };
    const updatedLeaderboard = [...leaderboard, newPlayer].sort(
      (a, b) => a.time - b.time
    );
    setLeaderboard(updatedLeaderboard.slice(0, 10)); // Keep top 10 players
    setPlayerName("");
    setPlayerTime("");
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((player, index) => (
          <li key={index}>
            {index + 1}. {player.name} - {player.time}s
          </li>
        ))}
      </ul>
      <div className="add-player-form">
        <input
          type="text"
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Your Time (seconds)"
          value={playerTime}
          onChange={(e) => setPlayerTime(e.target.value)}
        />
        <button onClick={addPlayer}>Add to Leaderboard</button>
      </div>
    </div>
  );
}

export default Leaderboard;