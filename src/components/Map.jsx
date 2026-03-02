import React, { useState, useEffect, useMemo } from "react";
import BadgeCase from "./BadgeCase";
import InventoryModal from "./InventoryModal";
import Leaderboard from "./Leaderboard";
import { GiBackpack } from "react-icons/gi";
import { FaTrophy } from "react-icons/fa";
import "./styles/Map.css";
import { questById } from "../data/questDeck";

const ALL_ROOMS = [
  {
    name: "Mr. Watkins' Room",
    id: "watkins",
    xPct: 20,
    yPct: 28,
    icon: "W",
    description: "Override Code #1 — Physical Assessment",
  },
  {
    name: "Mrs. John's Room",
    id: "john",
    xPct: 58,
    yPct: 18,
    icon: "J",
    description: "Override Code #2 — Language Cipher",
  },
  {
    name: "Mrs. Roche's Room",
    id: "roche",
    xPct: 58,
    yPct: 50,
    icon: "R",
    description: "Override Code #3 — Neural Interface",
  },
  {
    name: "Fitness Suite",
    id: "fitness",
    xPct: 58,
    yPct: 74,
    icon: "F",
    description: "TITAN Mainframe — Operation Slamstorm",
  },
];

// Connections between rooms [fromId, toId]
const PATHS = [
  ["watkins", "john"],
  ["john", "roche"],
  ["roche", "fitness"],
];

function getRoomStatus(roomName, currentRoom, completedRooms, visibleRooms) {
  if (completedRooms.includes(roomName)) return "cleared";
  if (roomName === currentRoom) return "current";
  if (visibleRooms.includes(roomName)) return "visible";
  return "fogged";
}

