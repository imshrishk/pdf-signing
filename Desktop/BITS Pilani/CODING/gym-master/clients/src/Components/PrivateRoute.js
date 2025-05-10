import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useContext(UserContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && (!user || user.role !== "admin")) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
