import React, { useState } from "react";
import { setUserWeight } from "../utils";
import { Brain, Volume2, Zap } from "lucide-react";
import { updateUserProfile } from "../helpers/userProfile";
import { CLASSES } from "../constants";
import "./styles/CharacterCreation.css";

const CLASS_LIST = Object.values(CLASSES);

const STEPS = [
  { id: "identity", label: "Agent Name" },
  { id: "details", label: "Intel" },
  { id: "class", label: "Choose Class" },
  { id: "settings", label: "Settings" },
];

function StepProgress({ currentStep, total }) {
  const pct = ((currentStep + 1) / total) * 100;
  return (
    <div className="cc-progress-wrap">
      <div className="cc-progress-track">
        <div className="cc-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="cc-progress-label">
        Step {currentStep + 1} of {total}
      </span>
    </div>
  );
}

function CharacterCreation({ gameState, setGameState, userId }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setError("");
    setGameState((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!gameState.studentName?.trim()) {
          setError("Enter your agent name to continue.");
          return false;
        }
        break;
      case 1:
        if (!gameState.yearGroup) {
          setError("Select your year group.");
          return false;
        }
        if (!gameState.gender) {
          setError("Select a gender option.");
          return false;
        }
        if (!gameState.weight || parseFloat(gameState.weight) < 20) {
          setError("Enter a valid weight (in kg).");
          return false;
        }
        if (!gameState.workoutFocus) {
          setError("Choose a workout focus.");
          return false;
        }
        break;
      case 2:
        if (!gameState.playerClass) {
          setError("Choose your class to continue.");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setError("");
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleStart = async () => {
    if (!validateStep()) return;
    const wt = parseFloat(gameState.weight) || 50;
    setUserWeight(wt);

    // Set avatar based on class
    const classToAvatar = {
      berserker: "knight",
      phantom: "ninja",
      guardian: "pirate",
    };

    const finalState = {
      ...gameState,
      weight: wt,
      avatar: classToAvatar[gameState.playerClass] || "pirate",
      characterCreated: true,
    };
    setGameState(finalState);

    if (userId) {
      await updateUserProfile({
        userId,
        studentName: gameState.studentName,
        yearGroup: gameState.yearGroup,
        avatar: classToAvatar[gameState.playerClass] || "pirate",
        xp: gameState.xp || 0,
        readingAge: gameState.readingAge || "not-sure",
      });
    }
  };

  const selectedClass = gameState.playerClass
    ? CLASSES[gameState.playerClass]
    : null;

  return (
    <div
      className={`character-creation-container ${
        gameState.enhancedReading ? "enhanced-reading" : ""
      }`}
    >
      <div className="character-creation-box">
        {/* Header */}
        <div className="cc-header">
          <div className="cc-titan-badge">TITAN DOSSIER</div>
          <h2 className="cc-title">Create Your Agent</h2>
          <p className="cc-subtitle">
            Pencoedtre High School — Survival Protocol
          </p>
        </div>

        <StepProgress currentStep={step} total={STEPS.length} />

        <div className="cc-step-label">
          <span className="cc-step-name">
            Step {step + 1}: {STEPS[step].label}
          </span>
        </div>

        {/* STEP 0: Name */}
        {step === 0 && (
          <div className="cc-step-content">
            <div className="cc-field">
              <label className="cc-label" htmlFor="cc-name">
                Agent Name
              </label>
              <input
                id="cc-name"
                className="cc-input"
                type="text"
                placeholder="Enter your name, agent..."
                value={gameState.studentName || ""}
                onChange={(e) => update("studentName", e.target.value)}
                autoFocus
                autoComplete="given-name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNext();
                }}
              />
              <p className="cc-field-hint">
                This will appear on the school leaderboard and in TITAN's
                records.
              </p>
            </div>
          </div>
        )}

        {/* STEP 1: Details */}
        {step === 1 && (
          <div className="cc-step-content">
            <div className="cc-field">
              <label className="cc-label" htmlFor="cc-year">
                Year Group
              </label>
              <select
                id="cc-year"
                className="cc-select"
                value={gameState.yearGroup || ""}
                onChange={(e) => update("yearGroup", e.target.value)}
              >
                <option value="">Select your year...</option>
                <option value="Year 7">Year 7</option>
                <option value="Year 8">Year 8</option>
                <option value="Year 9">Year 9</option>
                <option value="Year 10">Year 10</option>
                <option value="Year 11">Year 11</option>
              </select>
            </div>
            <div className="cc-row">
              <div className="cc-field">
                <label className="cc-label" htmlFor="cc-gender">
                  Gender
                </label>
                <select
                  id="cc-gender"
                  className="cc-select"
                  value={gameState.gender || ""}
                  onChange={(e) => update("gender", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="X">Prefer not to say</option>
                </select>
              </div>
              <div className="cc-field">
                <label className="cc-label" htmlFor="cc-weight">
                  Weight (kg)
                </label>
                <input
                  id="cc-weight"
                  type="number"
                  className="cc-input"
                  placeholder="e.g. 60"
                  min="20"
                  max="200"
                  value={gameState.weight || ""}
                  onChange={(e) => update("weight", e.target.value)}
                />
              </div>
            </div>
            <div className="cc-field">
              <label className="cc-label" htmlFor="cc-focus">
                Primary Training
              </label>
              <select
                id="cc-focus"
                className="cc-select"
                value={gameState.workoutFocus || ""}
                onChange={(e) => update("workoutFocus", e.target.value)}
              >
                <option value="">Choose focus...</option>
                <option value="cardio">
                  Cardio — running, cycling, rowing
                </option>
                <option value="strength">
                  Strength — lifting, resistance
                </option>
              </select>
            </div>
            <div className="cc-field">
              <label className="cc-label" htmlFor="cc-reading-age">
                Reading Level
              </label>
              <select
                id="cc-reading-age"
                className="cc-select"
                value={gameState.readingAge || "not-sure"}
                onChange={(e) => update("readingAge", e.target.value)}
              >
                <option value="not-sure">Auto-detect from year group</option>
                <option value="under7">Under 7</option>
                <option value="7-8">7–8</option>
                <option value="9-10">9–10</option>
                <option value="11-12">11–12</option>
                <option value="13-14">13–14</option>
                <option value="15+">15+</option>
              </select>
              <p className="cc-field-hint">
                Adjusts story complexity to match your reading level.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Class Selection */}
        {step === 2 && (
          <div className="cc-step-content">
            <p className="cc-step-intro">
              Choose your combat class. Each class has a unique passive ability
              that boosts your XP in different ways.
            </p>
            <div className="cc-class-grid">
              {CLASS_LIST.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  className={`class-card ${
                    gameState.playerClass === cls.id ? "selected" : ""
                  }`}
                  style={{
                    "--class-color": cls.color,
                    "--class-rgb": cls.rgb,
                  }}
                  onClick={() => update("playerClass", cls.id)}
                  aria-pressed={gameState.playerClass === cls.id}
                  aria-label={`${cls.name}: ${cls.desc}`}
                >
                  <span className="class-icon">{cls.icon}</span>
                  <span className="class-name" style={{ color: cls.color }}>
                    {cls.name}
                  </span>
                  <span className="class-desc">{cls.desc}</span>
                  <span
                    className="class-ability"
                    style={{ color: cls.color }}
                  >
                    <Zap size={10} /> {cls.ability}
                  </span>
                </button>
              ))}
            </div>
            {selectedClass && (
              <div
                className="cc-class-preview"
                style={{ borderColor: selectedClass.color }}
              >
                <span className="cc-class-preview-icon">
                  {selectedClass.icon}
                </span>
                <div>
                  <strong style={{ color: selectedClass.color }}>
                    {selectedClass.name}
                  </strong>{" "}
                  selected — {selectedClass.ability}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Accessibility */}
        {step === 3 && (
          <div className="cc-step-content">
            <p className="cc-step-intro">
              These settings make the game easier to read and understand. You can
              change them at any time from the menu.
            </p>
            <div className="cc-toggles">
              <p className="cc-toggles-title">Accessibility Options</p>
              <label className="cc-toggle">
                <input
                  type="checkbox"
                  checked={gameState.enhancedReading || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setGameState((prev) => ({
                      ...prev,
                      enhancedReading: checked,
                      textToSpeech: checked,
                    }));
                  }}
                />
                <Brain size={16} aria-hidden="true" />
                Enhanced Reading — larger text on cream background
              </label>
              <label className="cc-toggle">
                <input
                  type="checkbox"
                  checked={gameState.textToSpeech || false}
                  onChange={(e) =>
                    setGameState((prev) => ({
                      ...prev,
                      textToSpeech: e.target.checked,
                    }))
                  }
                />
                <Volume2 size={16} aria-hidden="true" />
                Text-to-Speech — the game reads the story aloud
              </label>
            </div>
            <div className="cc-ready-panel">
              <p className="cc-ready-text">
                You're all set,{" "}
                <strong>{gameState.studentName}</strong>!
                {selectedClass && (
                  <>
                    {" "}
                    Class: <strong style={{ color: selectedClass.color }}>{selectedClass.name}</strong>.
                  </>
                )}
              </p>
              <p className="cc-ready-hint">
                TITAN is waiting. Press Start to begin your survival.
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="cc-error" role="alert">
            {error}
          </p>
        )}

        <div className="cc-nav">
          {step > 0 && (
            <button className="cc-back-btn" onClick={handleBack} type="button">
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="cc-next-btn" onClick={handleNext} type="button">
              Next
            </button>
          ) : (
            <button
              className="cc-start-btn ready"
              onClick={handleStart}
              type="button"
            >
              ▶ Start Survival
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CharacterCreation;