function Map({ gameState, setGameState, userId }) {
  const {
    currentRoom = "",
    completedRooms = [],
    visibleRooms = [],
    annotations = [],
  } = gameState;

  const [showBadges, setShowBadges] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [revealAnim, setRevealAnim] = useState(new Set());

  const questTargets = useMemo(() => {
    const active = new Set();
    (gameState.activeQuests || []).forEach((id) => {
      const room = questById[id]?.criteria?.room;
      if (room) active.add(room);
    });
    return active;
  }, [gameState.activeQuests]);

  // Trigger reveal animation for newly visible rooms
  useEffect(() => {
    ALL_ROOMS.forEach((room) => {
      const status = getRoomStatus(room.name, currentRoom, completedRooms, visibleRooms);
      if (status !== "fogged" && !revealAnim.has(room.name)) {
        setTimeout(() => {
          setRevealAnim((prev) => new Set([...prev, room.name]));
        }, 200);
      }
    });
  }, [visibleRooms, completedRooms, currentRoom]);

  const rooms = ALL_ROOMS.map((room) => ({
    ...room,
    status: getRoomStatus(room.name, currentRoom, completedRooms, visibleRooms),
    freshReveal: !revealAnim.has(room.name),
  }));

  const handleRoomClick = (room) => {
    if (room.status === "visible") {
      setGameState((prev) => ({
        ...prev,
        currentRoom: room.name,
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

  const clearedCount = completedRooms.length;
  const totalCount = ALL_ROOMS.length;
  const progressPct = Math.round((clearedCount / totalCount) * 100);
  const newItemCount = (gameState.inventory || []).filter((i) => i.isNew).length;
  // Override codes collected = rooms cleared (excluding fitness suite)
  const codesCollected = completedRooms.filter((r) => r !== "Fitness Suite").length;

  return (
    <div className="map-page">
      {/* ── Top bar ── */}
      <div className="map-topbar">
        <div className="map-title-group">
          <h2 className="map-title">TACTICAL MAP</h2>
          <p className="map-subtitle">Pencoedtre High School — TITAN Lockdown Active</p>
        </div>
        <div className="map-topbar-actions">
          <button
            className="map-action-btn"
            onClick={() => setShowLeaderboard(true)}
            aria-label="View leaderboard"
          >
            <FaTrophy /> Leaderboard
          </button>
          <button
            className="map-action-btn"
            onClick={() => setShowBadges(true)}
            aria-label="View badges"
          >
            Badges
          </button>
          <button
            className="map-action-btn has-indicator"
            onClick={() => setShowInventory(true)}
            aria-label="Open inventory"
          >
            <GiBackpack /> Inventory
            {newItemCount > 0 && (
              <span className="item-indicator">{newItemCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Override Code Counter ── */}
      <div className="map-codes-bar">
        <div className="map-codes-chips">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`code-chip ${codesCollected >= n ? 'code-chip--active' : ''}`}>
              {codesCollected >= n ? `CODE ${n}` : `LOCKED`}
            </span>
          ))}
        </div>
      </div>

      {/* ── Campaign Progress ── */}
      <div className="map-progress-bar-wrap">
        <div className="map-progress-bar">
          <div
            className="map-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="map-progress-label">
          {clearedCount}/{totalCount} areas cleared ({progressPct}%)
        </span>
      </div>

      {/* ── Map Canvas ── */}
      <div className="map-canvas-wrap">
        <div className="map-canvas">
          {/* Background */}
          <img
            src="/images/Pamphletmap.png"
            alt="Pencoedtre school map"
            className="map-bg"
            draggable={false}
          />

          {/* Animated fog overlay */}
          <div className="map-fog" aria-hidden="true">
            <div className="fog-cloud fog-cloud-a" />
            <div className="fog-cloud fog-cloud-b" />
            <div className="fog-cloud fog-cloud-c" />
          </div>

          {/* SVG connection paths */}
          <svg className="map-svg" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
            {PATHS.map(([fromId, toId]) => {
              const from = ALL_ROOMS.find((r) => r.id === fromId);
              const to = ALL_ROOMS.find((r) => r.id === toId);
              if (!from || !to) return null;
              const fromRoom = rooms.find((r) => r.id === fromId);
              const toRoom = rooms.find((r) => r.id === toId);
              const revealed =
                fromRoom?.status !== "fogged" && toRoom?.status !== "fogged";
              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.xPct + 6}
                  y1={from.yPct + 4}
                  x2={to.xPct + 6}
                  y2={to.yPct + 4}
                  className={`map-path ${revealed ? "path-revealed" : "path-hidden"}`}
                />
              );
            })}
          </svg>

          {/* Room nodes */}
          {rooms.map((room) => {
            const isClickable = room.status === "visible";
            return (
              <div
                key={room.id}
                className={[
                  "map-room",
                  `room-${room.status}`,
                  room.freshReveal && room.status !== "fogged" ? "room-pop" : "",
                  questTargets.has(room.name) ? "room-quest" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ left: `${room.xPct}%`, top: `${room.yPct}%` }}
                onClick={() => handleRoomClick(room)}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                aria-label={
                  room.status === "fogged"
                    ? "Unknown area — keep exploring to reveal"
                    : `${room.name} (${room.status})`
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleRoomClick(room);
                }}
              >
                {room.status === "fogged" ? (
                  <div className="fog-node">
                    <div className="fog-puff" />
                    <span className="fog-q">?</span>
                  </div>
                ) : (
                  <div className="room-card">
                    <span className="room-icon-large">{room.icon}</span>
                    <div className="room-card-text">
                      <span className="room-card-name">{room.name}</span>
                      <span className="room-card-desc">{room.description}</span>
                      {isClickable && (
                        <span className="room-card-cta">Enter Room</span>
                      )}
                      {room.status === "cleared" && (
                        <span className="room-cleared">CODE ACQUIRED</span>
                      )}
                    </div>
                    {questTargets.has(room.name) && (
                      <span className="quest-pip">\u2605</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Map Legend ── */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="ls ls-visible" />Available
        </div>
        <div className="legend-item">
          <span className="ls ls-cleared" />Cleared
        </div>
        <div className="legend-item">
          <span className="ls ls-fogged" />Unknown
        </div>
        <div className="legend-item">
          <span className="ls ls-quest" />Quest
        </div>
      </div>

      {/* ── Hint ── */}
      <p className="map-hint">
        Collect all 3 override codes to unlock the Fitness Suite. Complete TITAN's challenges to progress.
      </p>

      {/* ── Modals ── */}
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
      {showLeaderboard && (
        <div
          className="map-modal-bg"
          onClick={() => setShowLeaderboard(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Leaderboard"
        >
          <div
            className="map-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="map-modal-close"
              onClick={() => setShowLeaderboard(false)}
              aria-label="Close leaderboard"
            >
              ×
            </button>
            <Leaderboard currentUserId={userId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
