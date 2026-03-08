import React, { useEffect, useState } from "react";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import "./styles/Overlay.css";
import VideoSlot from "./VideoSlot";
import VideoBackground from "./VideoBackground";
import { playSound } from "../utils";
import narrationLines from "../data/narrationLines";
import ScrollingNarrationBox from "./ScrollingNarrationBox";

const avatarIcons = {
  pirate: <GiPirateCaptain />,
  knight: <GiBlackKnightHelm />,
  ninja: <GiNinjaHead />,
};

// Room-specific config: door images, room backgrounds, video paths, teacher portrait paths
const ROOM_CONFIG = {
  "Mr. Watkins' Room": {
    doorImage:       '/images/Mr_WatkinsDoor.png',
    background:      '/images/Mr_WatkinsRoom.png',
    introVideo:      '/videos/watkins-intro.mp4',
    teacherPortrait: '/images/teachers/mr-watkins-portrait.png',
    speakerName:     'Mr. Watkins',
    speakerColor:    '#60a5fa',  // blue
    accentColor:     '#1e40af',
  },
  "Mrs. John's Room": {
    doorImage:       '/images/Mrs_JohnsDoor.png',
    background:      '/images/Mrs_JohnsRoom.png',
    introVideo:      '/videos/john-intro.mp4',
    teacherPortrait: '/images/teachers/mrs-john-portrait.png',
    speakerName:     'Mrs. John',
    speakerColor:    '#a78bfa',  // purple
    accentColor:     '#5b21b6',
  },
  "Mrs. Roche's Room": {
    doorImage:       '/images/Mrs_RochesDoor.png',
    background:      '/images/Mrs_RochesRoom.png',
    introVideo:      '/videos/roche-intro.mp4',
    teacherPortrait: '/images/teachers/mrs-roche-portrait.png',
    speakerName:     'Mrs. Roche',
    speakerColor:    '#f87171',  // red — controlled by TITAN
    accentColor:     '#991b1b',
  },
};

function RoomNarrativeOverlay({
  roomName,
  avatar,
  onContinue,
  textToSpeech    = false,
  enhancedReading = false,
  readingAge      = 'not-sure',
}) {
  const [videoWatched, setVideoWatched] = useState(false);
  const config = ROOM_CONFIG[roomName] || {};

  useEffect(() => {
    const audio = playSound('openingDoor');
    return () => audio && audio.pause();
  }, []);

  const rawLines = narrationLines.general.overlayIntro[roomName] || ["You enter the room..."];
  const accentBorder = config.accentColor
    ? `1px solid ${config.accentColor}66`
    : '1px solid rgba(255,255,255,0.08)';

  const isBossRoom = roomName === "Mrs. Roche's Room";

  return (
    <div
      className="overlay-bg"
      style={{
        ...(!isBossRoom && {
          backgroundImage: `url(${config.background || ''})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
        }),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isBossRoom && (
        <VideoBackground src="/videos/Boss-Intro.mp4" fallbackImage="/images/mrs-roches-room.png" />
      )}
      <div className="overlay-box" style={{ border: accentBorder, boxShadow: config.accentColor ? `0 0 40px ${config.accentColor}33, 0 24px 64px rgba(0,0,0,0.7)` : undefined, position: 'relative', zIndex: 1 }}>

        {/* ── Room intro video (optional) ── */}
        {!videoWatched && config.introVideo && (
          <VideoSlot
            src={config.introVideo}
            onEnd={() => setVideoWatched(true)}
            poster={config.doorImage}
            label={`${roomName} intro`}
            style={{ marginBottom: 12 }}
          />
        )}

        {/* ── Door image (shown if no video) ── */}
        {!videoWatched && !config.introVideo && config.doorImage && (
          <img
            src={config.doorImage}
            alt={roomName}
            className="overlay-image"
          />
        )}

        {/* ── Teacher portrait (shown when narration is active) ── */}
        {(videoWatched || !config.introVideo) && (
          <div className="overlay-teacher-row">
            {config.teacherPortrait && (
              <img
                src={config.teacherPortrait}
                alt={config.speakerName || roomName}
                className="overlay-teacher-portrait"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            {/* Fallback: show avatar icon if teacher portrait not found */}
            {!config.teacherPortrait && avatar && (
              <div className="overlay-avatar">{avatarIcons[avatar]}</div>
            )}

            <div className="overlay-room-badge" style={config.accentColor ? { borderColor: `${config.accentColor}66`, background: `${config.accentColor}14` } : undefined}>
              <span className="overlay-room-name">{roomName}</span>
            </div>
          </div>
        )}

        {/* ── Narration box ── */}
        {(videoWatched || !config.introVideo) && (
          <ScrollingNarrationBox
            lines={rawLines}
            autoRead={textToSpeech}
            enhancedMode={enhancedReading}
            readingAge={readingAge}
            speaker={config.speakerName}
            speakerColor={config.speakerColor}
            onComplete={() => {
              playSound('creakingDoor');
              onContinue();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default RoomNarrativeOverlay;
