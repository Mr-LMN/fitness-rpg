import React from "react";

function Room1({ setGameState }) {
  const handleContinue = () => {
    setGameState((prev) => ({
      ...prev,
      completedRooms: [...prev.completedRooms, "Mr. Watkins' Room"],
      currentRoom: null,
      introStage: 7,
    }));
  };

  return (
    <div>
      <h1>Mr. Watkins' Room</h1>
      <p>You have entered Mr. Watkins' classroom. It's eerily quiet.</p>
      <p>Dust floats in the light. Papers are scattered across the desks.</p>
      <p>You step inside, unsure if you're alone...</p>
      <button onClick={handleContinue}>Continue</button>
    </div>
  );
}

export default Room1;