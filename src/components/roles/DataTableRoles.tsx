import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { Rol } from "../../interfaces/roles";
import { getRoles } from "../../services/roles";
import BtnLeer from "../botones/BtnLeer";
import BtnEditar from "../botones/BtnEditar";
import BtnAgregar from "../botones/BtnAgregar";
import FormularioRoles from "./FormularioRoles";
import DetallesRol from "./DetallesRol";
import { HiOutlineUsers } from "react-icons/hi";

// 👇 Badge para estado
const EstadoBadge: React.FC<{ estado: boolean }> = ({ estado }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        estado
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
    >
      {estado ? "Activo" : "Inactivo"}
    </span>
  );
};

const DataTableRoles: React.FC = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(false);
  const [detalles, setDetalles] = useState(false);
  const [rol, setRol] = useState<Rol | null>(null);

  

  const fetchRoles = async (showToast = false) => {
    try {
      const data = await getRoles();
      setRoles(data);
      if (showToast)
        toast.success("Roles cargados exitosamente", { id: "roles-toast" });
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar roles", { id: "roles-toast" });
    }
  };

  useEffect(() => {
    toast.loading("Cargando roles...", { id: "roles-toast" });
    fetchRoles(true);
  }, []);

  

  const filteredData = roles.filter((r) =>
    r.nombre_rol.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "ID", selector: (row: Rol) => row.id_rol, sortable: true },
    { name: "Nombre", selector: (row: Rol) => row.nombre_rol, sortable: true },
    {
      name: "Estado",
      selector: (row: Rol) => row.estado,
      cell: (row: Rol) => <EstadoBadge estado={row.estado} />, // 👈 aquí usamos el badge
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: Rol) => (
        <div className="flex gap-2 p-2">
          <div
            title="Ver detalles"
            onClick={() => {
              setRol(row);
              setDetalles(true);
            }}
          >
            <BtnLeer />
          </div>
          <div
            title="Editar"
            onClick={() => {
              setRol(row);
              setForm(true);
            }}
          >
            <BtnEditar />
          </div>
          
        </div>
      ),
      button: true,
      minWidth: "180px",
    },
  ];

  return (
    <>
      {/* 🔹 Fondo azul clarito en toda la página */}
      <div className="min-h-screen flex items-center justify-center w-full px-4 py-8 bg-blue-50">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-600 flex items-center">
              <HiOutlineUsers className="w-10 h-auto text-green-600 mr-4" />
              Roles
            </h2>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-sm p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
            />

            <div
              onClick={() => {
                setRol(null); // limpiar rol antes de crear
                setForm(true);
              }}
            >
              <BtnAgregar verText={true} />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            noDataComponent="No hay roles disponibles"
          />
        </div>

        {form && (
          <FormularioRoles rol={rol} setForm={setForm} onSuccess={fetchRoles} />
        )}
        {detalles && <DetallesRol rol={rol} setDetalles={setDetalles} />}

        
      </div>
    </>
  );
};

export default DataTableRoles;
