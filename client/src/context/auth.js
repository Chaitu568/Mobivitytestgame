import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import io from "socket.io-client";

const AuthContext = React.createContext({
  isLoggedIn: false,
  id: "",
  user: {},
  userName: "",
  addUserHandler: (name) => {},
  logoutHandler: () => {},
  roomJoinHandler: (id) => {},
  socket: {},
  openedRoomId: "",
  roomOpened: false,
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ id: "", name: "" });
  const [socket, setSocket] = useState();
  const [roomOpened, setRoomOpened] = useState(false);
  const [openedRoomId, setOpenedRoomId] = useState("");

  useEffect(() => {
    const loggedInInformation = localStorage.getItem("isLoggedIn");
    if (loggedInInformation === "1") {
      const name = localStorage.getItem("userName");
      const id = localStorage.getItem("userId");
      setUser({ name, id });
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      query: { id: user.id },
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [user.id]);

  const addUserHandler = (name) => {
    const id = uuidV4();

    setUser({ name, id });
    setIsLoggedIn(true);
    localStorage.setItem("userName", name);
    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("userId", id);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");

    socket.emit("logout", user.id);
    setIsLoggedIn(false);
    setUser({});
    setRoomOpened(false);
    setOpenedRoomId("");
  };

  const roomJoinHandler = (id) => {
    setRoomOpened(true);
    setOpenedRoomId(id);
    socket.emit("join", id, user.id, user.name);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        isLoggedIn: isLoggedIn,
        addUserHandler: addUserHandler,
        logoutHandler: logoutHandler,
        userName: user.name,
        id: user.id,
        roomJoinHandler,
        socket: socket,
        roomOpened: roomOpened,
        openedRoomId: openedRoomId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
