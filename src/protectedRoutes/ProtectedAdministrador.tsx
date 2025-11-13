import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedAdministrador: React.FC = () => {
  const { user } = useAuthContext();

  if (user.rol?.nombreRol != "Administrador") {
    return <Navigate to='/xyz'replace/>
  }

  return <Outlet />;
};

export default ProtectedAdministrador;
