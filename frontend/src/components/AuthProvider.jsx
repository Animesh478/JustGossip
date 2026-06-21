import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../api/user";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticateUser = async function () {
      try {
        const res = await fetchCurrentUser();
        // console.log("user auth=", res?.data);
        const userData = res?.data;
        setCurrentUser(userData);
      } catch (error) {
        console.error("Authentication failed.", error);
      } finally {
        setIsLoading(false);
      }
    };
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
