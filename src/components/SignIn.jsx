import React, { useState, useEffect } from "react";
import "./styles/SignIn.css";
import Leaderboard from "./Leaderboard";
import LifetimeSummaryPanel from "./LifetimeSummaryPanel";

function SignIn({ onSignIn }) {
  const [username, setUsername] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("lifetimeSummary");
    if (data) setSummary(JSON.parse(data));
  }, []);

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Student Sign In</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input placeholder="Password" type="password" />
        <button onClick={() => onSignIn(username)}>Sign In</button>
      </div>
      {summary && <LifetimeSummaryPanel username={username || "Player"} summary={summary} />}
      <Leaderboard />
    </div>
  );
}

export default SignIn;
