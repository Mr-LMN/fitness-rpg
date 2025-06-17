import React from "react";
import RoomTemplate from "../RoomTemplate";
import lootTable from "../../data/lootTable";

function Room1(props) {
  return (
    <RoomTemplate
      {...props}
      narrationKey="languages.room1.intro"
      lootPool={lootTable.languages.room1}
      mapMarker="Mr. Watkins' Room"
    />
  );
}

export default Room1;
