// src/components/eps/DataTableEps.tsx
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Eps } from "../../interfaces/eps";
import { epsService } from "../../services/epsService";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  onEdit?: (eps: Eps) => void;
  refreshKey?: number;
  onDeleted?: () => void;
};

const DataTableEps: React.FC<Props> = ({ onEdit, refreshKey, onDeleted }) => {
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
  }, [refreshKey]);

  const toggleEstado = async (row: Eps) => {
    try {
      const nuevoEstado = !row.estado;
      setData((prev) =>
        prev.map((r) =>
          r.idEps === row.idEps ? { ...r, estado: nuevoEstado } : r
        )
      );
      await epsService.update({
        idEps: row.idEps,
        nombre_eps: row.nombreEps,
        estado: nuevoEstado,
      });
      toast.success(`EPS ${nuevoEstado ? "activada" : "desactivada"}`);
    } catch (e: any) {
      setData((prev) =>
        prev.map((r) =>
          r.idEps === row.idEps ? { ...r, estado: row.estado } : r
        )
      );
      toast.error(e?.message || "No se pudo cambiar el estado");
    }
  };

  const handleDelete = async (row: Eps) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">
            ¿Eliminar <b>{row.nombreEps}</b>?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      ));
    });

    if (!confirmed) return;

    const loadingToast = toast.loading("Eliminando EPS...");
    try {
      await epsService.remove(row.idEps);
      toast.dismiss(loadingToast);
      toast.success("EPS eliminada");
      await fetchEps();
      onDeleted?.();
    } catch (e: any) {
      toast.dismiss(loadingToast);
      if (e.message.includes("violates foreign key constraint")) {
        toast.error("No se puede eliminar: la EPS tiene usuarios asociados");
      } else {
        toast.error(e?.message || "No se pudo eliminar la EPS");
      }
    }
  };

  const columns: TableColumn<Eps>[] = [
    {
      name: "ID",
      selector: (row) => row.idEps,
      sortable: true,
      width: "80px",
      style: { justifyContent: "center" },
    },
    {
      name: "Nombre de la EPS",
      selector: (row) => row.nombreEps,
      sortable: true,
      grow: 2,
    },
    {
      name: "Estado",
      width: "110px",
      style: { justifyContent: "center" },
      cell: (row) => (
        <button
          onClick={() => toggleEstado(row)}
          className={`w-20 h-8 rounded-full text-white text-xs font-semibold transition-all duration-200 ${
            row.estado
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {row.estado ? "Activo" : "Inactivo"}
        </button>
      ),
    },
    {
      name: "Acciones",
      width: "150px",
      style: { justifyContent: "center" },
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit?.(row)}
            title="Editar EPS"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 transition-colors"
          >
            <FaEdit className="text-sm" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            title="Eliminar EPS"
            className="inline-flex items-center justify-center rounded-lg bg-red-600 text-white px-3 py-2 hover:bg-red-700 transition-colors"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f3f4f6",
        borderBottom: "2px solid #e5e7eb",
        fontWeight: "600",
        fontSize: "14px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        "&:hover": { backgroundColor: "#f9fafb" },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
        highlightOnHover
        responsive
        striped
        customStyles={customStyles}
        noDataComponent={
          <div className="py-8 text-gray-500">
            No hay EPS registradas. Haz clic en "Agregar EPS" para crear una
            nueva.
          </div>
        }
      />
    </div>
  );
};

export default DataTableEps;
