import React, { useState, useEffect } from "react";
import "./styles/Map.css"; // Updated path to Map.css

const rooms = [
  { name: "Locker Room", x: 50, y: 200, status: "completed" },
  { name: "Mr. Watkins' Room", x: 150, y: 100, status: "locked" },
  { name: "Mrs. John's Room", x: 300, y: 200, status: "locked" },
  { name: "Mrs. Roche's Room", x: 450, y: 100, status: "locked" },
  { name: "Fitness Suite", x: 600, y: 200, status: "locked" },
];

function Map({ currentRoom, completedRooms, annotations }) {
  const [dynamicRooms, setDynamicRooms] = useState(rooms);

  useEffect(() => {
    const updatedRooms = rooms.map((room) => {
      if (completedRooms.includes(room.name)) {
        return { ...room, status: "completed" };
      }
      if (room.name === currentRoom) {
        return { ...room, status: "current" };
      }
      return room; // Default to locked
    });
    setDynamicRooms(updatedRooms);
  }, [currentRoom, completedRooms]);

  return (
    <div className="map">
      {/* Render Rooms */}
      {dynamicRooms.map((room, index) => (
        <div
          key={index}
          className={`room ${room.status}`}
          style={{ top: `${room.y}px`, left: `${room.x}px` }}
        >
          {room.name}
        </div>
      ))}

      {/* Render Annotations */}
      {annotations.map((annotation, index) => (
        <div
          key={index}
          className="annotation"
          style={{ top: `${annotation.y}px`, left: `${annotation.x}px` }}
        >
          {annotation.text}
        </div>
      ))}
    </div>
  );
}

export default Map;