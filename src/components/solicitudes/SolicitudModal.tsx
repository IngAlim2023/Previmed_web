import React from "react";
import { MdClose } from "react-icons/md";
import type { Solicitud } from "../../pages/general/Solicitudes";

interface SolicitudModalProps {
  solicitud: Solicitud;
  isOpen: boolean;
  onClose: () => void;
}

const SolicitudModal: React.FC<SolicitudModalProps> = ({
  solicitud,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Detalles de Solicitud #{solicitud.idSolicitud}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Información Personal */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nombre Completo
                </label>
                <p className="text-gray-900 font-medium">
                  {solicitud.nombre} {solicitud.segundoNombre}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Apellido
                </label>
                <p className="text-gray-900 font-medium">
                  {solicitud.apellido} {solicitud.segundoApellido}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <p className="text-gray-900 font-medium">{solicitud.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Teléfono
                </label>
                <p className="text-gray-900 font-medium">
                  {solicitud.telefono || "No especificado"}
                </p>
              </div>
            </div>
          </section>

          {/* Información de la Solicitud */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información de la Solicitud
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Tipo de Solicitud
                </label>
                <div className="inline-block">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    {solicitud.tipoSolicitud}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Estado
                </label>
                <div className="inline-block">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      solicitud.estado
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {solicitud.estado ? "Activa" : "Inactiva"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Descripción */}
          {solicitud.descripcion && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Descripción
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {solicitud.descripcion}
              </p>
            </section>
          )}

          {/* Consentimiento */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Consentimiento
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={solicitud.autorizacionDatos}
                disabled
                className="w-4 h-4"
              />
              <span className="text-gray-700">
                Autorización de datos personales:{" "}
                <strong>
                  {solicitud.autorizacionDatos ? "Autorizado" : "No autorizado"}
                </strong>
              </span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolicitudModal;