import React from "react";
import RoomTemplate from "../RoomTemplate";
import quizPool from "../../data/quizPool";
import lootItems from "../../data/lootTable";

const room2Loot = lootItems.filter((it) =>
  (it.contexts || []).includes("languages.room2")
);

function Room2(props) {
  return (
    <RoomTemplate
      {...props}
      narrationKey="languages.room2.intro"
      quiz={quizPool.languages.room2}
      lootPool={room2Loot}
      mapMarker="Mrs. John's Room"
    />
  );
}

export default Room2;
