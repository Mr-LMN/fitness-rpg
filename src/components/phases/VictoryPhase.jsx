import React, { useEffect, useMemo, useState } from "react";
import { playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";
import VideoSlot from "../VideoSlot";
import { questById } from "../../data/questDeck";
import ParallaxDust from "../ParallaxDust";
import "../styles/RoomScene.css";
import "./VictoryPhase.css";

const BADGE_LABELS = {
  workoutStarter:   '🏋 First Rep',
  workoutTrio:      '🔥 Trio Done',
  workoutQuint:     '⚡ Quint Achieved',
  warmupChampion:   '🚣 Warmup Champion',
  strengthCaptain:  '💪 Strength Captain',
  ks3Polyglot:      '🌍 KS3 Polyglot',
  arenaChampion:    '🏆 Arena Champion',
  bossVanquisher:   '👑 Boss Vanquisher',
  speedRunner:      '⚡ Speed Runner',
  topTen:           '🥇 Top Ten',
  lockerEscapee:    '🔓 Locker Escapee',
};

function VictoryPhase({ gameState }) {
  const [videoWatched, setVideoWatched] = useState(false);
  const [showStats, setShowStats]       = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const { textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' } = gameState;

  useEffect(() => {
    if (showStats) {
      playSound('victoryFanfare');
      setTimeout(() => setStatsVisible(true), 200);
    }
  }, [showStats]);

  const completedQuests = useMemo(
    () => (gameState.completedQuests || []).map((id) => questById[id]).filter(Boolean),
    [gameState.completedQuests]
  );

  const lifetime = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('lifetimeSummary') || '{}'); }
    catch { return {}; }
  }, []);

  // ── Victory video ─────────────────────────────────────────────────────────
  if (!videoWatched) {
    return (
      <div className="victory-video-page">
        <img src="/images/FitnessSuite.png" alt="Victory" className="victory-video-bg" />
        <div className="victory-video-wrap">
          <VideoSlot
            src="/videos/victory.mp4"
            onEnd={() => setVideoWatched(true)}
            poster="/images/Victory.png"
            label="Victory cutscene"
          />
        </div>
      </div>
    );
  }

  // ── Narration ─────────────────────────────────────────────────────────────
  if (!showStats) {
    return (
      <div className="room-container">
        <img src="/images/FitnessSuite.png" alt="Victory" className="scene-image" />
        <ParallaxDust />
        <div className="room-content rpg-text">
          <h2 className="phase-heading phase-heading--success victory-burst">TITAN DEFEATED</h2>
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

  // ── Stats ─────────────────────────────────────────────────────────────────
  const STATS = [
    { val: gameState.xp || 0,                         lbl: 'Total XP',     delay: 0.1 },
    { val: gameState.badges?.length || 0,              lbl: 'Badges',        delay: 0.2 },
    { val: lifetime.totalWorkouts || 0,               lbl: 'Workouts',      delay: 0.3 },
    { val: (gameState.completedRooms || []).length,   lbl: 'Rooms Cleared', delay: 0.4 },
  ];

  return (
    <div className="room-container">
      <img src="/images/FitnessSuite.png" alt="Victory" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <div className={`victory-panel ${statsVisible ? 'victory-panel-visible' : ''}`}>
          <h2 className="victory-title victory-burst">🏆 MISSION COMPLETE</h2>
          <p className="victory-subtitle">Chapter 1: Lockdown — Cleared</p>

          <div className="victory-stats stagger">
            {STATS.map((s) => (
              <div
                key={s.lbl}
                className="victory-stat stat-reveal"
                style={{ animationDelay: `${s.delay}s` }}
              >
                <span className="victory-stat-val">{s.val}</span>
                <span className="victory-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>

          {gameState.badges?.length > 0 && (
            <div className="victory-section slide-in-left" style={{ animationDelay: '0.5s' }}>
              <h3 className="victory-section-title">Badges Earned</h3>
              <div className="victory-badge-list">
                {gameState.badges.map((b, i) => (
                  <span key={i} className="victory-badge-chip">{BADGE_LABELS[b] || b}</span>
                ))}
              </div>
            </div>
          )}

          {completedQuests.length > 0 && (
            <div className="victory-section slide-in-right" style={{ animationDelay: '0.6s' }}>
              <h3 className="victory-section-title">Quests Completed</h3>
              <ul className="victory-quest-list">
                {completedQuests.map((quest) => (
                  <li key={quest.id}>✓ {quest.title}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="victory-teaser">
            <div className="victory-teaser-inner titan-border">
              <p className="victory-teaser-label flicker">📡 INCOMING TRANSMISSION</p>
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
