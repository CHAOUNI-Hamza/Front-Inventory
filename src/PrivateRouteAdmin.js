import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteAdmin = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const storedRole = localStorage.getItem("role");
  const role = storedRole ? parseInt(atob(storedRole), 10) : null;

  return isAuthenticated && role === 0 ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouteAdmin;
