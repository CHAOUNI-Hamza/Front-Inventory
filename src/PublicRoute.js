import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const storedRole = localStorage.getItem("role");
  const role = storedRole ? parseInt(atob(storedRole), 10) : null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  switch (role) {
    case 0:
      return <Navigate to="/admin" />;
    case 1:
      return <Navigate to="/employe" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default PublicRoute;
