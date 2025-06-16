import React from "react";
import "./styles/Overlay.css";

function AccountabilityPopup({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="overlay-bg">
      <div className="overlay-box">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default AccountabilityPopup;
