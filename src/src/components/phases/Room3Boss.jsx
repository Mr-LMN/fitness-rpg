import React, { useState, useEffect } from "react";
import Map from "../Map";

function Room3Boss() {
  const [timer, setTimer] = useState(0);
  const [shadowyFigure, setShadowyFigure] = useState(false);
  const [escapeStarted, setEscapeStarted] = useState(false);
  const [completedRooms, setCompletedRooms] = useState(["Locker Room", "Mr. Watkins' Room", "Mrs. John's Room"]);
  const [currentRoom, setCurrentRoom] = useState("Mrs. Roche's Room");
  const [annotations, setAnnotations] = useState([
    { text: "Strange noises?", x: 450, y: 80 },
  ]);

  useEffect(() => {
    if (escapeStarted) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      if (timer === 10) {
        setShadowyFigure(true);
        setAnnotations((prev) => [
          ...prev,
          { text: "Shadowy figure spotted!", x: 450, y: 120 },
        ]);
      }

      return () => clearInterval(interval);
    }
  }, [timer, escapeStarted]);

  const startWorkout = () => {
    setEscapeStarted(true);
  };

  const handleEscapeRoom = () => {
    alert("You escaped Mrs. Roche's room!");
    setCompletedRooms((prev) => [...prev, "Mrs. Roche's Room"]);
    setCurrentRoom("Fitness Suite");
    setAnnotations((prev) => [
      ...prev,
      { text: "Final Battle Prep", x: 600, y: 180 },
    ]);
  };

  return (
    <div className="room3boss-container">
      <h2>Mrs. Roche's Room</h2>
      <Map
        currentRoom={currentRoom}
        completedRooms={completedRooms}
        annotations={annotations}
      />
      {!escapeStarted && (
        <button onClick={startWorkout}>Start Workout</button>
      )}
      {shadowyFigure && <p>A shadowy figure is approaching... The door slams shut!</p>}
      {escapeStarted && shadowyFigure && (
        <button onClick={handleEscapeRoom}>Escape Room</button>
      )}
    </div>
  );
}

export default Room3Boss;