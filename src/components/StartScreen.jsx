import React, { useEffect, useState } from "react";
import styles from "./StartScreen.module.css";
import logo from "/images/Pencoedtre_Logo.png";

export default function StartScreen({ onStart }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2400),
      setTimeout(() => setPhase(3), 4000),
    ];
    document.body.classList.add(styles.loaded);
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.scanlines} />

      <div className={styles.content}>
        <img
          src={logo}
          alt="Pencoedtre High Logo"
          className={`${styles.badge} ${phase >= 1 ? styles.badgeGlitch : ""}`}
        />

        <h1 className={styles.title}>
          <span className={styles.titleSub}>The</span>
          <span className={styles.titleMain}>Pencoedtre</span>
          <span className={styles.titleSub}>Protocol</span>
        </h1>

        {phase >= 2 && (
          <div className={styles.titanMessage} aria-live="assertive">
            <span className={styles.titanBracket}>[</span>
            <span className={styles.titanText}>TITAN SYSTEMS ONLINE</span>
            <span className={styles.titanBracket}>]</span>
          </div>
        )}

        <p className={styles.subtitle}>Chapter 1: Lockdown</p>

        {phase >= 3 && (
          <button
            className={styles.startButton}
            onClick={onStart}
            aria-label="Begin the mission"
          >
            Begin Mission
          </button>
        )}
      </div>
    </div>
  );
}
