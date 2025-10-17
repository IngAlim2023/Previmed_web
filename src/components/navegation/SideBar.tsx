import { Link, useNavigate } from "react-router-dom";
import PREVIMED_Full_Color from "../../assets/PREVIMED_Full_Color.png";
import {
  FaUsers,
  FaUserMd,
  FaMoneyBill,
  FaClipboardList,
  FaCalendarAlt,
  FaHistory,
  FaFileContract,
  FaUserFriends,
  FaBriefcaseMedical,
  FaFileAlt,
  FaGift,
  FaWpforms,
  FaHospital,
  FaUserShield,
  FaTachometerAlt,
  FaBars,
} from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useAuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import type { JSX } from "react";

// ✅ Tipo de dato para las rutas
interface RouteItem {
  path: string;
  label: string;
  icon: JSX.Element;
  roles: string[];
}

type PropsSideBar = {
  cerrado: boolean;
  setCerrado: (value: boolean) => void;
};

const SideBar: React.FC<PropsSideBar> = ({ cerrado, setCerrado }) => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, user } = useAuthContext();
  // ✅ Todas las rutas con roles
  const routes: RouteItem[] = [
    // 🔹 ADMINISTRADOR
    { path: "/usuarios", label: "Usuarios", icon: <FaUsers />, roles: ["Administrador"] },
    { path: "/medicos", label: "Médicos", icon: <FaUserMd />, roles: ["Administrador"] },
    { path: "/pagos", label: "Pagos", icon: <FaMoneyBill />, roles: ["Administrador"] },
    { path: "/planes", label: "Planes", icon: <FaClipboardList />, roles: ["Administrador"] },
    { path: "/visitas", label: "Visitas", icon: <FaCalendarAlt />, roles: ["Administrador"] },
    { path: "/historial/visitas", label: "Historial Visitas", icon: <FaHistory />, roles: ["Administrador"] },
    { path: "/pacientes", label: "Pacientes", icon: <FaUserFriends />, roles: ["Administrador", "Asesor"] },
    { path: "/contrato", label: "Contrato", icon: <FaFileContract />, roles: ["Administrador"] },
    { path: "/beneficiarios", label: "Beneficiarios", icon: <FaUserFriends />, roles: ["Administrador"] },
    { path: "/contratos", label: "Contratos", icon: <FaFileAlt />, roles: ["Administrador"] },
    { path: "/beneficios_plan", label: "Beneficios Plan", icon: <FaGift />, roles: ["Administrador"] },
    { path: "/solicitudes", label: "Solicitudes", icon: <FaBriefcaseMedical />, roles: ["Administrador"] },
    { path: "/formas_pago", label: "Formas de Pago", icon: <FaWpforms />, roles: ["Administrador"] },
    { path: "/eps", label: "EPS", icon: <FaHospital />, roles: ["Administrador"] },
    { path: "/roles", label: "Roles", icon: <FaUserShield />, roles: ["Administrador"] },
    { path: "/panel_control", label: "Panel de Control", icon: <FaTachometerAlt />, roles: ["Administrador"] },

    // 🔹 ASESOR
    { path: "/contratos", label: "Membresías", icon: <FaClipboardList />, roles: ["Asesor"] },
    { path: "/pagos", label: "Registros Pagos", icon: <FaMoneyBill />, roles: ["Asesor"] },
    { path: "/barrios", label: "Barrios", icon: <FaTachometerAlt />, roles: ["Administrador", "Asesor"] },

    // 🔹MÉDICO
    {path:"/home/medico", label:"Inicio Médico", icon: <FaUserMd />, roles: ["Medico"]},
    {path:"visitas/medico", label:"Mis Visitas", icon:<FaCalendarAlt/>,roles:["Medico"]},

  ];

  // ✅ Filtrar rutas según el rol actual del usuario (versión robusta)
const filteredRoutes = routes.filter((route) => {
  const rolActual = (user.rol?.nombreRol || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // elimina tildes y espacios

  return route.roles.some(
    (r) =>
      r
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") === rolActual
  );
});


  // ✅ Cerrar sesión
  const handleLogout = () => {
    navigate("/");
    setIsAuthenticated(false);
    setUser({ id: null, documento: null, rol: null, nombre: null });
    Cookies.remove("auth");
    Cookies.remove("user");
    localStorage.removeItem("user");
  };

  return (
    <aside
      className={`fixed top-0 left-6 h-screen bg-blue-50 text-gray-600 flex flex-col transition-all duration-300 ${
        cerrado ? "w-20" : "w-48"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
        <button
          onClick={() => setCerrado(!cerrado)}
          className="p-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaBars />
        </button>
        {!cerrado && <img src={PREVIMED_Full_Color} alt="Logo" className="px-4" />}
      </div>

      {/* INFO DEL USUARIO */}
      {!cerrado && (
        <div className="px-6 py-2 border-b border-gray-300">
          <h2 className="text-xl font-bold text-blue-500">{user.nombre}</h2>
          <p className="text-md text-gray-400">{user.rol?.nombreRol}</p>
        </div>
      )}

      {/* MENÚ DE RUTAS */}
      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
        {filteredRoutes.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
          >
            <span className="text-lg">{icon}</span>
            {!cerrado && <span>{label}</span>}
          </Link>
        ))}

        {/* LOGOUT */}
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 cursor-pointer transition"
          onClick={handleLogout}
        >
          <LuLogOut className="text-lg" />
          {!cerrado && <span>Cerrar Sesión</span>}
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
