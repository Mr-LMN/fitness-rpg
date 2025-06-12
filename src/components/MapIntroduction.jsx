import React from "react";

function MapIntroduction({ setGameState }) {
  const handleViewMap = () => {
    if (typeof setGameState !== "function") {
      console.error("setGameState is not a function. Please check the props passed to MapIntroduction.");
      return;
    }

    setGameState((prev) => ({
      ...prev,
      introStage: 5, // Transition to map view stage
      // Add "Mr. Watkins' Room" only if it hasn't been added already
      visibleRooms: prev.visibleRooms.includes("Mr. Watkins' Room")
        ? prev.visibleRooms
        : [...prev.visibleRooms, "Mr. Watkins' Room"],
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎒 A New Beginning</h2>
      <p>
        You step into the dim hallway, breathing heavy after escaping the locker room.
        Just as you start to gather your bearings, something crunches under your foot.
      </p>
      <p>
        A torn, dusty <strong>school bag</strong> lies abandoned near the lockers. Its straps are frayed,
        but it feels sturdy enough to carry what you need.
      </p>
      <p>
        Inside, you find a battered <strong>pamphlet-style school map</strong>, marked with strange scribbles:
        <em>“DO NOT ENTER - Roche?”</em> scrawled in red. Some rooms are circled. Others crossed out.
      </p>
      <p>
        Alongside it, an old sticky note: <em>“If you're reading this... stick to the Languages Wing.”</em>
      </p>
      <p>
        You sling the bag over your shoulder. From now on, you can collect supplies and keep track of your path.
      </p>
      <p>
        Mr. Watkins' room looks slightly ajar. It might be worth investigating first.
      </p>
      <button onClick={handleViewMap}>View Map and Begin Exploring</button>
    </div>
  );
}

export default MapIntroduction;