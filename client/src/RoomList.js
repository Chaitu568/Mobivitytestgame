import React from "react";

import RoomItem from "./components/RoomItem";
import classes from "./RoomList.module.css";

function RoomList(props) {
  return (
    <ul className={classes["room-list"]}>
      {props.rooms.map((room) => (
        <RoomItem key={room.id} id={room.id} onJoin={props.onRoomClick}>
          {room.name}
        </RoomItem>
      ))}
    </ul>
  );
}

export default RoomList;
