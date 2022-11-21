import React from "react";

import classes from "./ButtonItem.module.css";

function ButtonItem(props) {
  const clickHanlder = () => {
    props.onClick(props.id);
  };
  return (
    <li className={classes["button-item"]} onClick={clickHanlder}>
      {props.children}
    </li>
  );
}

export default ButtonItem;
