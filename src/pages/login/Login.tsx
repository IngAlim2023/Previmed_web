import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const [documento, setDocumento] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  // Datos temporales pra ver si loguea
  const usuarioTemporal = {
    documento: '123456789',
    contrasena: '123456789',
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!documento || !contrasena) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (contrasena.length < 6 || contrasena.length > 20) {
      toast.error('La contraseña debe tener entre 6 y 20 caracteres');
      return;
    }

    if (
      documento === usuarioTemporal.documento &&
      contrasena === usuarioTemporal.contrasena
    ) {
      // Redirigir al home del médico
      navigate('/homemedico');
    } else {
      toast.error('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="logo previmed" className="h-22" />
        </div>
        <div className="text-left mb-8">
          <h2 className="text-2xl font-semibold text-lgreen">Hola</h2>
          <p className="text-gray-600">Bienvenido a Previmed</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Número de documento"
            required
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            minLength={6}
            maxLength={20}
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-lgreen to-lblue text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
