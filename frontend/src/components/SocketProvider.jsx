import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { createSocketConnection } from "../../utils/socket";
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isLoading, currentUser } = useAuth();

  console.log("socketProvider, isLoading", isLoading);

  useEffect(() => {
    // if the user is not logged in, do not create socket connection
    if (isLoading) return;

    if (currentUser) {
      // initialize the connection
      const newSocket = createSocketConnection();

      newSocket.on("connect", () => {
        console.log("🟢 Global Socket connected:", newSocket.id);

        // save the socket to a state so the children can access it
        setSocket(newSocket);
      });

      // clean up function runs when component unmounts or the user changes
      return () => {
        console.log("🔴 Disconnecting global socket...");
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [isLoading, currentUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
