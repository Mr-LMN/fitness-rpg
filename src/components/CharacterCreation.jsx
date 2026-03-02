import React, { useState } from "react";
import { setUserWeight } from "../utils";
import { GiPirateCaptain, GiBlackKnightHelm, GiNinjaHead } from "react-icons/gi";
import { Brain, Volume2 } from "lucide-react";
import { updateUserProfile } from "../helpers/userProfile";
import "./styles/CharacterCreation.css";

const AVATARS = [
  { id: "pirate", icon: <GiPirateCaptain />, label: "Pirate", desc: "Bold and fearless" },
  { id: "knight", icon: <GiBlackKnightHelm />, label: "Knight", desc: "Strong and brave" },
  { id: "ninja", icon: <GiNinjaHead />, label: "Ninja", desc: "Fast and focused" },
];

const STEPS = [
  { id: "identity", label: "Your Name" },
  { id: "details", label: "About You" },
  { id: "avatar", label: "Choose Hero" },
  { id: "settings", label: "Accessibility" },
];

function StepProgress({ currentStep, total }) {
  const pct = ((currentStep + 1) / total) * 100;
  return (
    <div className="cc-progress-wrap">
      <div className="cc-progress-track">
        <div className="cc-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="cc-progress-label">Step {currentStep + 1} of {total}</span>
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
          setError("Please enter your name to continue.");
          return false;
        }
        break;
      case 1:
        if (!gameState.yearGroup) {
          setError("Please select your year group.");
          return false;
        }
        if (!gameState.gender) {
          setError("Please select a gender option.");
          return false;
        }
        if (!gameState.weight || parseFloat(gameState.weight) < 20) {
          setError("Please enter a valid weight (in kg).");
          return false;
        }
        if (!gameState.workoutFocus) {
          setError("Please choose a workout focus.");
          return false;
        }
        break;
      case 2:
        if (!gameState.avatar) {
          setError("Please choose your hero.");
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

    const finalState = {
      ...gameState,
      weight: wt,
      characterCreated: true,
    };
    setGameState(finalState);

    // Bootstrap user profile in Firestore
    if (userId) {
      await updateUserProfile({
        userId,
        studentName: gameState.studentName,
        yearGroup: gameState.yearGroup,
        avatar: gameState.avatar || "pirate",
        xp: gameState.xp || 0,
        readingAge: gameState.readingAge || "not-sure",
      });
    }
  };

  return (
    <div className={`character-creation-container ${gameState.enhancedReading ? "enhanced-reading" : ""}`}>
      <div className="character-creation-box">

        {/* Header */}
        <div className="cc-header">
          <h2 className="cc-title">Create Your Hero</h2>
          <p className="cc-subtitle">Pencoedtre High School — Fitness RPG</p>
        </div>

        {/* Step progress bar */}
        <StepProgress currentStep={step} total={STEPS.length} />

        {/* Step label */}
        <div className="cc-step-label">
          <span className="cc-step-name">Step {step + 1}: {STEPS[step].label}</span>
        </div>

        {/* STEP 0: Name */}
        {step === 0 && (
          <div className="cc-step-content">
            <div className="cc-field">
              <label className="cc-label" htmlFor="cc-name">Your Name</label>
              <input
                id="cc-name"
                className="cc-input"
                type="text"
                placeholder="Enter your name here"
                value={gameState.studentName || ""}
                onChange={(e) => update("studentName", e.target.value)}
                autoFocus
                autoComplete="given-name"
                onKeyDown={(e) => { if (e.key === "Enter") handleNext(); }}
              />
              <p className="cc-field-hint">
                This is the name that will appear on the leaderboard.
              </p>
            </div>
          </div>
        )}

        {/* STEP 1: Details */}
        {step === 1 && (
          <div className="cc-step-content">
            <div className="cc-field">
              <label className="cc-label" htmlFor="cc-year">Year Group</label>
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
                <label className="cc-label" htmlFor="cc-gender">Gender</label>
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
                <label className="cc-label" htmlFor="cc-weight">Weight (kg)</label>
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
              <label className="cc-label" htmlFor="cc-focus">Workout Focus</label>
              <select
                id="cc-focus"
                className="cc-select"
                value={gameState.workoutFocus || ""}
                onChange={(e) => update("workoutFocus", e.target.value)}
              >
                <option value="">Choose focus...</option>
                <option value="cardio">Cardio — running, cycling, rowing</option>
                <option value="strength">Strength — lifting, resistance</option>
              </select>
              <p className="cc-field-hint">
                You can change this at any time in the menu.
              </p>
            </div>
            <div className="cc-field">
              <label className="cc-label" htmlFor="cc-reading-age">Reading Age</label>
              <select
                id="cc-reading-age"
                className="cc-select"
                value={gameState.readingAge || "not-sure"}
                onChange={(e) => update("readingAge", e.target.value)}
              >
                <option value="not-sure">Not sure — use my year group default</option>
                <option value="under7">Under 7</option>
                <option value="7-8">7–8</option>
                <option value="9-10">9–10</option>
                <option value="11-12">11–12</option>
                <option value="13-14">13–14</option>
                <option value="15+">15+</option>
              </select>
              <p className="cc-field-hint">
                This adjusts the story text to match your reading level.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Avatar */}
        {step === 2 && (
          <div className="cc-step-content">
            <p className="cc-step-intro">Choose the hero that represents you on this adventure.</p>
            <div className="cc-avatar-grid">
              {AVATARS.map(({ id, icon, label, desc }) => (
                <button
                  key={id}
                  type="button"
                  className={`cc-avatar-option ${gameState.avatar === id ? "selected" : ""}`}
                  onClick={() => update("avatar", id)}
                  aria-pressed={gameState.avatar === id}
                  aria-label={`${label}: ${desc}`}
                >
                  <span className="cc-avatar-icon">{icon}</span>
                  <span className="cc-avatar-label">{label}</span>
                  <span className="cc-avatar-desc">{desc}</span>
                </button>
              ))}
            </div>
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
                Enhanced Reading — larger text on a cream background
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
                Text-to-Speech — the game reads the story out loud
              </label>
            </div>
            <p className="cc-step-intro" style={{ marginTop: 12 }}>
              You're all set, <strong>{gameState.studentName}</strong>! Press Start to begin your adventure.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="cc-error" role="alert">
            {error}
          </p>
        )}

        {/* Navigation Buttons */}
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
              Start Adventure
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CharacterCreation;
