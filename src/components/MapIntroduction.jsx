import React from "react";
import ParallaxDust from "./ParallaxDust";
import VideoBackground from "./VideoBackground";
import "./styles/RoomScene.css";
import { playSound } from "../utils";
import narrationLines from "../data/narrationLines";
import ScrollingNarrationBox from "./ScrollingNarrationBox";

function MapIntroduction({ setGameState, textToSpeech = false, enhancedReading = false, readingAge = 'not-sure' }) {
  const handleViewMap = () => {
    if (typeof setGameState !== "function") return;

    setGameState((prev) => ({
      ...prev,
      introStage: 5,
      visibleRooms: [...prev.visibleRooms, "Mr. Watkins' Room"],
    }));
    playSound();
  };

  return (
    <div className="room-container">
      <VideoBackground src="/videos/Map-Screen.mp4" fallbackImage="/images/map-screen.png" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h2 className="phase-heading">MISSION BRIEFING</h2>
        <ScrollingNarrationBox
          lines={narrationLines.general.mapIntroduction}
          autoRead={textToSpeech}
          enhancedMode={enhancedReading}
          readingAge={readingAge}
          onComplete={handleViewMap}
        />
      </div>
    </div>
  );
}

export default MapIntroduction;
