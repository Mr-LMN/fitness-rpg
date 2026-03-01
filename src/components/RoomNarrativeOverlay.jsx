import React, { useEffect } from "react";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import "./styles/Overlay.css";
import { playSound } from "../utils";
import narrationLines from "../data/narrationLines";
import ScrollingNarrationBox from "./ScrollingNarrationBox";

const avatarIcons = {
  pirate: <GiPirateCaptain />,
  knight: <GiBlackKnightHelm />,
  ninja: <GiNinjaHead />,
};

function RoomNarrativeOverlay({
  roomName,
  avatar,
  onContinue,
  textToSpeech = false,
  enhancedReading = false,
  readingAge = 'not-sure',
}) {
  useEffect(() => {
    const audio = playSound('openingDoor');
    return () => audio && audio.pause();
  }, []);
  const introImages = {
    "Mr. Watkins' Room": "/images/Mr_WatkinsDoor.png",
    "Mrs. John's Room": "/images/Mrs_JohnsDoor.png",
    "Mrs. Roche's Room": "/images/Mrs_RochesDoor.png",
  };
  const roomBackgrounds = {
    "Mr. Watkins' Room": "/images/Mr_WatkinsRoom.png",
    "Mrs. John's Room": "/images/Mrs_JohnsRoom.png",
    "Mrs. Roche's Room": "/images/Mrs_RochesRoom.png",
  };
  // overlayIntro[roomName] is now a tiered object { rich:[...], standard:[...], ... }
  // ScrollingNarrationBox → adaptNarrative handles tier selection via readingAge
  const rawLines = narrationLines.general.overlayIntro[roomName] || ["You enter the room..."];
  const lines = rawLines;

  return (
    <div
      className="overlay-bg"
      style={{
        backgroundImage: `url(${roomBackgrounds[roomName] || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'multiply',
      }}
    >
      <div className="overlay-box">
        {introImages[roomName] && (
          <img
            src={introImages[roomName]}
            alt={roomName}
            className="overlay-image"
          />
        )}
        {avatar && <div className="overlay-avatar">{avatarIcons[avatar]}</div>}
        <ScrollingNarrationBox
          lines={lines}
          autoRead={textToSpeech}
          enhancedMode={enhancedReading}
          readingAge={readingAge}
          onComplete={() => {
            playSound('creakingDoor');
            onContinue();
          }}
        />
      </div>
    </div>
  );
}

export default RoomNarrativeOverlay;
