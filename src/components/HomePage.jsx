 import React from "react";
import "./styles/HomePage.css";
import logo from "/pencoedtre_high_logo.svg";

function HomePage({ onStart }) {
  return (
    <div className="home-page">
      <div className="homepage-content">
        <img src={logo} alt="Pencoedtre High Logo" className="school-logo" />
        <h1 className="game-title">Fitness RPG</h1>
        <p className="game-description">Begin your adventure to fitness glory.</p>
      </div>
      <button onClick={onStart} className="start-btn">Start</button>
    </div>
  );
}

export default HomePage;
