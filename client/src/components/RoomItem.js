import React from "react";

import classes from "./RoomItem.module.css";

function RoomItem(props) {
  const joinHanlder = () => {
    props.onJoin(props.id);
  };
  return (
    <li className={classes["room-item"]} onClick={joinHanlder}>
      {props.children}
    </li>
  );
}

export default RoomItem;
