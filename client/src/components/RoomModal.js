import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import classes from "./RoomModal.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

function RoomModal(props) {
  const [enteredRoomName, setEnteredRoomName] = useState("");
  const nameChangeHandler = (event) => {
    setEnteredRoomName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.addHandler(enteredRoomName);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className={classes["modal__header"]}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            className={classes.plus}
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
          </svg>
          <span className={classes.createRoom}>Create Room</span>
          <button
            type="button"
            className={classes.close}
            onClick={props.handleClose}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
            </svg>
          </button>
        </div>
        <form className={classes.form} onSubmit={handleSubmit}>
          <label className={classes.label}>Room Type:</label>
          <br />
          <select name="roomType" className={classes.dropdown}>
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
          <br />
          <label className={classes.label}>Room Name:</label>
          <br />
          <input
            type="text"
            className={classes.input}
            value={enteredRoomName}
            onChange={nameChangeHandler}
          />
          <br />
          <button className={classes.join} type="submit">
            Start Playing!
          </button>
        </form>
      </Box>
    </Modal>
  );
}

export default RoomModal;
