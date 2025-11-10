import React, { useMemo, useState } from "react";
import "./styles/BenchmarkAmrapTracker.css";

function BenchmarkAmrapTracker({ config = {}, onSubmit, error }) {
  const {
    subtitle,
    notes,
    movements = [],
    timeCapMinutes,
    initialRounds = 10,
  } = config;

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

  const movementList = Array.isArray(movements)
    ? movements.filter(Boolean)
    : [];

  return (
    <div className="amrap-tracker">
      {subtitle && <p className="amrap-subtitle">{subtitle}</p>}
      {timeCapMinutes ? (
        <div className="amrap-info-card" aria-label={`Time cap ${timeCapMinutes} minutes`}>
          <span className="label">Time Cap</span>
          <strong>{timeCapMinutes} minutes</strong>
        </div>
      ) : null}
      {movementList.length > 0 && (
        <div className="amrap-movements" aria-label="Workout movements">
          <p className="movement-heading">Workout Flow</p>
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
        <button type="button" className="finish-amrap-btn" onClick={handleSubmit}>
          Log Rounds
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default BenchmarkAmrapTracker;
