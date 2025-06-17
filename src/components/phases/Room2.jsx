import React from "react";
import RoomTemplate from "../RoomTemplate";
import quizPool from "../../data/quizPool";
import lootTable from "../../data/lootTable";

function Room2(props) {
  return (
    <RoomTemplate
      {...props}
      narrationKey="languages.room2.intro"
      quiz={quizPool.languages.room2}
      lootPool={lootTable.languages.room2}
      mapMarker="Mrs. John's Room"
    />
  );
}

export default Room2;
