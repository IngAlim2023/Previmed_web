import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { Visita } from "../../interfaces/visitas";
import { getVisitasPorMedico } from "../../services/visitasService";
import { medicoService } from "../../services/medicoService";
import { useNavigate } from "react-router-dom";
import BtnCerrar from "../../components/botones/BtnCerrar";

const HistorialVisitasMedico: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(false);
  const [idMedico, setIdMedico] = useState<number | null>(null);

  const RAW_URL = String(import.meta.env.VITE_URL_BACK || "");
  const API_URL = RAW_URL.replace(/\/+$/, "");

  // 🔹 Paso 1: obtener el id del médico logueado
  useEffect(() => {
    const fetchMedico = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const medico = await medicoService.getByUsuarioId(user.id);
        if (medico) setIdMedico(medico.id_medico);
      } catch {
        toast.error("Error al obtener información del médico");
      } finally {
        setLoading(false);
      }
    };
    fetchMedico();
  }, [user]);

  // 🔹 Paso 2: obtener visitas finalizadas (estado = false)
  useEffect(() => {
    const fetchHistorial = async () => {
      if (!idMedico) return;

      try {
        setLoading(true);
        toast.loading("Cargando historial...", { id: "historial" });

        const todas = await getVisitasPorMedico(idMedico);
        const historial = todas.filter((v) => !v.estado);

        // 🔹 Paso 3: obtener los nombres de los pacientes correctamente
        const visitasConNombres = await Promise.all(
          historial.map(async (v) => {
            try {
              const res = await fetch(`${API_URL}/pacientes/${v.paciente_id}`.replace(/([^:]\/)\/+/g, "$1"));
              if (!res.ok) throw new Error("Error al obtener paciente");
              const response = await res.json();

              // 📦 Estructura: response.data.usuario.{nombre, apellido}
              const paciente = response.data?.usuario;
              const nombreCompleto = `${paciente?.nombre || "Sin nombre"} ${
                paciente?.apellido || ""
              }`;

              return { ...v, nombrePaciente: nombreCompleto.trim() };
            } catch (error) {
              console.error("Error obteniendo paciente:", error);
              return { ...v, nombrePaciente: "Desconocido" };
            }
          })
        );

        setVisitas(visitasConNombres);
        toast.success("Historial cargado correctamente", { id: "historial" });
      } catch {
        toast.error("Error al cargar historial", { id: "historial" });
      } finally {
        toast.dismiss("historial");
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [idMedico, API_URL]);

  // 🔹 Columnas de la tabla
  const columns = [
    {
      name: "Paciente",
      selector: (row: any) => row.nombrePaciente || "Desconocido",
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row: Visita) =>
        new Date(row.fecha_visita).toLocaleDateString("es-CO"),
      sortable: true,
    },
    { name: "Descripción", selector: (row: Visita) => row.descripcion },
    { name: "Dirección", selector: (row: Visita) => row.direccion },
    { name: "Teléfono", selector: (row: Visita) => row.telefono },
    {
      name: "Estado",
      selector: (row: Visita) => (row.estado ? "Activo" : "Finalizado"),
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 py-10 px-4">
      <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            📋 Historial de Visitas
          </h2>

          {/* 🔹 Botón personalizado para volver */}
          <div onClick={() => navigate(-1)}>
            <BtnCerrar text="Cerrar" />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={visitas}
          pagination
          progressPending={loading}
          striped
          highlightOnHover
          noDataComponent="No hay visitas finalizadas para este médico"
        />
      </div>
    </div>
  );
};

export default HistorialVisitasMedico;
