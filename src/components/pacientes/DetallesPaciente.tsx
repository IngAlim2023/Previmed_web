import React from 'react';
import { Paciente } from '../../interfaces/pacientes';

interface Props {
  paciente: Paciente | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetallesPaciente: React.FC<Props> = ({ paciente, isOpen, onClose }) => {
  if (!isOpen || !paciente) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        // cierra solo si se hace clic en el fondo (no en el contenido)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white p-6 rounded-xl w-[95%] max-w-2xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="modal-title" className="text-lg font-semibold mb-4 text-sky-700">
          Información del Paciente
        </h3>
                {/* Email 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p><strong>Nombre:</strong> {paciente.nombre ?? '—'}</p>
          <p><strong>Segundo nombre:</strong> {paciente.segundo_nombre ?? '—'}</p>
          <p><strong>Apellido:</strong> {paciente.apellido ?? '—'}</p>
          <p><strong>Segundo apellido:</strong> {paciente.segundo_apellido ?? '—'}</p>
          <p><strong>Email:</strong> {paciente.email ?? '—'}</p>
          <p><strong>Teléfono:</strong> {paciente.telefono ?? '—'}</p>
          <p><strong>Dirección:</strong> {paciente.direccion ?? '—'}</p>
          <p><strong>Número documento:</strong> {paciente.numero_documento ?? '—'}</p>
          <p><strong>Fecha nacimiento:</strong> {paciente.fecha_nacimiento ?? '—'}</p>
          <p><strong>Número de hijos:</strong> {paciente.numero_hijos ?? '—'}</p>
          <p><strong>Estrato:</strong> {paciente.estrato ?? '—'}</p>
          <p><strong>Autorización datos:</strong> {paciente.autorizacion_datos ? 'Sí' : 'No'}</p>
          <p><strong>Habilitado:</strong> {paciente.habilitar ? 'Sí' : 'No'}</p>
          <p><strong>Doctor:</strong> {paciente.doctor ?? '—'}</p>
          <p><strong>Plan:</strong> {paciente.plan ?? '—'}</p>
        </div>
        */}

        <div className="flex justify-end pt-6">
          <button onClick={onClose} className="text-sm px-4 py-2 bg-sky-600 text-white rounded-md">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesPaciente;