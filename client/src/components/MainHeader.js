import React from "react";

import NavBar from "./NavBar";
import classes from "./MainHeader.module.css";

const MainHeader = (props) => {
  return (
    <header className={classes["main-header"]}>
      <NavBar />
    </header>
  );
};

export default MainHeader;
