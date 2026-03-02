import React, { useEffect, useState } from "react";
import { Menu, X, Dumbbell, Timer, Dice3, RotateCcw, ChevronRight } from "lucide-react";
import WorkoutLogger from "./WorkoutLogger";
import RandomWorkoutModal from "./RandomWorkoutModal";
import benchmarkAmrap from "../data/benchmarkAmrap";
import "./styles/GameMenu.css";

function GameMenu({
  setGameState,
  gameState,
  userId,
  onQuestEvent,
  onResetProgress = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showManualLog, setShowManualLog] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showBenchmarkLog, setShowBenchmarkLog] = useState(false);
  const [manualFocus, setManualFocus] = useState(gameState.workoutFocus || "strength");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    if (!showManualLog) {
      setManualFocus(gameState.workoutFocus || "strength");
    }
  }, [gameState.workoutFocus, showManualLog]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [menuOpen]);

  const menuItems = [
    {
      section: "Your Gear",
      items: [],
    },
    {
      section: "Actions",
      items: [
        {
          label: "Free Workout",
          icon: <Dumbbell size={18} />,
          onClick: () => { setMenuOpen(false); setShowManualLog(true); },
        },
        {
          label: "Benchmark AMRAP",
          icon: <Timer size={18} />,
          onClick: () => { setMenuOpen(false); setShowBenchmarkLog(true); },
        },
        {
          label: "Roll Random Workout",
          icon: <Dice3 size={18} />,
          onClick: () => { setMenuOpen(false); setShowRandomModal(true); },
        },
      ],
    },
    {
      section: "Settings",
      items: [
        {
          label: "Reset Progress",
          icon: <RotateCcw size={18} />,
          danger: true,
          onClick: () => { setMenuOpen(false); onResetProgress(); },
        },
      ],
    },
  ];

  return (
    <>
      {/* Menu toggle button */}
      <button
        className="game-menu-trigger"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label="Toggle game menu"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {menuOpen && (
        <div className="game-menu-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      {/* Slide-in panel */}
      <div className={`game-menu-panel ${menuOpen ? "game-menu-open" : ""}`}>
        <div className="game-menu-panel-inner">
          {menuItems.map((section) => (
            <div key={section.section} className="game-menu-section">
              <span className="game-menu-section-label">{section.section}</span>
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className={`game-menu-item ${item.danger ? "game-menu-item-danger" : ""}`}
                  onClick={item.onClick}
                >
                  <span className="game-menu-item-icon">{item.icon}</span>
                  <span className="game-menu-item-label">{item.label}</span>
                  <ChevronRight size={14} className="game-menu-item-chevron" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {showManualLog && (
        <div className="menu-modal-overlay">
          <div className="menu-modal">
            <div className="menu-modal-header">
              <h3>Free Workout Log</h3>
              <button
                className="close-btn"
                onClick={() => setShowManualLog(false)}
                aria-label="Close free workout log"
              >
                <X size={16} />
              </button>
            </div>
            <div className="focus-selector">
              <label htmlFor="free-log-focus">Workout Focus</label>
              <select
                id="free-log-focus"
                value={manualFocus}
                onChange={(e) => setManualFocus(e.target.value)}
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
              </select>
            </div>
            <WorkoutLogger
              key={manualFocus}
              title="Log a Free Workout"
              roomNumber={null}
              setGameState={setGameState}
              workoutFocus={manualFocus}
              userId={userId}
              yearGroup={gameState.yearGroup}
              studentName={gameState.studentName}
              avatar={gameState.avatar}
              onWorkoutLogged={({ focus }) => {
                onQuestEvent("workoutLogged", {
                  room: "Free Log",
                  focus: focus || manualFocus,
                });
              }}
              onComplete={() => setShowManualLog(false)}
              completeLabel="Close"
            />
          </div>
        </div>
      )}

      {showBenchmarkLog && (
        <div className="menu-modal-overlay">
          <div className="menu-modal">
            <div className="menu-modal-header">
              <h3>{benchmarkAmrap.title}</h3>
              <button
                className="close-btn"
                onClick={() => setShowBenchmarkLog(false)}
                aria-label="Close benchmark tracker"
              >
                <X size={16} />
              </button>
            </div>
            <WorkoutLogger
              key="benchmark-amrap"
              title={benchmarkAmrap.title}
              roomNumber={null}
              setGameState={setGameState}
              workoutFocus="benchmark-amrap"
              userId={userId}
              yearGroup={gameState.yearGroup}
              studentName={gameState.studentName}
              avatar={gameState.avatar}
              specialWorkout={benchmarkAmrap}
              onWorkoutLogged={({ focus }) => {
                onQuestEvent("workoutLogged", {
                  room: benchmarkAmrap.title,
                  focus: focus || benchmarkAmrap.variant,
                });
              }}
              onComplete={() => setShowBenchmarkLog(false)}
              completeLabel="Close"
            />
          </div>
        </div>
      )}

      {showRandomModal && (
        <RandomWorkoutModal
          onClose={() => setShowRandomModal(false)}
          setGameState={setGameState}
          userId={userId}
          yearGroup={gameState.yearGroup}
          defaultFocus={gameState.workoutFocus || "strength"}
          onQuestEvent={onQuestEvent}
        />
      )}
    </>
  );
}

export default GameMenu;
