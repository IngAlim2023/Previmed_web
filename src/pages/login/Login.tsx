import React from 'react';
import logo from '../../assets/logo.png';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          {/* Foto de previmed */}
          <img src={logo} alt="logo previmed" className="h-22" />
        </div>
        <div className="text-left mb-8">
          {/* Saludo */}
          <h2 className="text-2xl font-semibold text-lgreen">Hola</h2>
          <p className="text-gray-600">Bienvenido a Previmed</p>
        </div>
        <form className="space-y-4">
          {/* Formulario */}
          <input 
            type="email" 
            placeholder="Correo" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-lgreen to-lblue  text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
