import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FaEye, FaDownload } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";

// Datos de ejemplo
const datosContratos = [
  { nombre: 'Alberto Lasso', documento: '1010101010' },
  { nombre: 'El chavo del 8', documento: '1061786160' }
];

// Columnas de la tabla
const columnas = (verDetalles: (row: any) => void, descargarContrato: (row: any) => void) => [
  {
    name: 'Nombre',
    selector: (row: any) => row.nombre,
    sortable: true
  },
  {
    name: 'Documento',
    selector: (row: any) => row.documento,
    sortable: true
  },
  {
    name: 'Acción',
    cell: (row: any) => (
      <div className="flex gap-4">
        <button
          className="text-blue-600 hover:text-blue-800 transition"
          onClick={() => verDetalles(row)}
        >
          <FaEye size={20} />
        </button>
        <button
          className="text-blue-600 hover:text-blue-800 transition"
          onClick={() => descargarContrato(row)}
        >
          <FaDownload size={20} />
        </button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true
  }
];

const ContratosAsesor: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [contratos, setContratos] = useState(datosContratos);
  const [verDetalle, setVerDetalle] = useState<any | null>(null);

  const handleFiltrar = (valor: string) => {
    setBusqueda(valor);
    const resultado = datosContratos.filter((c) =>
      c.nombre.toLowerCase().includes(valor.toLowerCase()) ||
      c.documento.includes(valor)
    );
    setContratos(resultado);
  };

  const verDetalles = (row: any) => {
    setVerDetalle(row);
  };

  const descargarContrato = (row: any) => {
    console.log(`Descargar contrato de ${row.nombre}`);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-full p-6">
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Lista de Contratos
            </h2>

            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={busqueda}
              onChange={(e) => handleFiltrar(e.target.value)}
            />

            <DataTable
              columns={columnas(verDetalles, descargarContrato)}
              data={contratos}
              pagination
              highlightOnHover
              striped
              responsive
              noDataComponent="No hay contratos disponibles"
            />
          </div>
        </div>
      </div>

      {/* Modal Detalle */}
      {verDetalle && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-start overflow-y-auto">
          <div className="bg-white w-full max-w-2xl mt-20 rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Detalles del Contrato
              </h2>
              <ImCancelCircle
                title="Cerrar"
                className="w-6 h-auto text-gray-500 hover:text-red-600 cursor-pointer"
                onClick={() => setVerDetalle(null)}
              />
            </div>
            <div className="space-y-3 text-gray-700">
              <p><strong>Nombre:</strong> {verDetalle.nombre}</p>
              <p><strong>Documento:</strong> {verDetalle.documento}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContratosAsesor;
