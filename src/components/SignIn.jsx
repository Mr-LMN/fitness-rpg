import React, { useState } from "react";
import "./styles/SignIn.css";
import Leaderboard from "./Leaderboard";
import LifetimeSummaryPanel from "./LifetimeSummaryPanel";

function SignIn({ onSignIn }) {
  const [username, setUsername] = useState("");
  const [yearGroup, setYearGroup] = useState("Year 7");


  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Pencoedtre High School<br/>Survivor Sign-In</h2>
        <input
          placeholder="Survivor Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input placeholder="Secret Passcode" type="password" />
        <select value={yearGroup} onChange={(e) => setYearGroup(e.target.value)} className="year-select">
          <option value="Year 7">Year 7</option>
          <option value="Year 8">Year 8</option>
          <option value="Year 9">Year 9</option>
          <option value="Year 10">Year 10</option>
          <option value="Year 11">Year 11</option>
        </select>
        <button onClick={() => onSignIn(username)}>Sign In</button>
      </div>
      <LifetimeSummaryPanel userId={username} username={username || "Player"} />
      <Leaderboard yearGroup={yearGroup} />
    </div>
  );
}

export default SignIn;
