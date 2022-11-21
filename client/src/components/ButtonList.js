import React from "react";

import ButtonItem from "./ButtonItem";
import classes from "./ButtonList.module.css";

function ButtonList(props) {
  return (
    <ul className={classes["button-list"]}>
      {props.words.map((word, index) => (
        <ButtonItem key={index} id={index} onClick={props.onClick}>
          {word}
        </ButtonItem>
      ))}
    </ul>
  );
}

export default ButtonList;
