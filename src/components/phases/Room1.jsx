import React from "react";
import RoomTemplate from "../RoomTemplate";
import roomData from "../../data/roomData";

function Room1(props) {
  const config = roomData.mrWatkins;
  return (
    <RoomTemplate
      {...props}
      narrationKey="languages.room1.intro"
      mapMarker={config.id}
      requiresWarmup={config.requiresWarmup}
      hasWorkout={config.hasWorkout}
      hasScavenge={config.hasScavenge}
      unlocksRoom={config.unlocksRoom}
    />
  );
}

export default Room1;
