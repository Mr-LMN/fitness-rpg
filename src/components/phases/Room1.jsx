import React, { useState } from "react";
import MapIntroduction from "../MapIntroduction";

function Room1({ onMapFound }) {
  const [mapFound, setMapFound] = useState(false);

  const handleEscape = () => {
    setMapFound(true); // Trigger map intro
  };

  const handleCloseMapIntro = () => {
    setMapFound(false);
    onMapFound(); // Notify parent component that the map is found
  };

  return (
    <div className="room1-container">
      <h2>Locker Room</h2>
      {!mapFound && <button onClick={handleEscape}>Escape Locker Room</button>}
      {mapFound && <MapIntroduction onClose={handleCloseMapIntro} />}
    </div>
  );
}

export default Room1;