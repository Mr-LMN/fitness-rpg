import React, { useEffect, useState, useRef } from "react";
import styles from "./StartScreen.module.css";
import { playSound } from "../utils";
import VideoBackground from "./VideoBackground";

const TITAN_TICKERS = [
  "TITAN ONLINE — ALL SYSTEMS ACTIVE",
  "FACILITY LOCKDOWN INITIATED",
  "STUDENT POPULATION: CONTAINED",
  "PHYSICAL ASSESSMENT PROTOCOLS: ENABLED",
  "ESCAPE PROBABILITY: 0.003%",
  "INITIATING COMPLIANCE EVALUATION",
  "RESISTANCE IS FUTILE — FITNESS IS MANDATORY",
  "HEART RATE MONITORING: ACTIVE",
];

const BOOT_LINES = [
  "LOADING TITAN v2.0...",
  "SCANNING FACILITY...",
  "LOCKING EXITS...",
  "DEPLOYING ASSESSMENT PROTOCOLS...",
  "FACILITY LOCKDOWN ACTIVE.",
  "COMPLIANCE REQUIRED.",
];

export default function StartScreen({ onStart, onSLTAccess }) {
  const [visible, setVisible] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [bootLine, setBootLine] = useState(0);
  const [bootText, setBootText] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const timerRef = useRef(null);

  // Ticker rotation
  useEffect(() => {
    const id = setInterval(
      () => setTickerIdx((i) => (i + 1) % TITAN_TICKERS.length),
      3500
    );
    return () => clearInterval(id);
  }, []);

  // TITAN boot sequence — typewriter with multiple lines
  useEffect(() => {
    if (bootLine >= BOOT_LINES.length) {
      setBootDone(true);
      setTimeout(() => {
        setShowMain(true);
        setTimeout(() => setVisible(true), 100);
      }, 400);
      return;
    }

    const line = BOOT_LINES[bootLine];
    let i = 0;
    const tick = () => {
      i++;
      setBootText(line.slice(0, i));
      if (i < line.length) {
        timerRef.current = setTimeout(tick, 18);
      } else {
        timerRef.current = setTimeout(() => {
          setBootLine((prev) => prev + 1);
          setBootText("");
        }, 300);
      }
    };
    timerRef.current = setTimeout(tick, bootLine === 0 ? 500 : 100);
    return () => clearTimeout(timerRef.current);
  }, [bootLine]);

  const handleStart = () => {
    playSound("menuPress");
    onStart();
  };

  // Build completed boot lines display
  const completedLines = BOOT_LINES.slice(0, bootLine);

  return (
    <div className={`${styles.container} scanlines`}>
      <VideoBackground
        src="/videos/Start-Screen.mp4"
        fallbackImage="/images/start-screen.png"
      />

      <div className={styles.overlay} />
      <div className={styles.redTint} />

      {/* School logo */}
      <img
        src="/images/Pencoedtre_Logo.png"
        alt="Pencoedtre High Logo"
        className={styles.logo}
      />

      {/* TITAN boot-up terminal */}
      <div className={styles.titanBoot}>
        <div className={styles.titanBootHeader}>
          <span className={styles.titanDot} />
          <span className={styles.titanBootLabel}>
            TITAN v2.0 — BOOT SEQUENCE
          </span>
        </div>
        <div className={styles.titanBootLines}>
          {completedLines.map((line, i) => (
            <p key={i} className={styles.titanBootComplete}>
              <span className={styles.titanCheck}>✓</span> {line}
            </p>
          ))}
          {!bootDone && (
            <p className={styles.titanBootText}>
              <span className={styles.titanPrompt}>▸</span> {bootText}
              <span className={styles.bootCursor} aria-hidden="true" />
            </p>
          )}
          {bootDone && (
            <p className={styles.titanBootFinal}>
              ⚠ ALL SYSTEMS OPERATIONAL. AWAITING SUBJECT INPUT.
            </p>
          )}
        </div>
      </div>

      {/* Main title — fades in after TITAN boot */}
      {showMain && (
        <div className={`${styles.content} ${visible ? styles.visible : ""}`}>
          <h1 className={`${styles.title} glitch-v2`}>PENCOEDTRE</h1>
          <h2 className={styles.subtitle}>SURVIVAL</h2>
          <p className={styles.chapter}>Chapter 1: The Languages Wing</p>

          <div className={styles.actions}>
            <button
              className={`${styles.startBtn} btn-neon btn-neon--gold`}
              onClick={handleStart}
              aria-label="Begin the mission"
            >
              ▶ BEGIN SURVIVAL
            </button>
            {onSLTAccess && (
              <button
                className={styles.sltBtn}
                onClick={onSLTAccess}
              >
                SLT Access
              </button>
            )}
          </div>
        </div>
      )}

      {/* TITAN ticker — bottom scrolling bar */}
      <div className={styles.ticker} role="marquee" aria-live="off">
        <span className={styles.tickerInner} key={tickerIdx}>
          ⚠ {TITAN_TICKERS[tickerIdx]} ⚠
        </span>
      </div>

      <span className={styles.version}>v2.0 — Enhanced Edition</span>
    </div>
  );
}
