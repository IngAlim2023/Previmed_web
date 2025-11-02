import { useState } from 'react';
import { HiDownload, HiX } from 'react-icons/hi';
import { exportPacientes } from '../../services/pacientes';
import toast from 'react-hot-toast';
import { PiFileCsvLight } from "react-icons/pi";
import { FaUsers } from 'react-icons/fa';

const BtnExportarPacientes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async (filtro:string) => {
    setIsLoading(true);

    try {
      const blob = await exportPacientes(filtro);
      // Crear URL temporal para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pacientes_${filtro}_${Date.now()}.csv`;
      
      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Exportación exitosa")
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Error al exportar el documento.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white px-3 p-2 rounded-md flex items-center gap-2 transition text-lg"
      >
        <PiFileCsvLight className='text-2xl'/> Exportar Pacientes
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 bg-gray-200 right-4 text-gray-500 hover:bg-red-500 hover:text-white p-1 rounded-full"
              disabled={isLoading}
            >
              <HiX className="text-xl" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-600 flex items-center">
                <FaUsers className="w-10 h-auto text-blue-600 mr-4" />Exportar pacientes
              </h2>
              <p className="text-gray-600 text-sm">
                Selecciona el tipo de exportación que deseas realizar
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleExport('todos')}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-5 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium">Todos los Pacientes</span>
                <HiDownload className="text-xl" />
              </button>

              <button
                onClick={() => handleExport('activa')}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-5 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium">Membresía Activa</span>
                <HiDownload className="text-xl" />
              </button>

              <button
                onClick={() => handleExport('inactiva')}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-5 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium">Membresía Inactiva</span>
                <HiDownload className="text-xl" />
              </button>
            </div>

            {isLoading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Descargando...</span>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="w-full mt-4 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BtnExportarPacientes;