import React, { useState } from "react";
import WorkoutLogger from "../WorkoutLogger";
import ParallaxDust from "../ParallaxDust";
import { playSound } from "../../utils";
import "../styles/RoomScene.css";

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
            <p>You cautiously enter the abandoned classroom. The stale air and dust hint that no one has been here for a while. It's the perfect moment to focus and log your workout.</p>
            <WorkoutLogger
              roomNumber={1}
              setGameState={setGameState}
              workoutFocus={gameState.workoutFocus}
            />
            <button onClick={handleUploadWorkout}>Upload Your Workout</button>
          </>
        )}

      {workoutUploaded && !scavengeCompleted && (
        <>
          <p>With your body re-energized, you notice something odd under a pile of worksheets. You kneel to investigate...</p>
          <button onClick={handleScavenge}>See Your Scavenging Results</button>
        </>
      )}

      {scavengeCompleted && foundItem && !restReady && (
        <p>You pocket the <strong>{foundItem}</strong>. It shows another room labeled "Mrs. John's Room" – previously unknown. A breakthrough!</p>
      )}

        {restReady && (
          <>
            <p>Feeling the fatigue set in, you choose to rest in a safe corner. Tomorrow, you'll explore the newly revealed room.</p>
            <button onClick={handleRest}>Rest Up for the Night</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Room1;
