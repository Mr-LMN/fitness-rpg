import React, { useState, useEffect, useMemo } from "react";
import BadgeCase from "./BadgeCase";
import { GiBackpack } from "react-icons/gi";
import InventoryModal from "./InventoryModal";
import "./styles/Map.css";
import { questById } from "../data/questDeck";

const allRooms = [
  // Coordinates are relative to the map container (offset corrected)
  { name: "Mr. Watkins' Room", x: 196, y: 139 },
  { name: "Mrs. John's Room", x: 394, y: 115 },
  { name: "Mrs. Roche's Room", x: 399, y: 229 },
  { name: "Fitness Suite", x: 395, y: 307 },
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

  const questTargets = useMemo(() => {
    const active = new Set();
    (gameState.activeQuests || []).forEach((id) => {
      const room = questById[id]?.criteria?.room;
      if (room) {
        active.add(room);
      }
    });
    return active;
  }, [gameState.activeQuests]);

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
            className={`room ${room.status} ${
              room.status === "fogged" ? "flicker" : ""
            } ${questTargets.has(room.name) ? "quest-target" : ""}`}
            style={{ top: `${room.y}px`, left: `${room.x}px` }}
            onClick={() => handleRoomClick(room.name)}
          >
            {room.status !== "fogged" ? (
              <>
                <span>{room.name}</span>
                {questTargets.has(room.name) && (
                  <span className="quest-icon" aria-label="Quest objective">
                    ⭐ Quest Objective
                  </span>
                )}
              </>
            ) : (
              "?"
            )}
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
        Quest icons highlight tabletop encounters that advance your campaign.
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
