import { useEffect } from "react";
import { useState } from "react";
import apiClient from "../api/axios";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateUser = async function () {
      try {
        await apiClient.get("/user-auth/me");
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    authenticateUser();
  }, []);

  if (isLoading) return <div>Loading chats...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
