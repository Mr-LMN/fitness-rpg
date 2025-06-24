import React, { useEffect } from "react";
import styles from "./StartScreen.module.css";
import logo from "/Pencoedtre_Logo.png";

export default function StartScreen({ onStart }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add(styles.loaded);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <img src={logo} alt="Pencoedtre High Logo" className={styles.badge} />
        <h1 className={styles.title}>Fitness RPG</h1>
        <p className={styles.subtitle}>Begin your adventure to fitness glory.</p>
        <button
          className={styles.startButton}
          onClick={onStart}
          aria-label="Start Game"
        >
          Start
        </button>
      </div>
    </div>
  );
}
