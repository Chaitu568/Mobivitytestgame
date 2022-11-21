import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ id, children, getSocket }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io("http://localhost:8080", { query: { id } });
    setSocket(newSocket);

    getSocket(socket);

    return () => newSocket.close();
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
