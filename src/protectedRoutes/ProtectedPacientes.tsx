import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import PreviBot from "../components/n8n/PreviBot";
import { useAuthContext } from "../context/AuthContext";

const ProtectedPacientes:React.FC = () => {
    const {user} = useAuthContext();
    console.log(user.rol?.nombreRol)

    if(user.rol?.nombreRol != 'Paciente'){
        return <Navigate to='/xyz' replace />
    }
  return (
    <div>
      <PreviBot/>
      <Outlet/>
    </div>
  )
}

export default ProtectedPacientes
