import { io } from "socket.io-client";

export const createSocketConnection = function () {
  return io("http://localhost:8000");
};
