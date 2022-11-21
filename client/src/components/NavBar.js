import React, { useContext } from "react";

import AuthContext from "../context/auth";

import classes from "./NavBar.module.css";

function NavBar() {
  const authCtx = useContext(AuthContext);

  return (
    <nav className={classes.nav}>
      <ul>
        <li>
          <a href="/">
            <img src="./color-palette.png" />{" "}
            <span>
              <h2>Drasmash</h2>
            </span>
          </a>
        </li>

        {authCtx.isLoggedIn && (
          <div className={classes.rightNav}>
            <li>
              <a href="/">
                <img src="./user.png" /> <span> {authCtx.userName}</span>
              </a>
            </li>
            <li>
              <button onClick={authCtx.logoutHandler}>Logout</button>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
