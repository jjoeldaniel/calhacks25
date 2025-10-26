import React, { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";
import BackendConfig from "../Config/BackendConfig.ts";

const socketEndpoint = BackendConfig.socketEndpoint;

// exported socket instance (typed)
export const socket: Socket = io(socketEndpoint, {
  path: "/socket",
  reconnectionDelayMax: 10000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
});

// context typed to Socket | null
const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = (): Socket => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider Context.");
  return ctx;
};