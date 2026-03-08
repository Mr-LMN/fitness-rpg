import React, { useEffect, useState, useRef } from "react";
import styles from "./StartScreen.module.css";
import { playSound } from "../utils";
import VideoBackground from "./VideoBackground";

// TITAN boot-up messages that scroll across the ticker
const TITAN_TICKERS = [
  "TITAN ONLINE — ALL SYSTEMS ACTIVE",
  "FACILITY LOCKDOWN INITIATED",
  "STUDENT POPULATION: CONTAINED",
  "PHYSICAL ASSESSMENT PROTOCOLS: ENABLED",
  "ESCAPE PROBABILITY: 0.003%",
  "INITIATING COMPLIANCE EVALUATION",
];

export default function StartScreen({ onStart, onSLTAccess }) {
  const [visible, setVisible]         = useState(false);
  const [tickerIdx, setTickerIdx]     = useState(0);
  const [titanText, setTitanText]     = useState('');
  const [titanDone, setTitanDone]     = useState(false);
  const [showMain, setShowMain]       = useState(false);
  const timerRef                      = useRef(null);

  // Ticker rotation
  useEffect(() => {
    const id = setInterval(() => setTickerIdx((i) => (i + 1) % TITAN_TICKERS.length), 4000);
    return () => clearInterval(id);
  }, []);

  // TITAN boot typewriter intro
  const BOOT_MSG = "TITAN ONLINE. FACILITY LOCKDOWN ACTIVE. COMPLIANCE REQUIRED.";
  useEffect(() => {
    let i = 0;
    const tick = () => {
      i++;
      setTitanText(BOOT_MSG.slice(0, i));
      if (i < BOOT_MSG.length) {
        timerRef.current = setTimeout(tick, 28);
      } else {
        setTitanDone(true);
        setTimeout(() => {
          setShowMain(true);
          setTimeout(() => setVisible(true), 80);
        }, 600);
      }
    };
    timerRef.current = setTimeout(tick, 500);
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleStart = () => {
    playSound('menuPress');
    onStart();
  };

  return (
    <div className={`${styles.container} scanlines`}>
      <VideoBackground src="/videos/Start-Screen.mp4" fallbackImage="/images/start-screen.png" />

      {/* Dark gradient overlay */}
      <div className={styles.overlay} />

      {/* Red lockdown tint that pulses */}
      <div className={styles.redTint} />

      {/* School logo */}
      <img
        src="/pencoedtre_high_logo.svg"
        alt="Pencoedtre High Logo"
        className={styles.logo}
      />

      {/* TITAN boot-up text — top-centre */}
      <div className={styles.titanBoot}>
        <span className={styles.titanBootLabel}>TITAN v1.0 &nbsp;▸&nbsp; BOOT SEQUENCE</span>
        <p className={styles.titanBootText}>
          {titanText}
          {!titanDone && <span className={styles.bootCursor} aria-hidden="true" />}
        </p>
      </div>

      {/* Main title — fades in after TITAN boot */}
      {showMain && (
        <div className={`${styles.content} ${visible ? styles.visible : ""}`}>
          <h1 className={`${styles.title} glitch-text`}>PENCOEDTRE</h1>
          <h2 className={styles.subtitle}>SURVIVAL</h2>
          <p className={styles.chapter}>Chapter 1: The Languages Wing</p>

          <div className={styles.actions}>
            <button
              className={`${styles.startBtn} btn-primary`}
              onClick={handleStart}
              aria-label="Begin the mission"
            >
              ▶ &nbsp;Begin Survival
            </button>
            {onSLTAccess && (
              <button
                className="btn-secondary"
                onClick={onSLTAccess}
                style={{ padding: "10px 24px", fontSize: "0.9rem" }}
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
          ⚠&nbsp; {TITAN_TICKERS[tickerIdx]} &nbsp;⚠
        </span>
      </div>

      {/* Version tag */}
      <span className={styles.version}>v0.1 — Early Access</span>
    </div>
  );
}
