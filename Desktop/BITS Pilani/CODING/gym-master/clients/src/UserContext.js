import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "./url";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const PUBLIC_ROUTES = ["/login", "/signup", "/viewUsers", "/admin"];

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(`${URL}/auth/verify-token`, {
          withCredentials: true,
        });
        console.log("User role:", response);
        setUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
      } catch (error) {
        console.error("Token verification failed:", error.response?.data);
        setUser(null);
        setIsAuthenticated(false);
        setError("Authentication failed");
        if (!PUBLIC_ROUTES.includes(window.location.pathname)) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [navigate]);

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await axios.post(
          `${URL}/auth/login`,
          { email, password },
          { withCredentials: true }
        );

        setUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        navigate("/");
      } catch (error) {
        console.error("Login error:", error);
        setError(error.response?.data?.error || "Login failed");
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await axios.post(`${URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed");
    }
  }, [navigate]);

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(
        `${URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      setUser(response.data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch (error) {
      console.error("Token refresh failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      setError("Session expired. Please login again.");
      navigate("/login");
    }
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        error,
        updateUser,
        refreshToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
