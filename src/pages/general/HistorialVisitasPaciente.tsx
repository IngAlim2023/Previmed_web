import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { historialVisitas } from "../../services/historialVisitas";
import { Visita } from "../../interfaces/visitas";
import DataTable, { TableColumn } from "react-data-table-component";

const HistorialVisitasPaciente: React.FC = () => {
  const API_URL = import.meta.env.VITE_URL_BACK;
  const { user } = useAuthContext();
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const resPaciente = await fetch(`${API_URL}pacientes/por-usuario/${user.id}`);
        if (!resPaciente.ok) throw new Error("No se encontró paciente");
        const pacienteData = await resPaciente.json();
        const pacienteInfo = pacienteData.data;

        const visitasData = await historialVisitas.getByPacienteId(pacienteInfo.idPaciente);
        setVisitas(visitasData);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [API_URL, user]);

  const formatFecha = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("es-CO");
  };

  const columns: TableColumn<Visita>[] = [
    {
      name: "Fecha",
      selector: (row) => row.fecha_visita ?? "",
      sortable: true,
      cell: (row) => formatFecha(row.fecha_visita),
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion ?? "",
      sortable: true,
      grow: 2,
    },
    {
      name: "Dirección",
      selector: (row) => row.direccion ?? "",
      sortable: true,
      grow: 2,
    },
    {
      name: "Estado",
      cell: (row) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            row.estado
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.estado ? "Activa" : "Inactiva"}
        </span>
      ),
      sortable: true,
      center: true,
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Historial de visitas</h1>
        
        <DataTable
          columns={columns}
          data={visitas}
          pagination
          highlightOnHover
          striped
          noDataComponent="No hay visitas disponibles"
          progressPending={loading}
        />
      </div>
    </div>
  );
};

export default HistorialVisitasPaciente;