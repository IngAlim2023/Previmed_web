import React from 'react';
import { Paciente } from '../../interfaces/pacientes';

interface Props {
  paciente?: Paciente | null;
  detalles: boolean;
  setDetalles: (v:boolean) => void;
}

const DetallesPaciente: React.FC<Props> = ({ paciente, detalles, setDetalles }) => {
  if (!detalles || !paciente) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white p-6 rounded-xl w-[95%] max-w-2xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="modal-title" className="text-lg font-semibold mb-4 text-sky-700">
          Información del Paciente
        </h3>
          Email 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
  
        </div>
        
        <div className="flex justify-end pt-6">
          <button onClick={()=>setDetalles(false)} className="text-sm px-4 py-2 bg-sky-600 text-white rounded-md">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesPaciente;