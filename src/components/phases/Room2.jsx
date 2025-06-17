import React from "react";
import RoomTemplate from "../RoomTemplate";
import quizPool from "../../data/quizPool";
import lootItems from "../../data/lootTable";
import roomData from "../../data/roomData";

const room2Loot = lootItems.filter((it) =>
  (it.contexts || []).includes("languages.room2")
);

function Room2(props) {
  const config = roomData.mrsJohn;
  return (
    <RoomTemplate
      {...props}
      narrationKey="languages.room2.intro"
      safeIntroKey="languages.room2.quizIntro"
      safeQuiz={quizPool.languages.room2}
      lootPool={room2Loot}
      mapMarker={config.id}
      requiresWarmup={config.requiresWarmup}
      hasWorkout={config.hasWorkout}
      unlocksRoom={config.unlocksRoom}
    />
  );
}

export default Room2;
