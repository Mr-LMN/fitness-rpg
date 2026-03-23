import React, { useState, useEffect, useRef } from "react";

let popupId = 0;

/**
 * Floating XP popup system. Import and call `showXPPopup` to display
 * a floating "+10 XP" (or damage, heal) number anywhere on screen.
 */
const popups = [];
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn([...popups]));
}

export function showXPPopup(text, { x, y, variant = "xp" } = {}) {
  const id = ++popupId;
  // Default position: center-top area
  const px = x ?? window.innerWidth / 2;
  const py = y ?? 120;
  popups.push({ id, text, x: px, y: py, variant });
  notify();
  setTimeout(() => {
    const idx = popups.findIndex((p) => p.id === id);
    if (idx !== -1) popups.splice(idx, 1);
    notify();
  }, 1600);
}

export default function XPPopupLayer() {
  const [items, setItems] = useState([]);
  const ref = useRef(setItems);
  ref.current = setItems;

  useEffect(() => {
    const listener = (data) => ref.current(data);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      {items.map((p) => (
        <div
          key={p.id}
          className={`xp-popup ${
            p.variant === "damage"
              ? "xp-popup--damage"
              : p.variant === "heal"
              ? "xp-popup--heal"
              : ""
          }`}
          style={{ left: p.x, top: p.y }}
        >
          {p.text}
        </div>
      ))}
    </>
  );
}
