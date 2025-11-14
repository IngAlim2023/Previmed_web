import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { login } from "../../services/autentication";
import { getUsuarioById } from "../../services/usuarios";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const logo =
  "https://res.cloudinary.com/dudqqzt1k/image/upload/v1761411217/logo_mucors.png";
const previmedImg =
  "https://res.cloudinary.com/dudqqzt1k/image/upload/v1761360937/PREVIMED_Full_Color_zwphjh.png";

interface UsuarioCredenciales {
  numero_documento: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<UsuarioCredenciales>();
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, isAuthenticated } = useAuthContext();
  const numeroDocumento = watch("numero_documento");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (isAuthenticated && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const rol = (parsedUser?.rol?.nombreRol ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (rol === "medico") navigate("/home/medico");
      else if (rol === "asesor") navigate("/home/asesor");
      else if (rol === "administrador") navigate("/home/admin");
      else if (rol === "paciente") navigate("/home/paciente");
      else navigate("/");
    }
  }, []);

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    e.target.value = value;
  };

  const onSubmit: SubmitHandler<UsuarioCredenciales> = async (data) => {
    try {
      setIsLoading(true);
      toast.loading("Verificando credenciales...", { id: "login" });

      const res = await login(data);
      const respu = await res?.json();

      if (!respu || respu.message !== "Acceso permitido") {
        setIsAuthenticated(false);
        toast.error("Credenciales incorrectas.", { id: "login" });
        return;
      }

      const backendUser = respu.data;

      const nombreRaw =
        backendUser?.nombre ??
        backendUser?.usuario?.nombre ??
        backendUser?.nombres ??
        backendUser?.first_name ??
        "";
      const apellidoRaw =
        backendUser?.apellido ??
        backendUser?.usuario?.apellido ??
        backendUser?.apellidos ??
        backendUser?.last_name ??
        "";
      let nombreCompleto = `${nombreRaw} ${apellidoRaw}`.trim();

      const rolNombre =
        backendUser?.rol?.nombreRol ??
        backendUser?.rol_nombre ??
        backendUser?.usuario?.rol?.nombreRol ??
        backendUser?.rol ??
        "Desconocido";

      const posibleId =
        backendUser?.id ??
        backendUser?.id_usuario ??
        backendUser?.usuario?.id_usuario ??
        null;

      if (!nombreCompleto && posibleId) {
        try {
          const det = await getUsuarioById(String(posibleId));
          const du = det?.data ?? det ?? {};
          const n = du?.nombre ?? du?.first_name ?? "";
          const a = du?.apellido ?? du?.last_name ?? "";
          nombreCompleto = `${n} ${a}`.trim();
        } catch {
          // Silencioso
        }
      }

      const normalizedUser = {
        id: posibleId,
        documento:
          backendUser?.numero_documento ??
          backendUser?.documento ??
          backendUser?.usuario?.numero_documento ??
          null,
        nombre: nombreCompleto || backendUser?.nombre || "Usuario sin nombre",
        rol: { nombreRol: rolNombre },
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("token", respu.token ?? "");

      setUser(normalizedUser);
      setIsAuthenticated(true);

      toast.dismiss("login");
      toast.success(`¡Bienvenido ${normalizedUser.nombre}!`);

      const rol = (normalizedUser.rol?.nombreRol ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (rol === "medico") navigate("/home/medico");
      else if (rol === "asesor") navigate("/home/asesor");
      else if (rol === "administrador") navigate("/home/admin");
      else if (rol === "paciente") navigate("/home/paciente");
      else navigate("/");
    } catch (e) {
      setIsAuthenticated(false);
      toast.dismiss("login");
      toast.error("Ocurrió un error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

      {/* ====================== COLUMNA IZQUIERDA ======================= */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-gray-50">

        <div className="flex justify-center mb-8">
          <img src={previmedImg} alt="Previmed" className="h-20 object-contain" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Tu salud con nosotros esta segura
        </h2>

        <p className="text-gray-600 text-sm mb-8">
          Ingresa a tu cuenta Previmed y obtén acceso a todas tus funcionalidades
          desde un solo lugar.
        </p>

        <ul className="space-y-4 text-gray-700 text-sm">
          <li className="flex items-center gap-3">
            <span className="text-blue-600 text-xl">✓</span> Gestión de tus visitas médicas
          </li>
          <li className="flex items-center gap-3">
            <span className="text-blue-600 text-xl">✓</span> Información actualizada de tus médicos
          </li>
          <li className="flex items-center gap-3">
            <span className="text-blue-600 text-xl">✓</span> Seguimiento rápido y seguro
          </li>
          <li className="flex items-center gap-3">
            <span className="text-blue-600 text-xl">✓</span> Beneficios exclusivos
          </li>
        </ul>
      </div>

      {/* ====================== COLUMNA DERECHA FORM ======================= */}
      <div className="p-10 md:p-14 flex flex-col justify-center">

        
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Iniciar Sesión</h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

          {/* DOCUMENTO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Documento
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Ingresa tu número de documento"
              maxLength={15}
              onInput={handleDocumentoChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 outline-none"
              {...register("numero_documento", {
                required: "Este campo es obligatorio",
                minLength: 5,
                pattern: /^\d+$/
              })}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                required
                minLength={5}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 outline-none"
                {...register("password")}
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </button>
            </div>
          </div>

          {/* BOTÓN LOGIN */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold
                        hover:bg-blue-700 transition shadow 
                        disabled:opacity-70`}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>

          

          
        </form>
      </div>
    </div>
  </div>
);
}


export default Login;
