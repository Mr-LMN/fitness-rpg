import React, { useState, useEffect } from "react";
import "./styles/Map.css";

const allRooms = [
  { name: "Locker Room", x: 50, y: 200 },
  { name: "Mr. Watkins' Room", x: 150, y: 100 },
  { name: "Mrs. John's Room", x: 300, y: 200 },
  { name: "Mrs. Roche's Room", x: 450, y: 100 },
  { name: "Fitness Suite", x: 600, y: 200 },
];

function Map({ gameState, setGameState }) {
  const {
    currentRoom = "",
    completedRooms = [],
    visibleRooms = [],
    annotations = [],
  } = gameState;

  const [dynamicRooms, setDynamicRooms] = useState([]);

  useEffect(() => {
    const updatedRooms = allRooms.map((room) => {
      let status = "fogged";
      if (completedRooms.includes(room.name)) status = "cleared";
      else if (room.name === currentRoom) status = "current";
      else if (visibleRooms.includes(room.name)) status = "visible";
      return { ...room, status };
    });
    setDynamicRooms(updatedRooms);
  }, [currentRoom, completedRooms, visibleRooms]);

  const handleRoomClick = (roomName) => {
    if (visibleRooms.includes(roomName)) {
      setGameState((prev) => ({
        ...prev,
        currentRoom: roomName,
        introStage: 6,
        showOverlay: true,
      }));
    }
  };

  return (
    <div className="map-container">
      <h2 className="map-title">🗺️ School Map</h2>
      <div className="map">
        {dynamicRooms.map((room, index) => (
          <div
            key={index}
            className={`room ${room.status} ${room.status === "fogged" ? "flicker" : ""}`}
            style={{ top: `${room.y}px`, left: `${room.x}px` }}
            onClick={() => handleRoomClick(room.name)}
          >
            {room.status !== "fogged" ? room.name : "?"}
          </div>
        ))}

        {(annotations || []).map((annotation, index) => (
          <div
            key={index}
            className="annotation"
            style={{ top: `${annotation.y}px`, left: `${annotation.x}px` }}
          >
            {annotation.text}
          </div>
        ))}
      </div>
      <p className="map-instructions">
        🔍 Click on any visible room to investigate. Rooms will reveal themselves as you explore!
      </p>
    </div>
  );
}

export default Map;
