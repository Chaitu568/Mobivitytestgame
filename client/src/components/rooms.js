import React, { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../context/auth";

import { generateSlug } from "random-word-slugs";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Container from "./container/Container";
import ButtonList from "./ButtonList";
import UsersList from "./UsersList";
import OpenConversation from "./OpenConversation";
import Countdown from "react-countdown";
import classes from "./Room.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Room(props) {
  const [usersDetails, setUsersDetails] = useState([]);
  const authCtx = useContext(AuthContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isYou, setIsYou] = useState(false);
  const [userPlaying, setUserPlaying] = useState({});
  const [anotherModal, setAnotherModal] = useState(false);
  const [randomWords, setRandomWords] = useState([]);
  const [choose, setChoose] = useState(false);
  const chooseRef = useRef(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [timmer, setTimmer] = useState();
  const [scored, setScored] = useState([]);

  const socket = authCtx.socket;

  useEffect(() => {
    if (socket == null) return;

    socket.on("joined", (users) => {
      setUsersDetails(users);
    });

    socket.on("left", (users) => {
      setUsersDetails(users);
    });

    socket.on("logout", (groupUsers) => {
      setUsersDetails(groupUsers[props.roomId]);
    });

    socket.on("play-game", (user) => {
      setIsPlaying(true);
      setTimmer(Date.now() + 100000);
      setUserPlaying(user);
      setScored([]);
      if (user.userId === authCtx.id) {
        setIsYou(true);
        const words = generateSlug(4, {
          partsOfSpeech: ["noun", "noun", "noun", "noun"],
        });
        setRandomWords(words.split("-"));
        setChoose(true);
      } else {
        setAnotherModal(true);
      }
    });

    socket.on("selected-word", (word) => {
      setSelectedWord(word);
      setAnotherModal(false);
    });

    socket.on("stop-playing", () => {
      setScored([]);
      setIsPlaying(false);
      setIsYou(false);
      setUserPlaying({});
      setChoose(false);
      setSelectedWord("");
      setRandomWords([]);
      setAnotherModal(false);
    });

    socket.on("increase-score", (users, id) => {
      setUsersDetails(users);
      setScored((prevScored) => [...prevScored, id]);
    });

    return () => {
      socket.off("joined");
      socket.off("left");
      socket.off("logout");
      socket.off("play-game");
      socket.off("selected-word");
      socket.off("stop-playing");
      socket.off("increase-score");
    };
  }, [socket]);

  useEffect(() => {
    chooseRef.current = choose;
    if (chooseRef.current === true) {
      setTimeout(() => {
        if (chooseRef.current === false) return;
        if (selectedWord.length) {
          return;
        }
        setSelectedWord(randomWords[0]);
        setChoose(false);
      }, 10000);
    }
  }, [choose]);

  useEffect(() => {
    if (selectedWord.length > 0 && isYou) {
      socket.emit("choosed-word", selectedWord, props.roomId);
    }
  }, [selectedWord]);

  const handleOnChoose = (index) => {
    setSelectedWord(randomWords[index]);
    setChoose(false);
  };

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      const you = isYou;
      setIsPlaying(false);
      setIsYou(false);
      setUserPlaying({});
      setChoose(false);
      setSelectedWord("");
      setRandomWords([]);
      setAnotherModal(false);
      if (you) {
        socket.emit("next-player", authCtx.id, props.roomId);
      }
      return;
    } else {
      const total = minutes * 60 + seconds;
      return <span>{total}</span>;
    }
  };

  const choosingTime = ({ seconds, completed }) => {
    if (completed) {
      return;
    } else {
      return <span>{seconds}</span>;
    }
  };

  let content;
  if (!isPlaying) {
    content = (
      <div className={classes.waiting}>Waiting for other players ...</div>
    );
  } else if (isYou && selectedWord.length) {
    content = (
      <div className={classes.divBar}>
        <div>Your word: {selectedWord}</div>

        <button className={classes["button-24"]}>
          <Countdown date={timmer} renderer={renderer} />
        </button>
      </div>
    );
  } else if (!isYou && selectedWord.length) {
    content = (
      <div className={classes.divBar}>
        <div>{userPlaying.userName} is drawing.</div>

        <button className={classes["button-24"]}>
          <Countdown date={timmer} renderer={renderer} />
        </button>
      </div>
    );
  }

  return (
    <>
      {content}
      <div style={{ display: "flex", minHeight: "100%" }}>
        <Modal
          open={choose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Choose any word{" "}
              <Countdown date={Date.now() + 10000} renderer={choosingTime} />
            </Typography>
            <ButtonList words={randomWords} onClick={handleOnChoose} />
          </Box>
        </Modal>

        <Modal
          open={anotherModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {userPlaying.userName} is choosing.
            </Typography>
            <ButtonList words={randomWords} onClick={handleOnChoose} />
          </Box>
        </Modal>

        <Container socket={socket} roomId={props.roomId} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            margin: "20px",
          }}
        >
          <UsersList users={usersDetails} scored={scored} />
          <OpenConversation
            groupId={props.roomId}
            selectedWord={selectedWord}
            isYou={isYou}
            scored={scored}
          />
        </div>
      </div>
    </>
  );
}

export default Room;
