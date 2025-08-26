import { Link } from "react-router-dom";
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

type PropsSideBar = {
  cerrado: boolean;
  setCerrado: (value: boolean) => void;
};

const SideBar: React.FC<PropsSideBar> = ({ cerrado, setCerrado }) => {
  return (
    <aside
      className={`fixed top-0 left-6 h-screen bg-blue-50 text-gray-600 flex flex-col transition-all duration-300 ${
        cerrado ? "w-20" : "w-48"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
        <button
          onClick={() => setCerrado(!cerrado)}
          className="p-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaBars />
        </button>
        {!cerrado && (
          <img src={PREVIMED_Full_Color} alt="Logo" className="px-4" />
        )}
      </div>

      {!cerrado && (
        <div className="px-6 py-2 border-b border-gray-300">
          <h2 className="text-xl font-bold text-blue-500">Alberto Lasso</h2>
          <p className="text-md text-gray-400">Administrador</p>
        </div>
      )}

      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
        <Link
          to="/usuarios"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaUsers className="text-lg" />
          {!cerrado && <span>Usuarios</span>}
        </Link>

        <Link
          to="/medicos"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaUserMd className="text-lg" />
          {!cerrado && <span>Médicos</span>}
        </Link>

        <Link
          to="/pagos"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaMoneyBill className="text-lg" />
          {!cerrado && <span>Pagos</span>}
        </Link>

        <Link
          to="/planes"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaClipboardList className="text-lg" />
          {!cerrado && <span>Planes</span>}
        </Link>

        <Link
          to="/visitas"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaCalendarAlt className="text-lg" />
          {!cerrado && <span>Visitas</span>}
        </Link>

        <Link
          to="/historial/visitas"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaHistory className="text-lg" />
          {!cerrado && <span>Historial Visitas</span>}
        </Link>

        <Link
          to="/pacientes"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaUserFriends className="text-lg" />
          {!cerrado && <span>Pacientes</span>}
        </Link>

        <Link
          to="/contrato"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaFileContract className="text-lg" />
          {!cerrado && <span>Contrato</span>}
        </Link>

        <Link
          to="/beneficiarios"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaUserFriends className="text-lg" />
          {!cerrado && <span>Beneficiarios</span>}
        </Link>

        <Link
          to="/contratos"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaFileAlt className="text-lg" />
          {!cerrado && <span>Contratos</span>}
        </Link>

        <Link
          to="/beneficios_plan"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaGift className="text-lg" />
          {!cerrado && <span>Beneficios Plan</span>}
        </Link>

        <Link
          to="/solicitudes"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaBriefcaseMedical className="text-lg" />
          {!cerrado && <span>Solicitudes</span>}
        </Link>

        <Link
          to="/formas_pago"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaWpforms className="text-lg" />
          {!cerrado && <span>Formas de Pago</span>}
        </Link>

        <Link
          to="/eps"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaHospital className="text-lg" />
          {!cerrado && <span>EPS</span>}
        </Link>

        <Link
          to="/roles"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaUserShield className="text-lg" />
          {!cerrado && <span>Roles</span>}
        </Link>

        <Link
          to="/panel_control"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <FaTachometerAlt className="text-lg" />
          {!cerrado && <span>Panel de Control</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default SideBar;
