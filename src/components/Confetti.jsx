import React, { useState, useEffect } from "react";

const COLORS = [
  "confetti-gold",
  "confetti-cyan",
  "confetti-pink",
  "confetti-green",
  "confetti-white",
];

/**
 * Confetti burst overlay. Shows and auto-cleans up after duration.
 */
export default function Confetti({ count = 60, duration = 3500 }) {
  const [pieces, setPieces] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        size: 6 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
      });
    }
    setPieces(p);
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [count, duration]);

  if (!visible) return null;

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`confetti-piece ${p.color}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
