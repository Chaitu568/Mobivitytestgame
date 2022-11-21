import React from "react";

import classes from "./UsersList.module.css";

function UsersList(props) {
  const data = props.users.map((user) => {
    if (props.scored.includes(user.userId)) {
      user.scored = true;
    } else {
      user.scored = false;
    }
    return user;
  });
  return (
    <div
      className={`${classes.users} overflow-auto`}
      style={{ maxHeight: "200px" }}
    >
      <div className={classes.title}>Users</div>
      {data.map((user) => (
        <button key={user.userId} className={user.scored && classes.scored}>
          <h3>{user.userName}</h3>
          <span>{user.score}</span>
        </button>
      ))}
    </div>
  );
}

export default UsersList;
