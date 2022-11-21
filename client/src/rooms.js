import React, { useContext, useEffect, useState } from "react";
import RoomList from "./RoomList";
import RoomModal from "./components/RoomModal";
import AuthContext from "./context/auth";

import classes from "./Rooms.module.css";

function Rooms(props) {
  const [rooms, setRooms] = useState([{ id: "1122333", name: "china" }]);
  const [open, setOpen] = useState(false);
  const authCtx = useContext(AuthContext);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addHandler = (enteredRoomName) => {
    const newRoom = {
      name: enteredRoomName,
      id: Math.random().toString(),
    };
    setRooms((prevRooms) => {
      return [...prevRooms, { ...newRoom }];
    });
    authCtx.socket.emit("added-room", newRoom);
    setOpen(false);
  };

  const quickPlayHandler = () => {
    if (rooms.length) {
      props.onRoomClick(rooms[0].id);
    }
  };

  useEffect(() => {
    if (authCtx.socket === null) return;
    console.log("getRooms");
    authCtx.socket.emit("getRoom", "hi");
    authCtx.socket.on("sendRoom", (rooms) => {
      console.log(rooms);
      setRooms(rooms);
    });
    authCtx.socket.on("added-room", (rooms) => {
      setRooms(rooms);
    });
    return () => {
      authCtx.socket.off("getRoom");
      authCtx.socket.off("send-room");
      authCtx.socket.off("added-room");
    };
  }, [authCtx.socket]);

  return (
    <div className={classes.Room}>
      <h2>Welcome to</h2>
      <h1>Drasmash!</h1>
      <div className={classes.buttons}>
        <button className={classes.quickPlay} onClick={quickPlayHandler}>
          Quick Play
        </button>
        <button onClick={handleOpen} className={classes.createRoom}>
          Create Room
        </button>
      </div>
      <div className={classes.roomsTitle}>
        <h2 style={{ color: "white" }}>Rooms</h2>
      </div>
      <RoomModal
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        addHandler={addHandler}
      />
      <RoomList rooms={rooms} onRoomClick={props.onRoomClick} />
    </div>
  );
}

export default Rooms;
