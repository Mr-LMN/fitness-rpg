import React, { useState } from "react";
import WorkoutLogger from "../WorkoutLogger";
import ParallaxDust from "../ParallaxDust";
import { playSound } from "../../utils";
import "../styles/RoomScene.css";
import narrationLines from "../../data/narrationLines";

function Room1({ setGameState, gameState }) {
  const [workoutUploaded, setWorkoutUploaded] = useState(false);
  const [scavengeCompleted, setScavengeCompleted] = useState(false);
  const [foundItem, setFoundItem] = useState(null);
  const [restReady, setRestReady] = useState(false);

  const handleUploadWorkout = () => {
    setWorkoutUploaded(true);
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
      badges: prev.badges.includes("workoutStarter")
        ? prev.badges
        : [...prev.badges, "workoutStarter"],
      annotations: [
        ...prev.annotations,
        {
          room: "Mr. Watkins' Room",
          activity: "Workout uploaded",
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    playSound();
  };

  const handleScavenge = () => {
    const lootItem = "Map Piece #1 (Crumpled School Map)";
    setFoundItem(lootItem);
    setScavengeCompleted(true);
    setRestReady(true);

    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 10,
      inventory: [...(prev.inventory || []), lootItem],
      annotations: [
        ...prev.annotations,
        {
          room: "Mr. Watkins' Room",
          activity: `Found ${lootItem}`,
          timestamp: new Date().toISOString(),
        },
      ],
      visibleRooms: [...prev.visibleRooms, "Mrs. John's Room"],
    }));
    playSound();
  };

  const handleRest = () => {
    setGameState((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + 5,
      completedRooms: [...prev.completedRooms, "Mr. Watkins' Room"],
      currentRoom: null,
      introStage: 5,
      showOverlay: true,
      annotations: [
        ...prev.annotations,
        {
          room: "Mr. Watkins' Room",
          activity: "Rested overnight",
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    playSound();
  };

  return (
    <div className={`room-container ${!workoutUploaded ? "interaction" : ""}`}>
      <img src="/Mr_WatkinsRoom.png" alt="Mr Watkins' Room" className="scene-image" />
      <ParallaxDust />
      <div className="room-content rpg-text">
        <h1>Mr. Watkins' Room</h1>

        {!workoutUploaded && (
          <>
            <p>{narrationLines.room1.intro}</p>
            <WorkoutLogger
              roomNumber={1}
              setGameState={setGameState}
              workoutFocus={gameState.workoutFocus}
              userId={gameState.studentName}
              onComplete={handleUploadWorkout}
              completeLabel="Upload Your Workout"
            />
          </>
        )}

      {workoutUploaded && !scavengeCompleted && (
        <>
          <p>{narrationLines.room1.scavengeIntro}</p>
          <button onClick={handleScavenge}>See Your Scavenging Results</button>
        </>
      )}

      {scavengeCompleted && foundItem && !restReady && (
        <p>{narrationLines.room1.foundItem.replace('{item}', foundItem)}</p>
      )}

        {restReady && (
          <>
            <p>{narrationLines.room1.rest}</p>
            <button onClick={handleRest}>Rest Up for the Night</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Room1;
