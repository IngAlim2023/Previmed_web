import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import { useForm, type SubmitHandler } from "react-hook-form";
import { login } from "../../services/autentication";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Interfaz para tipar las credenciales del usuario
interface UsuarioCredenciales {
  numero_documento: string;
  numero_documentoRequired: string;
  password: string;
  passwordRequired: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<UsuarioCredenciales>();
  const navigate = useNavigate();

  const { setUser, setIsAuthenticated, isAuthenticated } =
    useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home/asesor");
    }
  }, [isAuthenticated]);

  const onSubmit: SubmitHandler<UsuarioCredenciales> = async (data) => {
    try {
      const res = await login(data);

      const respu = await res?.json();
      if (respu.message != "Acceso permitido") {
        return setIsAuthenticated(false);
      }
      setUser(respu.data);
      navigate('/home/medico')
      return setIsAuthenticated(true);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* <Toaster */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Logo de la aplicación */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Previmed" className="h-22 object-contain" />
        </div>

        {/* Mensaje de bienvenida */}
        <div className="text-left mb-8">
          <h2 className="text-2xl font-semibold text-lgreen">Hola</h2>
          <p className="text-gray-600">Bienvenido a Previmed</p>
        </div>

        {/* Formulario de login */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de documento */}
          <div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Número de documento"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              maxLength={15}
              {...register("numero_documento", { required: true })}
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              required
              minLength={5}
              maxLength={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              {...register("password", { required: true })}
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
