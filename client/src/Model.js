import React, { useContext, useState } from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthContext from "./context/auth";

import classes from "./Model.module.css";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

function Model() {
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);
  const [enteredName, setEnteredName] = useState("");
  const authCtx = useContext(AuthContext);

  const handleNameChange = (event) => {
    setEnteredName(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.addUserHandler(enteredName);
    handleClose();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className={classes.modal}>
          <div className={classes.heading}>
            <span className={`${classes.title} ${classes.welcome}`}>
              Welcome to
            </span>
            <span className={`${classes.title} ${classes.logo}`}>
              Drasmash!
            </span>
            <form onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Enter any nickname"
                maxLength="12"
                autoComplete="off"
                spellCheck="false"
                value={enteredName}
                className={classes.nickName}
                onChange={handleNameChange}
              />
              <input
                type="submit"
                value="Play Game"
                className={classes.playGame}
              />
            </form>
          </div>
          <div className={classes.description}>
            <p>
              <strong>Drasmash</strong> is a drawing &amp; guessing game for
              your phone, tablet or PC. Do your best to draw the word you are
              given while players from around the world try to guess it!
            </p>
            <div>
              <div>
                <span>•</span>Avoid drawing words and letters.
              </div>
              <div>
                <span>•</span>Be polite and have fun!
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default Model;
