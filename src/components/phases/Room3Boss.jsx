import React from "react";
import RoomTemplate from "../RoomTemplate";
import quizPool from "../../data/quizPool";
import bossData from "../../data/bossData";

function Room3Boss(props) {
  return (
    <RoomTemplate
      {...props}
      narrationKey="languages.rocheBoss.leadIn"
      quiz={quizPool.languages.rocheBoss}
      boss={bossData.languages.roche}
      mapMarker="Mrs. Roche's Room"
    />
  );
}

export default Room3Boss;
