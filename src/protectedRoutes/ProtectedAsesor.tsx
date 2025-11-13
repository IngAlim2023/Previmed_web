import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedAsesor:React.FC = () => {
    const {user} = useAuthContext();
    if(user.rol?.nombreRol != "Asesor"){
        return <Navigate to='/xyz' replace/>
    }
  return (
    <Outlet/>      
  )
}

export default ProtectedAsesor
