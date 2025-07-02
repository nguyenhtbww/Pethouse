import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const BaoVeRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default BaoVeRoute;
