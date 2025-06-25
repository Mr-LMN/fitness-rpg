import React, { useState, useEffect } from "react";
import BadgeCase from "./BadgeCase";
import "./styles/Map.css";
import { GiBackpack } from "react-icons/gi";
import InventoryModal from "./InventoryModal";
// inside your component, before return():
useEffect(() => {
  const container = document.querySelector('.map-container');
  if (!container) return;
  const onClick = e => {
    const rect = container.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    console.log(`📍 clicked at: { x: ${x}, y: ${y} }`);
  };
  container.addEventListener('click', onClick);
  return () => container.removeEventListener('click', onClick);
}, []);


const allRooms = [
  // Coordinates adjusted for container offset
  { name: "Mr. Watkins' Room", x: 196, y: 139 },
  { name: "Mrs. John's Room",  x: 394, y: 115 },
  { name: "Mrs. Roche's Room", x: 399, y: 229 },
  { name: "Fitness Suite",     x: 395, y: 307 },
];

const mockInventory = [
  { id: "milkshake", name: "Chocolate Milkshake", description: "Use before your next workout to boost total weight lifted by 10%", type: "boost", effect: { workoutBoost: 0.1 }, used: false },
  { id: "skipper", name: "Puzzle Skipper", description: "Skips one quiz event", type: "skip", effect: { skipQuiz: true }, used: true }
];


function PamphletMap({ gameState, setGameState }) {
  const {
    currentRoom = "",
    completedRooms = [],
    visibleRooms = [],
    annotations = [],
  } = gameState;

  const [dynamicRooms, setDynamicRooms] = useState([]);
  const [showBadges, setShowBadges] = useState(false);

const [showInventory, setShowInventory] = useState(false);
  const [inventory, setInventory] = useState(mockInventory);
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

  const handleUseItem = (id) => {
    setInventory(prev => prev.map(it => it.id === id ? { ...it, used: true } : it));
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
      <button className="badge-button" onClick={() => setShowBadges(true)}>
        View Badges
      </button>
      <button className="inventory-button" onClick={() => setShowInventory(true)} aria-label="Open Inventory">
        <GiBackpack />
      </button>
      {showBadges && (
        <BadgeCase badges={gameState.badges} onClose={() => setShowBadges(false)} />
      )}
      {showInventory && (
        <InventoryModal items={inventory} onUse={handleUseItem} onClose={() => setShowInventory(false)} />
      )}
    </div>
  );
}

export default PamphletMap;
