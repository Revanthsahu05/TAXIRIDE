import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();
const socket = io(`${import.meta.env.VITE_BASE_URL}`);
const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });
    // return () => {
    //   socket.disconnect();
    // };
  }, []);
   const sendmessage = (eventname, message) => {
     socket.emit(eventname, message);
   };
   const recievemessage=(eventname,callback)=>{
    socket.on(eventname,callback);
   }
   return (
    <SocketContext.Provider value={{ socket ,sendmessage, recievemessage }}>  
    {children} 
    </SocketContext.Provider>
   )
};

export default SocketProvider;