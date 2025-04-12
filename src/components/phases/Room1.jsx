import React, { useState } from "react";
import WorkoutLogger from "../WorkoutLogger";

function Room1({ setGameState, gameState }) {
  const [workoutUploaded, setWorkoutUploaded] = useState(false);
  const [scavengeCompleted, setScavengeCompleted] = useState(false);
  const [foundItem, setFoundItem] = useState(null);

  const handleUploadWorkout = () => {
    setWorkoutUploaded(true);
    setGameState((prev) => ({
      ...prev,
      annotations: [
        ...prev.annotations,
        {
          room: "Mr. Watkins' Room",
          activity: "Workout uploaded",
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  };

  const handleScavenge = () => {
    const lootItem = "Crumpled School Map";
    setFoundItem(lootItem);
    setScavengeCompleted(true);

    setGameState((prev) => ({
      ...prev,
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
  };

  const handleRest = () => {
    setGameState((prev) => ({
      ...prev,
      completedRooms: [...prev.completedRooms, "Mr. Watkins' Room"],
      currentRoom: null,
      introStage: 5, // Clearly move back to the Map component
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
  };
  

  return (
    <div className="room-container">
      <h1>Mr. Watkins' Room</h1>
      {!workoutUploaded && (
        <>
          <p>You cautiously enter Mr. Watkins' classroom. The eerie silence provides the perfect atmosphere to log your workout.</p>
          <WorkoutLogger roomNumber={1} setGameState={setGameState} />
          <button onClick={handleUploadWorkout}>Upload Your Workout</button>
        </>
      )}

      {workoutUploaded && !scavengeCompleted && (
        <>
          <p>Workout uploaded successfully! Let's see what useful items you can find around here.</p>
          <button onClick={handleScavenge}>See Your Scavenging Results</button>
        </>
      )}

      {scavengeCompleted && foundItem && (
        <>
          <p>Success! You've found a <strong>{foundItem}</strong>. The map reveals previously hidden locations, including Mrs. John's Room.</p>
          <p>It's been a long day. You decide it’s safest to rest here tonight and consider your next move in the morning.</p>
          <button onClick={handleRest}>Rest Up for the Night</button>
        </>
      )}
    </div>
  );
}

export default Room1;
