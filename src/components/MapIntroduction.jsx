import React from "react";

function MapIntroduction({ setGameState }) {
  const handleViewMap = () => {
    // Transition to map view and unlock Mr. Watkins' Room
    setGameState((prev) => ({
      ...prev,
      introStage: 5,
      visibleRooms: ["Mr. Watkins' Room"] // fog-of-war start point
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎒 A New Beginning</h2>
      <p>
        After escaping, you stumble upon a dusty old <strong>bag</strong> by the lockers. It's torn, but still usable.
        Inside, you find a faded <strong>student map</strong> of Pencoedtre High School—scribbled with notes and warnings.
      </p>
      <p>
        You sling the bag over your shoulder. It'll help you <em>store useful items</em> along the way.
      </p>
      <p>
        🗺️ <em>Languages Wing, Maths Block, Science Labs…</em> The layout is still clear enough to follow.
      </p>
      <p>✨ New areas will unlock as you progress. Mr. Watkins' room seems ajar—you decide to investigate there first.</p>
      <button onClick={handleViewMap}>View School Map</button>
    </div>
  );
}

export default MapIntroduction;
