import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import logo from '../../assets/logo.png';

// Interfaz para tipar las credenciales del usuario
interface UsuarioCredenciales {
  documento: string;
  contrasena: string;
}

const Login: React.FC = () => {
  // Estados para manejar los campos del formulario
  const [documento, setDocumento] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  
  // Hook para navegación programática
  const navigate = useNavigate();

  // Constantes de validación
  const LONGITUD_MIN_CONTRASENA = 6;
  const LONGITUD_MAX_CONTRASENA = 20;

  // Datos temporales para autenticación
  const usuarioTemporal: UsuarioCredenciales = {
    documento: '123456789',
    contrasena: '123456789',
  };

  // Función para validar las credenciales ingresadas
  const validarCredenciales = (): boolean => {
    // Verificar campos vacíos
    if (!documento.trim() || !contrasena.trim()) {
      toast.error('Todos los campos son obligatorios');
      return false;
    }

    // Verificar longitud de contraseña
    if (contrasena.length < LONGITUD_MIN_CONTRASENA || contrasena.length > LONGITUD_MAX_CONTRASENA) {
      toast.error(`La contraseña debe tener entre ${LONGITUD_MIN_CONTRASENA} y ${LONGITUD_MAX_CONTRASENA} caracteres`);
      return false;
    }

    return true;
  };

  // Función para autenticar usuario
  const autenticarUsuario = (): boolean => {
    return documento === usuarioTemporal.documento && contrasena === usuarioTemporal.contrasena;
  };

  // Manejador del envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Validar credenciales antes de proceder
    if (!validarCredenciales()) {
      return;
    }

    // Intentar autenticar usuario
    if (autenticarUsuario()) {
      toast.success('¡Inicio de sesión exitoso!');
      // Redirigir al dashboard del médico después de un pequeño delay
      setTimeout(() => {
        navigate('/home/medico');
      }, 1000);
    } else {
      toast.error('Credenciales incorrectas. Verifique su documento y contraseña');
    }
  };

  // Manejadores de cambio para los inputs (con sanitización básica)
  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const valor = e.target.value.replace(/\D/g, ''); // Solo números
    setDocumento(valor);
  };

  const handleContrasenaChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setContrasena(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* <Toaster */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Logo de la aplicación */}
        <div className="flex justify-center mb-6">
          <img 
            src={logo} 
            alt="Logo Previmed" 
            className="h-22 object-contain" 
          />
        </div>
        
        {/* Mensaje de bienvenida */}
        <div className="text-left mb-8">
          <h2 className="text-2xl font-semibold text-lgreen">Hola</h2>
          <p className="text-gray-600">Bienvenido a Previmed</p>
        </div>
        
        {/* Formulario de login */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo de documento */}
          <div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Número de documento"
              required
              value={documento}
              onChange={handleDocumentoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              maxLength={15}
            />
          </div>
          
          {/* Campo de contraseña */}
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              required
              minLength={LONGITUD_MIN_CONTRASENA}
              maxLength={LONGITUD_MAX_CONTRASENA}
              value={contrasena}
              onChange={handleContrasenaChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-lgreen to-lblue text-white py-2 rounded-md hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium"
          >
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;