import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Notificaciones from "../components/administrador/Notificaciones";

const ProtectedAdministrador: React.FC = () => {
  const { user } = useAuthContext();

  if (user.rol?.nombreRol != "Administrador") {
    return <Navigate to="/xyz" replace />;
  }

  return (
    <div>
      <Notificaciones/>
      <Outlet />
    </div>
  );
};

export default ProtectedAdministrador;
