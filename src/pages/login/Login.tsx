import { useEffect } from "react";
import logo from "../../assets/logo.png";
import { useForm, type SubmitHandler } from "react-hook-form";
import { login } from "../../services/autentication";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface UsuarioCredenciales {
  numero_documento: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<UsuarioCredenciales>();
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, isAuthenticated } = useAuthContext();

  // ✅ Si ya está autenticado, redirige automáticamente
  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const idRol = parsedUser?.rol?.idRol;

        if (idRol === 3) navigate("/home/medico");
        else if (idRol === 2) navigate("/home/asesor");
        else if (idRol === 1) navigate("/usuarios");
        else if (idRol === 4) navigate("/home/paciente");
        else navigate("/");
      }
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<UsuarioCredenciales> = async (data) => {
    try {
      toast.loading("Verificando credenciales...", { id: "login" }); 
      const res = await login(data);
      const respu = await res?.json();

      if (respu.message !== "Acceso permitido") {
        setIsAuthenticated(false);
        toast.error("Credenciales incorrectas. Verifica tu documento o contraseña.", { id: "login" });
        return;
      }

      // ✅ Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(respu.data));
      localStorage.setItem("token", respu.token ?? "");

      // ✅ Guardar en contexto
      setUser(respu.data);
      setIsAuthenticated(true);

      toast.dismiss("login");
      toast.success(`¡Bienvenido ${respu.data?.nombre || ""}!`);

      const idRol = respu.data?.rol?.idRol;

      // ✅ Redirigir según rol
      if (idRol === 3) navigate("/home/medico");
      else if (idRol === 2) navigate("/home/asesor");
      else if (idRol === 1) navigate("/usuarios");
      else if (idRol === 4) navigate("/home/paciente");
      else navigate("/");
    } catch (e) {
      console.error("Error en login:", e);
      setIsAuthenticated(false);
      toast.dismiss("login");
      toast.error("Ocurrió un error al iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Previmed" className="h-22 object-contain" />
        </div>

        {/* Mensaje de bienvenida */}
        <div className="text-left mb-8">
          <h2 className="text-2xl font-semibold text-lgreen">Hola</h2>
          <p className="text-gray-600">Bienvenido a Previmed</p>
        </div>

        {/* Formulario */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Número de documento"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            maxLength={15}
            {...register("numero_documento", { required: true })}
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
            minLength={5}
            maxLength={15}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            {...register("password", { required: true })}
          />

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
