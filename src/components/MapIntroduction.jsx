import React from "react";
import ParallaxDust from "./ParallaxDust";
import "./styles/RoomScene.css";
import { playSound } from "../utils";
import narrationLines from "../data/narrationLines";
import ScrollingNarrationBox from "./ScrollingNarrationBox";

function MapIntroduction({ setGameState }) {
  const handleViewMap = () => {
    if (typeof setGameState !== "function") {
      console.error("setGameState is not a function. Please check the props passed to MapIntroduction.");
      return;
    }

    setGameState((prev) => ({
      ...prev,
      introStage: 5, // Transition to map view stage
      visibleRooms: [...prev.visibleRooms, "Mr. Watkins' Room"], // Safely add "Mr. Watkins' Room"
    }));
    playSound();
  };

  return (
    <div className="room-container">
      <img
        src="/Leaving_the_LockerRoom.png"
        alt="Leaving the Locker Room"
        className="scene-image"
      />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2>🎒 A New Beginning</h2>
        <ScrollingNarrationBox
          lines={narrationLines.general.mapIntroduction}
          onComplete={handleViewMap}
        />
      </div>
    </div>
  );
}

export default MapIntroduction;