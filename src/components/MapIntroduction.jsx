import React from "react";
import "./styles/Map.css";

function MapIntroduction({ onClose }) {
  return (
    <div className="map-intro-overlay">
      <div className="map-intro-content">
        <h2>🗺️ You Found a Map!</h2>
        <p>
          You pick up a student pamphlet-style map of Pencoedtre High School. 
          It’s a bit scribbled, but it will help you navigate the school.
        </p>
        <button onClick={onClose}>View Map</button>
      </div>
    </div>
  );
}

export default MapIntroduction;