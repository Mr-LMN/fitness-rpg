import React, { useEffect, useMemo, useState } from "react";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";
import { questById } from "../../data/questDeck";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";

function VictoryPhase({ gameState }) {
  const [showStats, setShowStats] = useState(false);
  const { textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' } = gameState;

  useEffect(() => {
    playSound('xpLevel');
  }, []);

  const completedQuests = useMemo(
    () =>
      (gameState.completedQuests || [])
        .map((id) => questById[id])
        .filter(Boolean),
    [gameState.completedQuests]
  );

  const lifetime = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('lifetimeSummary') || '{}');
    } catch { return {}; }
  }, []);

  if (!showStats) {
    return (
      <div className="room-container">
        <img src="/images/FitnessSuite.png" alt="Victory" className="scene-image" />
        <ParallaxDust />
        <div className="room-content rpg-text">
          <h2 className="phase-heading phase-heading--success">TITAN DEFEATED</h2>
          <ScrollingNarrationBox
            lines={narrationLines.victory}
            autoRead={textToSpeech}
            enhancedMode={enhancedReading}
            readingAge={readingAge}
            onComplete={() => setShowStats(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="room-container">
      <img src="/images/FitnessSuite.png" alt="Victory" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <div className="victory-panel">
          <h2 className="victory-title">MISSION COMPLETE</h2>
          <p className="victory-subtitle">Chapter 1: Lockdown — Cleared</p>

          {/* Stats grid */}
          <div className="victory-stats">
            <div className="victory-stat">
              <span className="victory-stat-val">{gameState.xp || 0}</span>
              <span className="victory-stat-lbl">Total XP</span>
            </div>
            <div className="victory-stat">
              <span className="victory-stat-val">{gameState.badges?.length || 0}</span>
              <span className="victory-stat-lbl">Badges</span>
            </div>
            <div className="victory-stat">
              <span className="victory-stat-val">{lifetime.totalWorkouts || 0}</span>
              <span className="victory-stat-lbl">Workouts</span>
            </div>
            <div className="victory-stat">
              <span className="victory-stat-val">{(gameState.completedRooms || []).length}</span>
              <span className="victory-stat-lbl">Rooms Cleared</span>
            </div>
          </div>

          {/* Badges */}
          {gameState.badges?.length > 0 && (
            <div className="victory-section">
              <h3 className="victory-section-title">Badges Earned</h3>
              <div className="victory-badge-list">
                {gameState.badges.map((b, i) => (
                  <span key={i} className="victory-badge-chip">{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Quests */}
          {completedQuests.length > 0 && (
            <div className="victory-section">
              <h3 className="victory-section-title">Quests Completed</h3>
              <ul className="victory-quest-list">
                {completedQuests.map((quest) => (
                  <li key={quest.id}>{quest.title}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Chapter 2 teaser */}
          <div className="victory-teaser">
            <div className="victory-teaser-inner">
              <p className="victory-teaser-label">INCOMING TRANSMISSION</p>
              <p className="victory-teaser-text">
                "PHASE 1 COMPLETE. PHASE 2 LOADING...<br/>
                THE MATHS DEPARTMENT AWAITS."
              </p>
              <p className="victory-teaser-hint">Chapter 2 — Coming Soon</p>
            </div>
          </div>

          <div className="victory-actions">
            <button className="primary-btn" onClick={() => window.location.reload()}>
              Return to Base
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VictoryPhase;
