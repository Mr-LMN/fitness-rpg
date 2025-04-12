import React from "react";
import "./styles/Map.css"; // You can replace this with Overlay.css later if needed

function RoomNarrativeOverlay({ roomName, onContinue }) {
  const introText = {
    "Mr. Watkins' Room": [
      "You push open the door to Mr. Watkins' classroom. It's eerily quiet.",
      "Dust floats in the light. Papers are scattered across the desks.",
      "You step inside, unsure if you're alone…"
    ],
    "Mrs. John's Room": [
      "A faint tapping echoes through the hallway as you approach Mrs. John's room.",
      "The door creaks open… there's a strong smell of cleaning fluid and something else.",
      "Better be quick in here."
    ],
    "Mrs. Roche's Room": [
      "The air feels heavier as you reach Mrs. Roche's classroom.",
      "Something doesn't feel right. You hear movement inside.",
      "You grip your bag tighter. This could be trouble."
    ]
  };

  const lines = introText[roomName] || ["You enter the room…"];

  return (
    <div className="overlay-bg">
      <div className="overlay-box">
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
        <button onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

export default RoomNarrativeOverlay;
