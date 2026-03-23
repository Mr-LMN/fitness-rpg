import React, { useEffect, useState } from "react";
import ParallaxDust from "../ParallaxDust";
import VideoSlot from "../VideoSlot";
import VideoBackground from "../VideoBackground";
import "../styles/RoomScene.css";
import "./IntroPhase.css";
import { playVoice, playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";

const TITAN_STATUS_LINES = [
  "SECURITY PROTOCOL: ACTIVE",
  "EXITS: SEALED",
  "CAMERAS: ONLINE",
  "THREAT LEVEL: MAXIMUM",
];

function IntroPhase({ setGameState, textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' }) {
  const [videoWatched, setVideoWatched] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (videoWatched) playVoice('/voices/intro-phase.wav');
  }, [videoWatched]);

  // Cycle TITAN status lines
  useEffect(() => {
    if (!videoWatched) return;
    const t = setInterval(() => setStatusIdx((i) => (i + 1) % TITAN_STATUS_LINES.length), 2500);
    return () => clearInterval(t);
  }, [videoWatched]);

  const handleVideoDone = () => setVideoWatched(true);

  const advance = () => {
    playSound("footsteps");
    setGameState((prev) => ({ ...prev, introStage: 1 }));
  };

  return (
    <div className="room-container intro-phase-container">
      <VideoBackground src="/videos/Locker-Room.mp4" fallbackImage="/images/locker-room.png" />
      <ParallaxDust />

      {/* Red lockdown sweep */}
      <div className="intro-lockdown-sweep" aria-hidden="true" />

      <div className="room-content rpg-text">
        {!videoWatched && (
          <div className="intro-video-wrap">
            <VideoSlot
              src="/videos/intro-cinematic.mp4"
              onEnd={handleVideoDone}
              label="TITAN lockdown cinematic"
              poster="/images/locker_Room.png"
            />
          </div>
        )}

        {videoWatched && (
          <>
            {/* TITAN transmission header */}
            <div className="intro-titan-header titan-border">
              <span className="intro-titan-label flicker">⚠ TITAN OVERRIDE ⚠</span>
              <span className="intro-titan-sub">FACILITY LOCKDOWN — ALL EXITS SEALED</span>
            </div>

            {/* Cycling status bar */}
            <div className="intro-status-bar">
              <span className="intro-status-dot" />
              <span className="intro-status-text" key={statusIdx}>
                {TITAN_STATUS_LINES[statusIdx]}
              </span>
            </div>

            <h2 className="phase-heading phase-heading--danger glitch-v2">LOCKDOWN</h2>

            <ScrollingNarrationBox
              lines={narrationLines.general.introPhase}
              autoRead={textToSpeech}
              enhancedMode={enhancedReading}
              readingAge={readingAge}
              speaker="TITAN"
              speakerColor="#ff4444"
              onComplete={advance}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default IntroPhase;
