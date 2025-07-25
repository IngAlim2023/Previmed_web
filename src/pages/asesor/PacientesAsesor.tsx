import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BtnAgregar from '../../components/botones/BtnAgregar';
import BtnLeer from '../../components/botones/BtnLeer';
import ModalAgregarPaciente from '../../components/asesor/ModalAgregarPaciente';
import ModalVerPaciente from '../../components/asesor/ModalVerPaciente';
import { FaUserMd } from 'react-icons/fa';

export interface Paciente {
  id: number;
  nombre: string;
  doctor: string;
  direccion: string;
  plan: string;
}

const PacientesAsesor: React.FC = () => {
  const { register, watch } = useForm();
  const [pacientes, setPacientes] = useState<Paciente[]>([
    { id: 1, nombre: 'Carlos Gómez', doctor: 'Dr. Pérez', direccion: 'Calle 123', plan: 'Básico' },
    { id: 2, nombre: 'Ana Torres', doctor: 'Dra. Rivas', direccion: 'Carrera 5 #45-67', plan: 'Avanzado' },
    { id: 3, nombre: 'Luis Ramírez', doctor: 'Dr. Quintero', direccion: 'Av. Las Palmas', plan: 'Premium' },
  ]);

  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);

  const busqueda = watch('busqueda')?.toLowerCase() || '';
  const pacientesFiltrados = pacientes.filter((p) => p.nombre.toLowerCase().includes(busqueda));

  const handleAgregar = (nuevo: any) => {
    const nuevoPaciente: Paciente = {
      id: pacientes.length + 1,
      nombre: nuevo.nombre,
      doctor: '—',
      direccion: '—',
      plan: '—',
    };
    setPacientes([...pacientes, nuevoPaciente]);
  };

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserMd className="text-blue-600" />
          Gestión de Pacientes
        </h2>
        <div className="flex gap-2 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Buscar paciente..."
            {...register('busqueda')}
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full md:w-64"
          />
          <div onClick={() => setModalAgregar(true)}>
            <BtnAgregar verText={true} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Doctor</th>
              <th className="text-left p-3">Dirección</th>
              <th className="text-left p-3">Plan</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No hay pacientes registrados.
                </td>
              </tr>
            ) : (
              pacientesFiltrados.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{p.nombre}</td>
                  <td className="p-3">{p.doctor}</td>
                  <td className="p-3">{p.direccion}</td>
                  <td className="p-3">{p.plan}</td>
                  <td className="p-3">
                    <div onClick={() => { setPacienteSeleccionado(p); setModalVer(true); }}>
                      <BtnLeer verText={true} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalAgregarPaciente
        isOpen={modalAgregar}
        onClose={() => setModalAgregar(false)}
        onSubmit={handleAgregar}
      />

      <ModalVerPaciente
        isOpen={modalVer}
        onClose={() => setModalVer(false)}
        paciente={pacienteSeleccionado}
      />
    </div>
  );
};

export default PacientesAsesor;
