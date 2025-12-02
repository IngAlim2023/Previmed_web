import React, { useState } from "react";
import type { Solicitud } from "../../pages/general/Solicitudes";
import { cambiarEstadoSolicitud } from "../../services/solicitudesServices";
import BtnEstado from "../botones/BtnEstado";

interface SolicitudesDataTableProps {
  solicitudes: Solicitud[];
  onRowClick: (solicitud: Solicitud) => void;
  onEstadoChanged?: (id: number, nuevoEstado: boolean) => void;
}

const SolicitudesDataTable: React.FC<SolicitudesDataTableProps> = ({
  solicitudes,
  onRowClick,
  onEstadoChanged,
}) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const getStatusBadge = (estado: boolean) => {
    return estado
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const handleToggleEstado = async (
    solicitud: Solicitud
  ) => {
    
    setLoadingId(solicitud.idSolicitud);
    try {
      const nuevoEstado = !solicitud.estado;
      await cambiarEstadoSolicitud(solicitud.idSolicitud, nuevoEstado);
      
      if (onEstadoChanged) {
        onEstadoChanged(solicitud.idSolicitud, nuevoEstado);
      }
    } catch (error) {
      alert("Error al cambiar el estado de la solicitud");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr
              key={solicitud.idSolicitud}
              className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onRowClick(solicitud)}
            >
              <td className="px-6 py-4 text-sm">
                <div className="font-medium text-gray-900">
                  {solicitud.nombre} {solicitud.apellido}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {solicitud.email}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {solicitud.tipoSolicitud}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    solicitud.estado
                  )}`}
                >
                  {solicitud.estado ? "Pendiente" : "Atendida"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={loadingId === solicitud.idSolicitud ? "opacity-50" : ""}
                >
                  <BtnEstado
                    habilitado={solicitud.estado}
                    onClick={() => handleToggleEstado(solicitud)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SolicitudesDataTable;