import { useState } from "react";
import * as XLSX from "xlsx";
import {
  FiX,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { FaUsers } from "react-icons/fa6";
import DataTable from "react-data-table-component";

type FilaExcel = {
  ["Nombre"]: string;
  ["Segundo Nombre"]?: string;
  ["Apellido"]: string;
  ["Segundo Apellido"]?: string;
  ["Número de Documento"]: string | number;
  ["Tipo de Documento"]?: string;
  ["Correo Electrónico"]?: string;
  ["Contraseña"]?: string;
  ["Dirección"]?: string;
  ["Fecha de Nacimmiento"]: string;
  ["Estado Civil"]?: string;
  ["Número de Hijos"]?: string;
  ["Estrato"]?: string;
  ["Género"]?: string;
  ["EPS"]?: string;
  ["Rol"]?: string;
  ["Autorización Datos"]?: string;
  ["Habilitado"]?: string;
  motivo?: string;
  status?: string;
  [k: string]: unknown;
};

// Componente de Alert
const Alert = ({
  type,
  children,
}: {
  type: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
}) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 ${styles[type]}`}>
      {children}
    </div>
  );
};

// Componente de Modal
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// Componente principal
const ImportExcel = () => {
  // Estados principales
  const [updateIfExists, setUpdateIfExists] = useState(true);

  // Estados del archivo
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<FilaExcel[]>([]);

  // Estados de UI
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  // Estados de modales
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [processedData, setProcessedData] = useState<FilaExcel[]>([]);

  // Leer Excel para preview
  const leerExcel = async (archivo: File) => {
    setMessage(null);
    setPreview([]);

    try {
      const buffer = await archivo.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];

      // Leer datos desde fila 5 (índice 4)
      const data = XLSX.utils.sheet_to_json<FilaExcel>(sheet, {
        defval: "",
      });

      setPreview(data.slice(0, 20)); // Mostrar solo 20 para preview
      setProcessedData(data)
    } catch (error) {
      setMessage({ type: "error", text: "Error al leer el archivo Excel" });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadProgress(0);

    if (!selectedFile) {
      setPreview([]);
      return;
    }

    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls"].includes(ext || "")) {
      setMessage({ type: "error", text: "El archivo debe ser .xlsx o .xls" });
      setPreview([]);
      return;
    }

    await leerExcel(selectedFile);
  };

  const handleSubmit = async () => {
    setShowConfirmModal(true);
    setUploading(true);
    setMessage(null);
    setUploadProgress(0);

    setProcessedData(preview);
    setMessage({
      type: "success",
      text: `Procesadas ${preview.length} filas correctamente.`,
    });
    setShowResultsModal(true);


    try {
      const formData = new FormData();
      formData.append("excel", file!);
      formData.append("updateIfExists", updateIfExists ? "1" : "0");

      const mockResponse = {
        inserted: 45,
        updated: 12,
        skipped: 3,
        processed: preview.slice(0, 5).map((item, i) => ({
          ...item,
          status: i === 0 ? "inserted" : i === 1 ? "updated" : "skipped",
          motivo: i === 2 ? "Documento duplicado" : "",
        })),
      };

      setProcessedData(mockResponse.processed);
      setMessage({
        type: "success",
        text: `Importación completada: ${mockResponse.inserted} insertados, ${mockResponse.updated} actualizados, ${mockResponse.skipped} omitidos`,
      });

      if (mockResponse.processed.length > 0) {
        setShowResultsModal(true);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al importar aprendices" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {message && (
          <Alert type={message.type}>
            <div className="flex items-center gap-2">
              {message.type === "success" && <FiCheck />}
              {message.type === "error" && <FiAlertCircle />}
              {message.type === "warning" && <FiAlertCircle />}
              <span>{message.text}</span>
            </div>
          </Alert>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-600 flex items-center">
              <FaUsers className="w-10 h-auto text-blue-600 mr-4" />
              Pacientes
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Importa datos de pacientes desde archivos Excel.
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
              className="mt-6 flex w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </div>

          {/* Barra de progreso */}
          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Preview Table */}
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
                  selector: (row: FilaExcel) =>
                    row["Dirección"] || "-",
                },
              ]}
              data={preview}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30, 50]}
              noDataComponent={
                <div className="py-8 text-gray-500 text-lg">
                  No hay datos para mostrar
                </div>
              }
            />
          </div>
        </div>

        {/* Botón de acción */}
        <div className="mt-6 flex justify-end gap-3">
          {processedData.length > 0 && (
            <button
              onClick={() => setShowResultsModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Ver resultados
            </button>
          )}
        </div>

        {/* Modal de Confirmación */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirmar Importación"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                Confirmar y Subir
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal de Resultados */}
        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          title={`Resultados Procesados (${processedData.length})`}
          size="xl"
        >
          <DataTable
            columns={[
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
                    } ${row["Segundo Apellido"] || ""}`.trim() ||
                  "—",
                sortable: true,
                wrap: true,
              },
              {
                name: "Dirección",
                cell: (row: FilaExcel) => row["Dirección"] || ""
              }
            ]}
            data={processedData}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            noDataComponent={<div className="py-8 text-gray-500">No hay resultados procesados</div>}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ImportExcel;