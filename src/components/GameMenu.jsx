import React, { useEffect, useState } from "react";
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

  return (
    <>
      <div className="game-menu-container">
        <button
          className="game-menu-toggle"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
        >
          ☰ Menu
        </button>
        {menuOpen && (
          <div className="game-menu-panel">
            <p className="menu-heading">Quick Actions</p>
            <button
              className="menu-action"
              onClick={() => {
                setMenuOpen(false);
                setShowManualLog(true);
              }}
            >
              Log Free Workout
            </button>
            <button
              className="menu-action"
              onClick={() => {
                setMenuOpen(false);
                setShowBenchmarkLog(true);
              }}
            >
              Benchmark AMRAP Tracker
            </button>
            <button
              className="menu-action"
              onClick={() => {
                setMenuOpen(false);
                setShowRandomModal(true);
              }}
            >
              Roll Random Workout
            </button>
            <button
              className="menu-action danger"
              onClick={() => {
                setMenuOpen(false);
                onResetProgress();
              }}
            >
              Reset Progress
            </button>
          </div>
        )}
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
                ×
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
                ×
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
