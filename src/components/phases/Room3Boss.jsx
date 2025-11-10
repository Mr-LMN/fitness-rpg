import React from "react";
import RoomTemplate from "../RoomTemplate";
import quizPool from "../../data/quizPool";
import bossData from "../../data/bossData";
import roomData from "../../data/roomData";

function Room3Boss(props) {
  const config = roomData.mrsRoche;
  return (
    <RoomTemplate
      {...props}
      narrationKey="languages.rocheBoss.leadIn"
      quizIntroKey="languages.rocheBoss.quizIntro"
      quiz={quizPool.languages.rocheBoss}
      boss={bossData.languages.roche}
      mapMarker={config.id}
      requiresWarmup={config.requiresWarmup}
      hasWorkout={config.hasWorkout}
      unlocksRoom={config.unlocksRoom}
      specialWorkout={config.specialWorkout}
    />
  );
}

export default Room3Boss;
