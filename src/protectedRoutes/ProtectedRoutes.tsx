import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // ⏳ Espera a que el contexto termine de cargar
  if (isLoading) {
    return <div className="text-center p-8 text-gray-500">Cargando sesión...</div>;
  }

  // 🚫 Si no hay sesión, redirige al login/landing
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si está autenticado, deja entrar
  return <Outlet />;
};

export default ProtectedRoutes;
