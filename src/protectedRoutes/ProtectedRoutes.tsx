import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoutes;
