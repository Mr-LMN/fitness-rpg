import React, { useState } from "react";
import "./styles/Leaderboard.css";

const sampleStats = [
  { name: "Alice", year: 7, gender: "F", totalWeightMonth: 2200, totalWeightAll: 12000, totalDistanceMonth: 15, totalDistanceAll: 80, bossKillTime: 90 },
  { name: "Bob", year: 8, gender: "M", totalWeightMonth: 3400, totalWeightAll: 20000, totalDistanceMonth: 25, totalDistanceAll: 140, bossKillTime: 110 },
  { name: "Charlie", year: 9, gender: "M", totalWeightMonth: 3000, totalWeightAll: 15000, totalDistanceMonth: 20, totalDistanceAll: 120, bossKillTime: 95 },
  { name: "Daisy", year: 10, gender: "F", totalWeightMonth: 2800, totalWeightAll: 18000, totalDistanceMonth: 30, totalDistanceAll: 200, bossKillTime: 88 },
  { name: "Evan", year: 11, gender: "M", totalWeightMonth: 4100, totalWeightAll: 22000, totalDistanceMonth: 35, totalDistanceAll: 250, bossKillTime: 80 },
];

function Leaderboard() {
  const [year, setYear] = useState("all");
  const [gender, setGender] = useState("all");

  const filtered = sampleStats.filter((p) => {
    const yearMatch = year === "all" || p.year.toString() === year;
    const genderMatch = gender === "all" || p.gender === gender;
    return yearMatch && genderMatch;
  });

  const sortBy = (field, asc = false) => {
    const sorted = [...filtered].sort((a, b) => {
      if (asc) return a[field] - b[field];
      return b[field] - a[field];
    });
    return sorted.slice(0, 5);
  };

  return (
    <div className="leaderboard-container">
      <h2>🏅 Fitness Leaderboard</h2>
      <div className="lb-filters">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="all">All Years</option>
          <option value="7">Year 7</option>
          <option value="8">Year 8</option>
          <option value="9">Year 9</option>
          <option value="10">Year 10</option>
          <option value="11">Year 11</option>
        </select>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="all">All</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
      <div className="lb-grids">
        <div className="lb-section">
          <h3>Weight Lifted (Month)</h3>
          <ol>
            {sortBy("totalWeightMonth").map((p, i) => (
              <li key={i}>{p.name} - {p.totalWeightMonth} kg</li>
            ))}
          </ol>
        </div>
        <div className="lb-section">
          <h3>Weight Lifted (All Time)</h3>
          <ol>
            {sortBy("totalWeightAll").map((p, i) => (
              <li key={i}>{p.name} - {p.totalWeightAll} kg</li>
            ))}
          </ol>
        </div>
        <div className="lb-section">
          <h3>Cardio Distance (Month)</h3>
          <ol>
            {sortBy("totalDistanceMonth").map((p, i) => (
              <li key={i}>{p.name} - {p.totalDistanceMonth} km</li>
            ))}
          </ol>
        </div>
        <div className="lb-section">
          <h3>Cardio Distance (All Time)</h3>
          <ol>
            {sortBy("totalDistanceAll").map((p, i) => (
              <li key={i}>{p.name} - {p.totalDistanceAll} km</li>
            ))}
          </ol>
        </div>
        <div className="lb-section">
          <h3>Fastest Boss Defeat</h3>
          <ol>
            {sortBy("bossKillTime", true).map((p, i) => (
              <li key={i}>{p.name} - {p.bossKillTime}s</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
