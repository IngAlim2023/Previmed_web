import { useState } from "react";
import * as XLSX from "xlsx";
import { FiX } from "react-icons/fi";
import { FaUsers } from "react-icons/fa6";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import BtnAgregar from "../../components/botones/BtnAgregar";
import { importExcelPacientes } from "../../services/pacientes";

type FilaExcel = {
  ["Nombre"]: string;
  ["Segundo Nombre"]?: string;
  ["Apellido"]: string;
  ["Segundo Apellido"]?: string;
  ["Número de Documento"]: string | number;
  ["Correo Electrónico"]?: string;
  ["Dirección"]?: string;
  ["Fecha de Nacimiento"]: string;
  motivo?: string;
  status?: string;
  [k: string]: unknown;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "2xl",
  omitidos = 0,
  insertados = 0,
  errores = 0,
  detalles = false,
}: {
  isOpen: boolean;
  size?: string;
  onClose: () => void;
  title: string;
  detalles?: boolean;
  children: React.ReactNode;
  omitidos?: number;
  insertados?: number;
  errores?: number;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-${size} max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          {detalles && (
            <>
              <p className="rounded-full bg-green-300/60 text-green-800 px-4 py-1">
                {insertados} Insertados
              </p>
              <p className="rounded-full bg-yellow-300/60 text-yellow-800 px-4 py-1">
                {omitidos} Omitidos
              </p>
              <p className="rounded-full bg-red-300/60 text-red-800 px-4 py-1">
                {errores} Errores
              </p>
            </>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX
              size={30}
              title="Cerrar"
              className="hover:bg-red-200 p-1 rounded-full"
            />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

const ImportExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<FilaExcel[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [processedData, setProcessedData] = useState<FilaExcel[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [resultados, setResultados] = useState({
    insertados: 0,
    omitidos: 0,
    errores: 0,
  });

  // Leer el Excel
  const leerExcel = async (archivo: File) => {
    setPreview([]);
    try {
      const buffer = await archivo.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<FilaExcel>(sheet, {
        range: 4,
        blankrows: false,
      });

      setPreview(data);
      toast.success(`Archivo cargado (${data.length} filas)`);
    } catch (error) {
      toast.error("Error al leer el archivo");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (!selectedFile) {
      setPreview([]);
      return;
    }

    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls"].includes(ext || "")) {
      toast.error("El archivo debe ser .xlsx o .xls");
      setPreview([]);
      return;
    }
    setProcessedData([]);
    setResultados({ insertados: 0, omitidos: 0, errores: 0 });
    setFile(selectedFile);
    await leerExcel(selectedFile);
  };

  // Paso 1: abrir modal de confirmación
  const handleAgregarClick = () => {
    if (!file) {
      toast.error("Primero debes seleccionar un archivo Excel");
      return;
    }
    if (preview.length === 0) {
      toast.error("No hay registros para importar");
      return;
    }
    setShowConfirmModal(true);
  };

  // Paso 2: confirmar e importar
  const confirmarImportacion = async () => {
    setUploading(true);
    setShowConfirmModal(false);
    setResetKey(prev => prev + 1);

    try {
      const formData = new FormData();
      formData.append("excel", file!);

      const response = await importExcelPacientes(formData);

      if (!response?.ok) {
        throw new Error(response?.message || "Error en el servidor");
      }

      setProcessedData(response.processed || []);
      setResultados({
        insertados: response.resultado?.insertados || 0,
        omitidos: response.resultado?.omitidos || 0,
        errores: response.resultado?.errores || 0,
      });

      toast.success(`Importación completada`);
      setShowResultsModal(true);
    } catch (error: any) {
      toast.error("Error al importar el archivo");
      console.error("Error en importación:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCloseResults = () => {
    setShowResultsModal(false);
    setPreview([])
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-600 flex items-center">
              <FaUsers className="w-10 h-auto text-blue-600 mr-4" />
              Pacientes
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Importa datos de pacientes desde archivos Excel.
            </p>

            <div className="flex items-center gap-3">
              <input
                key={resetKey}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploading}
                className="mt-6 flex w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />

              {file && preview.length > 0 && !uploading && (
                <div className="mt-6" onClick={handleAgregarClick}>
                  <BtnAgregar verText={true} />
                </div>
              )}
            </div>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 animate-pulse"
                  style={{ width: `100%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Procesando archivo...
              </p>
            </div>
          )}
        </div>

        {/* vista previa de los registros */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Vista Previa
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({preview.length} filas)
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              columns={[
                {
                  name: "Nombre",
                  selector: (row: FilaExcel) =>
                    `${row["Nombre"] || ""} ${row["Segundo Nombre"] || ""} ${
                      row["Apellido"] || ""
                    } ${row["Segundo Apellido"] || ""}`.trim() || "—",
                  sortable: true,
                  wrap: true,
                },
                {
                  name: "Fecha de Nacimiento",
                  selector: (row: FilaExcel) =>
                    row["Fecha de Nacimiento"]?.toString() || "—",
                  sortable: true,
                },
                {
                  name: "Documento",
                  selector: (row: FilaExcel) =>
                    row["Número de Documento"]?.toString() || "—",
                  sortable: true,
                },
                {
                  name: "Correo",
                  selector: (row: FilaExcel) =>
                    row["Correo Electrónico"] || "—",
                  sortable: true,
                  wrap: true,
                },
                {
                  name: "Dirección",
                  selector: (row: FilaExcel) => row["Dirección"] || "—",
                  wrap: true,
                },
              ]}
              data={preview}
              pagination
              paginationPerPage={10}
              noDataComponent={
                <div className="py-8 text-gray-500 text-lg">
                  No hay datos para mostrar
                </div>
              }
            />
          </div>
        </div>

        {/* Botón de resultados */}
        {processedData.length > 0 && !showResultsModal && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowResultsModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Ver ultimos resultados
            </button>
          </div>
        )}

        {/* Modal Confirmación */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirmar Importación"
        >
          <p className="text-gray-700">
            ¿Estás seguro de ejecutar la importación de{" "}
            <strong>{preview.length}</strong> registros?
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarImportacion}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium disabled:opacity-50"
            >
              Confirmar y Subir
            </button>
          </div>
        </Modal>

        {/* Modal Resultados */}
        <Modal
          isOpen={showResultsModal}
          onClose={handleCloseResults}
          title="RESULTADOS"
          detalles={true}
          insertados={resultados.insertados}
          omitidos={resultados.omitidos}
          errores={resultados.errores}
          size="7xl"
        >
          <DataTable
            columns={[
              {
                name: "Estado",
                cell: (row: FilaExcel) => {
                  const status = row.status?.toLowerCase() || "";
                  let bgColor = "bg-green-300/50 text-green-800";
                  
                  if (status === "omitido") {
                    bgColor = "bg-yellow-300/50 text-yellow-800";
                  } else if (status === "error") {
                    bgColor = "bg-red-300/50 text-red-800";
                  }
                  
                  return (
                    <p className={`${bgColor} rounded-full px-4 py-1`}>
                      {row.status}
                    </p>
                  );
                },
                width: "140px",
              },
              {
                name: "Documento",
                selector: (row: FilaExcel) =>
                  row["Número de Documento"]?.toString() || "—",
                sortable: true,
              },
              {
                name: "Nombre",
                selector: (row: FilaExcel) =>
                  `${row["Nombre"] || ""} ${row["Segundo Nombre"] || ""} ${
                    row["Apellido"] || ""
                  } ${row["Segundo Apellido"] || ""}`.trim() || "—",
                sortable: true,
                wrap: true,
              },
              {
                name: "Dirección",
                selector: (row: FilaExcel) => row["Dirección"] || "—",
                wrap: true,
              },
              {
                name: "Motivo",
                selector: (row: FilaExcel) => row.motivo || "—",
                wrap: true,
              },
            ]}
            data={processedData}
            pagination
            paginationPerPage={10}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ImportExcel;