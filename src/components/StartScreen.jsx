import React, { useEffect, useState } from "react";
import styles from "./StartScreen.module.css";

export default function StartScreen({ onStart, onSLTAccess }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />

      <img
        src="/pencoedtre_high_logo.svg"
        alt="Pencoedtre High Logo"
        className={styles.logo}
      />

      <div className={`${styles.content} ${visible ? styles.visible : ""}`}>
        <h1 className={styles.title}>PENCOEDTRE</h1>
        <h2 className={styles.subtitle}>SURVIVAL</h2>
        <p className={styles.chapter}>Chapter 1: The Languages Wing</p>

        <div className={styles.actions}>
          <button
            className="btn-primary"
            onClick={onStart}
            aria-label="Begin the mission"
          >
            Begin Survival
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

      <span className={styles.version}>v0.1 — Early Access</span>
    </div>
  );
}
