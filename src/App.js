import React, { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/front/LoginView";
import HomeView from "./views/front/HomeView";
import "./App.css";
import PrivateRoute from "./PrivateRoute"; // Import the PrivateRoute component
import PublicRoute from "./PublicRoute"; // Import the PublicRoute component
import TokenExpiryHandler from "./TokenExpiryHandler"; // Import the TokenExpiryHandler component
import ChefLaboView from "./views/front/ChefLaboView";
import ChefEquipeView from "./views/front/ChefEquipeView";
import DashboardWiew from "./views/back/DashboardWiew";
import PrivateRouteEquipe from "./PrivateRouteEquipe";
import PrivateRouteLabo from "./PrivateRouteLabo";
import PrivateRouteAdmin from "./PrivateRouteAdmin";
import { UserProvider } from "./UserContext";

axios.defaults.baseURL = "http://localhost:8000/api";
//axios.defaults.baseURL = 'https://events.recherche-scientifique-flshm.ma/api';
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default function App() {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, []);

  //<Route path="/" element={<HomeView />} />
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <TokenExpiryHandler>
          <Routes>
            ()
            <Route path="/login" element={<LoginView />} />
            <Route element={<PrivateRoute />}>
              <Route
                path="/"
                element={<HomeView handleLogout={handleLogout} />}
              />
            </Route>
            <Route element={<PrivateRouteEquipe />}>
              <Route
                path="/chef-equipe"
                element={<ChefEquipeView handleLogout={handleLogout} />}
              />
            </Route>
            <Route element={<PrivateRouteLabo />}>
              <Route
                path="/chef-labo"
                element={<ChefLaboView handleLogout={handleLogout} />}
              />
            </Route>
            <Route element={<PrivateRouteAdmin />}>
              <Route
                path="/admin"
                element={<DashboardWiew handleLogout={handleLogout} />}
              />
            </Route>
          </Routes>
        </TokenExpiryHandler>
      </BrowserRouter>
    </UserProvider>
  );
}
