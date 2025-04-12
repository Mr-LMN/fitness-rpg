import React from "react";

function Room1({ setGameState, gameState }) {
  const handleContinue = () => {
    // Log the workout and transition to the next room
    setGameState((prev) => ({
      ...prev,
      annotations: [
        ...prev.annotations,
        {
          room: "Mr. Watkins' Room",
          activity: "Workout completed",
          timestamp: new Date().toISOString(),
        },
      ],
      completedRooms: [...prev.completedRooms, "Mr. Watkins' Room"],
      currentRoom: "Mrs. John's Room", // Move to Room2
    }));
  };

  return (
    <div>
      <h1>Mr. Watkins' Room</h1>
      <p>You have entered Mr. Watkins' classroom. It's eerily quiet.</p>
      <p>Dust floats in the light. Papers are scattered across the desks.</p>
      <p>You step inside, unsure if you're alone...</p>

      {/* Display current game progress */}
      <div>
        <h3>Game Progress:</h3>
        <ul>
          {gameState.completedRooms.map((room, index) => (
            <li key={index}>{room}</li>
          ))}
        </ul>
      </div>

      <button onClick={handleContinue}>Continue</button>
    </div>
  );
}

export default Room1;