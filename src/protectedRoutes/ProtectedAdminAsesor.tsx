import React from 'react';
import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedAdminAsesor:React.FC = () => {
  const { user } = useAuthContext();
  
    if (user.rol?.nombreRol === "Paciente" || user.rol?.nombreRol === "Medico") {
      return <Navigate to='/xyz'replace/>
    }
  
    return <Outlet />;
}

export default ProtectedAdminAsesor
