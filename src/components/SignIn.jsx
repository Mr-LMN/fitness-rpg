import React from "react";
import "./styles/SignIn.css";
import Leaderboard from "./Leaderboard";

function SignIn({ onSignIn }) {
  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Student Sign In</h2>
        <input placeholder="Username" />
        <input placeholder="Password" type="password" />
        <button onClick={onSignIn}>Sign In</button>
      </div>
      <Leaderboard />
    </div>
  );
}

export default SignIn;
