// src/components/eps/DataTableEps.tsx
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component"; // 👈 usamos TableColumn
import { Eps } from "../../interfaces/eps";
import { epsService } from "../../services/epsService";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

type Props = {
  onEdit?: (eps: Eps) => void;
  onView?: (eps: Eps) => void;
  refreshKey?: number; // si cambia, recarga
  onDeleted?: () => void;
};

const DataTableEps: React.FC<Props> = ({ onEdit, onView, refreshKey, onDeleted }) => {
  const [data, setData] = useState<Eps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEps = async () => {
    try {
      setLoading(true);
      const epsList = await epsService.getAll();
      setData(epsList);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar las EPS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const handleDelete = async (row: Eps) => {
    const ok = window.confirm(`¿Eliminar la EPS "${row.nombreEps}"?`);
    if (!ok) return;
    try {
      await epsService.remove(row.idEps);
      toast.success("EPS eliminada");
      await fetchEps();
      onDeleted?.();
    } catch (e: any) {
      toast.error(e?.message || "No se pudo eliminar");
    }
  };

  // 👇 Ahora usamos TableColumn<Eps>[] en vez de ColumnEps[]
  const columns: TableColumn<Eps>[] = [
    {
      name: "EPS",
      selector: (row) => row.nombreEps,
      sortable: true,
      grow: 2,
    },
    {
      name: "Estado",
      cell: (row) =>
        row.estado ? (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Activa</span>
        ) : (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Inactiva</span>
        ),
      center: true,
      grow: 1,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView?.(row)}
            title="Ver"
            className="inline-flex items-center justify-center rounded-lg border px-2.5 py-1.5 hover:bg-gray-50"
          >
            <FaEye className="text-sm" />
          </button>
          <button
            onClick={() => onEdit?.(row)}
            title="Editar"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-2.5 py-1.5 hover:bg-blue-700"
          >
            <FaEdit className="text-sm" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            title="Eliminar"
            className="inline-flex items-center justify-center rounded-lg bg-red-600 text-white px-2.5 py-1.5 hover:bg-red-700"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      ),
      center: true,
      grow: 1.4,
    },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center w-full p-4">
      <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">EPS</h2>
        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
          striped
          noDataComponent="No hay EPS registradas"
        />
      </div>
    </div>
  );
};

export default DataTableEps;
