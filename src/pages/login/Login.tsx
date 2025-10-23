import { useEffect } from "react";
import logo from "../../assets/logo.png";
import { useForm, type SubmitHandler } from "react-hook-form";
import { login } from "../../services/autentication";
import { getUsuarioById } from "../../services/usuarios";
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

  // ✅ Si ya hay sesión activa, redirige una sola vez
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
  }, []); // ← solo al montar

  // ✅ Enviar credenciales y procesar login
  const onSubmit: SubmitHandler<UsuarioCredenciales> = async (data) => {
    try {
      toast.loading("Verificando credenciales...", { id: "login" });

      const res = await login(data);
      const respu = await res?.json();

      if (!respu || respu.message !== "Acceso permitido") {
        setIsAuthenticated(false);
        toast.error("Credenciales incorrectas.", { id: "login" });
        return;
      }

      // 🔹 Datos crudos del backend
      const backendUser = respu.data;

      // 🔹 Aseguramos nombre y rol incluso si faltan en la respuesta
      const nombreRaw =
        backendUser?.nombre ??
        backendUser?.usuario?.nombre ??
        backendUser?.nombres ??
        backendUser?.first_name ?? "";
      const apellidoRaw =
        backendUser?.apellido ??
        backendUser?.usuario?.apellido ??
        backendUser?.apellidos ??
        backendUser?.last_name ?? "";
      let nombreCompleto = `${nombreRaw} ${apellidoRaw}`.trim();

      const rolNombre =
        backendUser?.rol?.nombreRol ??
        backendUser?.rol_nombre ??
        backendUser?.usuario?.rol?.nombreRol ??
        backendUser?.rol ??
        "Desconocido";

      // 🔹 Intento extra: consultar usuario por ID si no hay nombre
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
          // Silencioso: seguimos con fallback por si falla
        }
      }

      // 🔹 Usuario normalizado para AuthContext
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

      // 🔹 Guardar datos persistentes
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("token", respu.token ?? "");

      // 🔹 Actualizar contexto global
      setUser(normalizedUser);
      setIsAuthenticated(true);

      toast.dismiss("login");
      toast.success(`¡Bienvenido ${normalizedUser.nombre}!`);

      // 🔹 Redirección según rol
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* 🔹 Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Previmed" className="h-22 object-contain" />
        </div>

        {/* 🔹 Encabezado */}
        <div className="text-left mb-8">
          <h2 className="text-2xl font-semibold text-lgreen">Hola</h2>
          <p className="text-gray-600">Bienvenido a Previmed</p>
        </div>

        {/* 🔹 Formulario */}
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
