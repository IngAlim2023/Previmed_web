import React, { useState, useEffect, useMemo } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { obtenerSolicitudes } from "../../services/solicitudesServices";
import SolicitudesDataTable from "../../components/solicitudes/SolicitudesDataTable";
import SolicitudModal from "../../components/solicitudes/SolicitudModal";
import type { TipoSolicitud } from "../../interfaces/Solicitudes";

export interface Solicitud {
  idSolicitud: number;
  nombre: string;
  apellido: string;
  email: string;
  documento?: string;
  telefono: string;
  descripcion: string;
  tipoSolicitud: string;
  estado: boolean;
  autorizacionDatos: boolean;
  usuarioId: string | null;
  segundoNombre: string;
  segundoApellido: string;
  createdAt?: string;
}

const TIPOS_SOLICITUD: TipoSolicitud[] = [
  'Petición',
  'Queja',
  'Reclamo',
  'Consulta',
  'Sugerencia',
  'Felicitación',
  'Registro',
  'Cambio de datos personales',
  'Retiro',
];

const Solicitudes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<"todos" | "activa" | "inactiva">("todos");
  const [filterTipo, setFilterTipo] = useState<string>("todos");

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChanged = (id: number, nuevoEstado: boolean) => {
    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) =>
        solicitud.idSolicitud === id
          ? { ...solicitud, estado: nuevoEstado }
          : solicitud
      )
    );
  };

  const filteredSolicitudes = useMemo(() => {
    return solicitudes.filter(solicitud => {
      const matchSearch = 
        solicitud.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solicitud.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solicitud.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado = 
        filterEstado === "todos" ||
        (filterEstado === "activa" && solicitud.estado) ||
        (filterEstado === "inactiva" && !solicitud.estado);

      const matchTipo = filterTipo === "todos" || solicitud.tipoSolicitud === filterTipo;

      return matchSearch && matchEstado && matchTipo;
    });
  }, [solicitudes, searchTerm, filterEstado, filterTipo]);

  const handleRowClick = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSolicitud(null);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <MdClose className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && solicitudes.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Solicitudes</h1>
              <p className="text-gray-600">Gestiona y visualiza todas tus solicitudes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nombre, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  <option value="activa">Pendientes</option>
                  <option value="inactiva">Atendidas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  {TIPOS_SOLICITUD.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando solicitudes...</p>
            </div>
          </div>
        ) : filteredSolicitudes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">
              {solicitudes.length === 0 
                ? "No hay solicitudes registradas" 
                : "No se encontraron solicitudes con los filtros seleccionados"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SolicitudesDataTable
              solicitudes={filteredSolicitudes}
              onRowClick={handleRowClick}
              onEstadoChanged={handleEstadoChanged}
            />
          </div>
        )}
      </div>

      {isModalOpen && selectedSolicitud && (
        <SolicitudModal
          solicitud={selectedSolicitud}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Solicitudes;