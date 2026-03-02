import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles/BenchmarkAmrapTracker.css";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function BenchmarkAmrapTracker({ config = {}, onSubmit, error }) {
  const {
    subtitle,
    notes,
    movements = [],
    simplifiedMovements = [],
    simplifyNote,
    timeCapMinutes,
    initialRounds = 10,
  } = config;

  // --- Timer state ---
  const [timerState, setTimerState] = useState("idle"); // 'idle' | 'running' | 'finished'
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState]);

  const handleStartWorkout = () => {
    setElapsed(0);
    setTimerState("running");
  };

  const handleEndWorkout = () => {
    setTimerState("finished");
  };

  // --- Simplify toggle ---
  const [simplified, setSimplified] = useState(false);

  const activeMovements = simplified && simplifiedMovements.length > 0
    ? simplifiedMovements
    : movements;

  const movementList = Array.isArray(activeMovements)
    ? activeMovements.filter(Boolean)
    : [];

  // --- Rounds ---
  const baseRounds = useMemo(() => {
    const parsed = parseInt(initialRounds, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      return 10;
    }
    return parsed;
  }, [initialRounds]);

  const [roundStates, setRoundStates] = useState(() =>
    Array.from({ length: baseRounds }, () => false)
  );

  const completedRounds = useMemo(
    () => roundStates.filter(Boolean).length,
    [roundStates]
  );

  const toggleRound = (index) => {
    setRoundStates((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const addRound = () => {
    setRoundStates((prev) => [...prev, false]);
  };

  const resetRounds = () => {
    setRoundStates(Array.from({ length: baseRounds }, () => false));
  };

  const handleSubmit = () => {
    if (typeof onSubmit === "function") {
      onSubmit({ roundsCompleted: completedRounds, roundsState: roundStates });
    }
  };

  const canSubmit = timerState === "finished" || completedRounds >= 1;

  return (
    <div className="amrap-tracker">
      {subtitle && <p className="amrap-subtitle">{subtitle}</p>}

      {/* --- Timer --- */}
      <div className="amrap-timer-section">
        {timerState === "idle" && (
          <button
            type="button"
            className="timer-start-btn"
            onClick={handleStartWorkout}
          >
            Start Workout
          </button>
        )}
        {timerState === "running" && (
          <div className="timer-running">
            <span className="timer-display timer-running-text">
              {formatTime(elapsed)}
            </span>
            <button
              type="button"
              className="timer-end-btn"
              onClick={handleEndWorkout}
            >
              End Workout
            </button>
          </div>
        )}
        {timerState === "finished" && (
          <div className="timer-finished">
            <span className="timer-display timer-finished-text">
              {formatTime(elapsed)}
            </span>
            <span className="timer-complete-label">Workout complete!</span>
          </div>
        )}
      </div>

      {timeCapMinutes ? (
        <div className="amrap-info-card" aria-label={`Time cap ${timeCapMinutes} minutes`}>
          <span className="label">Time Cap</span>
          <strong>{timeCapMinutes} minutes</strong>
        </div>
      ) : null}

      {/* --- Simplify toggle --- */}
      {simplifiedMovements.length > 0 && (
        <div className="amrap-simplify-section">
          <button
            type="button"
            className="simplify-toggle-btn"
            onClick={() => setSimplified((prev) => !prev)}
          >
            {simplified ? "Show Original Movements" : "Simplify Movements"}
          </button>
          {simplified && simplifyNote && (
            <div className="simplify-note">
              <p>{simplifyNote}</p>
            </div>
          )}
        </div>
      )}

      {movementList.length > 0 && (
        <div className="amrap-movements" aria-label="Workout movements">
          <p className="movement-heading">
            {simplified ? "Modified Workout Flow" : "Workout Flow"}
          </p>
          <ol>
            {movementList.map((movement, index) => (
              <li key={`${movement}-${index}`}>{movement}</li>
            ))}
          </ol>
        </div>
      )}
      {notes && <p className="amrap-notes">{notes}</p>}
      <div className="amrap-rounds" aria-label="Round tracker">
        {roundStates.map((checked, index) => (
          <label
            key={`round-${index}`}
            className={`amrap-round ${checked ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleRound(index)}
              aria-label={`Round ${index + 1}`}
            />
            <span className="round-number">{index + 1}</span>
            <span className="round-status">
              {checked ? "Completed" : "Tap when finished"}
            </span>
          </label>
        ))}
      </div>
      <div className="amrap-controls">
        <button type="button" onClick={addRound} className="add-round-btn">
          + Add Round
        </button>
        <button type="button" onClick={resetRounds} className="reset-rounds-btn">
          Reset
        </button>
      </div>
      <div className="amrap-footer">
        <div className="amrap-count" aria-live="polite">
          <span>Rounds completed</span>
          <strong>{completedRounds}</strong>
        </div>
        <button
          type="button"
          className="finish-amrap-btn"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Log Rounds
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default BenchmarkAmrapTracker;
