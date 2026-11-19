import React, { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();
const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const SocketProvider = ({ children }) => {
  const lastJoinData = useRef(null);

  useEffect(() => {
    const handleConnect = () => {
      console.log("[Socket] Connected to server:", socket.id);
      // Auto-rejoin room on reconnect
      if (lastJoinData.current) {
        socket.emit("join", lastJoinData.current);
      }
    };

    const handleDisconnect = (reason) => {
      console.log("[Socket] Disconnected from server:", reason);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const sendmessage = (eventname, message) => {
    if (eventname === "join") {
      lastJoinData.current = message;
    }
    socket.emit(eventname, message);
  };

  const recievemessage = (eventname, callback) => {
    socket.on(eventname, callback);
  };

  return (
    <SocketContext.Provider value={{ socket, sendmessage, recievemessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;