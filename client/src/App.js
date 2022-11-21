import React, { useContext, useEffect } from "react";
import Rooms from "./Rooms";
import Model from "./Model";
import MainHeader from "./components/MainHeader";
import AuthContext from "./context/auth";
import Room from "./components/Room";

import "./App.css";

function App() {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.isLoggedIn && !authCtx.roomOpened) {
      authCtx.socket.emit("logout", authCtx.user.id);
    }
  }, [authCtx.isLoggedIn, authCtx.roomOpened, authCtx.socket, authCtx.user.id]);

  return (
    <div className="App">
      <MainHeader />
      <main>
        {!authCtx.isLoggedIn && <Model />}
        {authCtx.isLoggedIn && !authCtx.roomOpened && (
          <Rooms onRoomClick={authCtx.roomJoinHandler} />
        )}
        {authCtx.isLoggedIn && authCtx.roomOpened && (
          <Room roomId={authCtx.openedRoomId} />
        )}
      </main>
    </div>
  );
}

export default App;
