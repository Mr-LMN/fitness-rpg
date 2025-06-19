import React from "react";
import "./styles/HomePage.css";
import logo from "/pencoedtre_high_logo.svg";

function HomePage({ onStart }) {
  return (
    <div className="home-page">
      <img src={logo} alt="Pencoedtre High Logo" className="school-logo" />
      <h1>Fitness RPG</h1>
      <p>Begin your adventure to fitness glory.</p>
      <button onClick={onStart} className="start-btn">Start</button>
    </div>
  );
}

export default HomePage;
