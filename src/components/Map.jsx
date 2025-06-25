import React, { useState, useEffect } from "react";
import BadgeCase from "./BadgeCase";
import { GiBackpack } from "react-icons/gi";
import InventoryModal from "./InventoryModal";
import "./styles/Map.css";

const allRooms = [
  { name: "Mr. Watkins' Room", x: 536, y: 379 },
  { name: "Mrs. John's Room", x: 734, y: 355 },
  { name: "Mrs. Roche's Room", x: 739, y: 469 },
  { name: "Fitness Suite", x: 735, y: 547 },
];

function Map({ gameState, setGameState }) {
  const {
    currentRoom = "",
    completedRooms = [],
    visibleRooms = [],
    annotations = [],
  } = gameState;

  const [dynamicRooms, setDynamicRooms] = useState([]);
  const [showBadges, setShowBadges] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

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
    setGameState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((it) =>
        it.id === id ? { ...it, used: true } : it
      ),
    }));
  };

  const handleCloseInventory = () => {
    setShowInventory(false);
    setGameState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((it) => ({ ...it, isNew: false })),
    }));
  };

  return (
    <div className="map-container">
      <h2 className="map-title">🗺️ School Map</h2>
      <div className="map">
        <img src="/Pamphletmap.png" alt="School Map Pamphlet" className="map-background" />
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
      <button
        className="inventory-button"
        aria-label="Open Inventory"
        onClick={() => setShowInventory(true)}
      >
        <GiBackpack />
      </button>
      {showBadges && (
        <BadgeCase badges={gameState.badges} onClose={() => setShowBadges(false)} />
      )}
      {showInventory && (
        <InventoryModal
          items={gameState.inventory}
          onUse={handleUseItem}
          onClose={handleCloseInventory}
        />
      )}
    </div>
  );
}

export default Map;
