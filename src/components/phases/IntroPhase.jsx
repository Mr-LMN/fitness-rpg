import React, { useEffect, useState } from "react";
import ParallaxDust from "../ParallaxDust";
import VideoSlot from "../VideoSlot";
import VideoBackground from "../VideoBackground";
import "../styles/RoomScene.css";
import "./IntroPhase.css";
import { playVoice, playSound } from "../../utils";
import narrationLines from "../../data/narrationLines";
import ScrollingNarrationBox from "../ScrollingNarrationBox";

function IntroPhase({ setGameState, textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' }) {
  const [videoWatched, setVideoWatched] = useState(false);

  useEffect(() => {
    // Voice-over starts after any intro video ends
    if (videoWatched) playVoice('/voices/intro-phase.wav');
  }, [videoWatched]);

  const handleVideoDone = () => setVideoWatched(true);

  const advance = () => {
    playSound("footsteps");
    setGameState((prev) => ({ ...prev, introStage: 1 }));
  };

  return (
    <div className="room-container intro-phase-container">
      {/* Background scene */}
      <VideoBackground src="/videos/Locker-Room.mp4" fallbackImage="/images/locker-room.png" />
      <ParallaxDust />

      {/* Red lockdown sweep */}
      <div className="intro-lockdown-sweep" aria-hidden="true" />

      <div className="room-content rpg-text">
        {/* ── Intro cinematic video (upload /videos/intro-cinematic.mp4) ── */}
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

        {/* ── Narration (shown after video or immediately if video missing) ── */}
        {videoWatched && (
          <>
            {/* TITAN transmission header */}
            <div className="intro-titan-header titan-border">
              <span className="intro-titan-label flicker">⚠ TITAN OVERRIDE ⚠</span>
              <span className="intro-titan-sub">FACILITY LOCKDOWN — ALL EXITS SEALED</span>
            </div>

            <h2 className="phase-heading phase-heading--danger">LOCKDOWN</h2>

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
