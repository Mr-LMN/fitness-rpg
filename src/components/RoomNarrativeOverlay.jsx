import React, { useEffect } from "react";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import "./styles/Overlay.css";
import { playSound } from "../utils";
import narrationLines from "../data/narrationLines";
import TTSLine from "./TTSLine";

const avatarIcons = {
  pirate: <GiPirateCaptain />,
  knight: <GiBlackKnightHelm />,
  ninja: <GiNinjaHead />,
};

function RoomNarrativeOverlay({ roomName, avatar, onContinue }) {
  useEffect(() => {
    const audio = playSound('openingDoor');
    return () => audio && audio.pause();
  }, []);
  const introImages = {
    "Mr. Watkins' Room": "/Mr_WatkinsDoor.png",
    "Mrs. John's Room": "/Mrs_JohnsDoor.png",
    "Mrs. Roche's Room": "/Mrs_RochesDoor.png",
  };
  const roomBackgrounds = {
    "Mr. Watkins' Room": "/Mr_WatkinsRoom.png",
    "Mrs. John's Room": "/Mrs_JohnsRoom.png",
    "Mrs. Roche's Room": "/Mrs_RochesRoom.png",
  };
  const lines = narrationLines.general.overlayIntro[roomName] || ["You enter the room…"];

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
        {lines.map((line, index) => (
          <TTSLine key={index} text={line} />
        ))}
        <button
          onClick={() => {
            playSound('creakingDoor');
            onContinue();
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default RoomNarrativeOverlay;
