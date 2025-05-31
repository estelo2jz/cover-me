import React from "react";
import { Navigate } from "react-router-dom";

// Dummy auth check — replace with real logic
const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true";
};

export default function AuthGuard({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}
