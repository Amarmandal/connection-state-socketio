import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:8000";
const SOCKET_URL = "http://ticketing.dev";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
  upgrade: false,
});
