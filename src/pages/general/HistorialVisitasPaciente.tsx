import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getVisitas } from "../../services/visitasService";

const HistorialVisitasPaciente: React.FC = () => {
  const API_URL = import.meta.env.VITE_URL_BACK;
  const { user } = useAuthContext();
  const [visitas, setVisitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const resPaciente = await fetch(`${API_URL}/pacientes/por-usuario/${user.id}`);
        if (!resPaciente.ok) throw new Error("No se encontró paciente");
        const pacienteData = await resPaciente.json();
        const pacienteInfo = pacienteData.data;

        try {
          const urlDir = `${API_URL}/visitas/paciente/${pacienteInfo.idPaciente}`;
          const resVisDir = await fetch(urlDir);
          if (resVisDir.ok) {
            const j = await resVisDir.json();
            const arr = Array.isArray(j?.msj)
              ? j.msj
              : Array.isArray(j?.data)
              ? j.data
              : Array.isArray(j)
              ? j
              : [];
            const norm = arr.map((v: any) => ({
              id_visita: v.id_visita ?? v.idVisita ?? v.id,
              fecha_visita: v.fecha_visita ?? v.fechaVisita ?? v.fecha,
              descripcion: v.descripcion ?? "",
              direccion: v.direccion ?? "",
              estado: Boolean(v.estado ?? v.activo ?? true),
              telefono: v.telefono ?? "",
              paciente_id: v.paciente_id ?? v.pacienteId,
              medico_id: v.medico_id ?? v.medicoId,
              barrio_id: v.barrio_id ?? v.barrioId,
            }));
            setVisitas(norm);
          } else {
            const todas = await getVisitas();
            setVisitas((todas || []).filter((v: any) => Number(v.paciente_id) === Number(pacienteInfo.idPaciente)));
          }
        } catch {
          const todas = await getVisitas().catch(() => [] as any[]);
          setVisitas((todas || []).filter((v: any) => Number(v.paciente_id) === Number(pacienteInfo.idPaciente)));
        }
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
    return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Historial de visitas</h1>
        {loading ? (
          <div className="text-blue-600">Cargando...</div>
        ) : visitas.length === 0 ? (
          <div className="text-sm text-gray-500">No hay visitas registradas.</div>
        ) : (
          <div className="overflow-hidden border border-gray-100 rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2">Fecha</th>
                  <th className="text-left px-4 py-2">Descripción</th>
                  <th className="text-left px-4 py-2">Dirección</th>
                  <th className="text-left px-4 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {[...visitas]
                  .sort((a, b) => new Date(b.fecha_visita).getTime() - new Date(a.fecha_visita).getTime())
                  .map((v) => (
                    <tr key={v.id_visita} className="border-t">
                      <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{formatFecha(v.fecha_visita)}</td>
                      <td className="px-4 py-2 text-gray-700">{v.descripcion || "Sin descripción"}</td>
                      <td className="px-4 py-2 text-gray-500">{v.direccion || "—"}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {v.estado ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialVisitasPaciente;
