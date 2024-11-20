import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteEquipe = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const storedRole = localStorage.getItem("role");
  const role = storedRole ? parseInt(atob(storedRole), 10) : null;
  return isAuthenticated && role === 1 ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouteEquipe;
