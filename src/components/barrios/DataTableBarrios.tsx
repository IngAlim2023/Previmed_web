// src/components/barrios/DataTableBarrios.tsx
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

import { DataBarrio } from "../../interfaces/Barrio";
import {
  getBarrios,
  deleteBarrio,
  createBarrio,
  updateBarrio,
} from "../../services/barrios";

import BtnAgregar from "../botones/BtnAgregar";
import BtnLeer from "../botones/BtnLeer";
import BtnEditar from "../botones/BtnEditar";
import BtnEliminar from "../botones/BtnEliminar";
import BtnCerrar from "../botones/BtnCerrar";
import BarrioForm from "./BarrioForm";

const customStyles = {
  table: { style: { width: "100%" } },
  headRow: {
    style: {
      backgroundColor: "#f8fafc",
      borderTopLeftRadius: "0.55rem",
      borderTopRightRadius: "0.75rem",
      minHeight: "2rem",
    },
  },
  headCells: {
    style: {
      fontWeight: 700,
      color: "#0f172a",
      fontSize: "0.85rem",
      paddingTop: "0.15rem",
      paddingBottom: "0.15rem",
    },
  },
  rows: {
    style: {
      minHeight: "1.9rem",
      fontSize: "0.9rem",
    },
    highlightOnHoverStyle: { backgroundColor: "#f1f5f9" },
  },
  cells: {
    style: {
      paddingTop: "0.15rem",
      paddingBottom: "0.15rem",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #e2e8f0",
      paddingTop: "0.15rem",
      fontSize: "0.85rem",
    },
  },
} as const;

const DataTableBarrios: React.FC = () => {
  const [barrios, setBarrios] = useState<DataBarrio[]>([]);
  const [search, setSearch] = useState("");
  const [modalDetalles, setModalDetalles] = useState<DataBarrio | null>(null);
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [editing, setEditing] = useState<DataBarrio | null>(null);

  const fetchBarrios = async () => {
    try {
      const data = await getBarrios();
      setBarrios(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar barrios");
    }
  };

  useEffect(() => {
    fetchBarrios();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este barrio?")) return;
    try {
      await deleteBarrio(id);
      toast.success("Barrio eliminado");
      fetchBarrios();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo eliminar");
    }
  };

  const openCreate = () => {
    setEditing(null);
    setModalFormOpen(true);
  };

  const openEdit = (b: DataBarrio) => {
    setEditing(b);
    setModalFormOpen(true);
  };

  const handleSave = async (payload: Partial<DataBarrio>) => {
    try {
      if (editing?.idBarrio) {
        const updated = await updateBarrio(editing.idBarrio, payload);
        // Refrescar estado local inmediatamente
        setBarrios(prev => prev.map(b => b.idBarrio === updated.idBarrio ? updated : b));
        toast.success("Barrio actualizado");
      } else {
        const created = await createBarrio(payload);
        setBarrios(prev => [...prev, created]);
        toast.success("Barrio creado");
      }
      setModalFormOpen(false);
      setEditing(null);
      // fetchBarrios(); // ya actualizamos localmente
    } catch (e) {
      console.error(e);
      toast.error("No se pudo guardar");
    }
  };

  // Si deseas habilitar un toggle en la tabla, reutiliza esta función y conéctala desde la columna
  // const handleToggle = async (b: DataBarrio) => {
  //   try {
  //     const updated = await toggleHabilitarBarrio(b);
  //     setBarrios(prev => prev.map(x => x.idBarrio === updated.idBarrio ? updated : x));
  //     toast.success("Estado actualizado");
  //   } catch {
  //     toast.error("No se pudo cambiar el estado");
  //   }
  // };


  const columns = [
    {
      name: "Nombre",
      selector: (row: DataBarrio) => row.nombreBarrio,
      sortable: true,
      wrap: true,
      grow: 0,
      width: "55%",
      style: { paddingRight: "10px" },
    },
    {
      name: "Estado",
      selector: (row: DataBarrio) => (row.habilitar ? "Habilitado" : "Deshabilitado"),
      sortable: true,
      center: true,
      grow: 0,
      width: "25%",
      style: { paddingRight: "14px" },
      cell: (row: DataBarrio) => (
        <div className="flex items-center gap-2 justify-center w-full">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${row.habilitar ? "bg-green-500" : "bg-red-500"}`}
            aria-label={row.habilitar ? "Habilitado" : "Deshabilitado"}
          />
          <span>{row.habilitar ? "Habilitado" : "Deshabilitado"}</span>
        </div>
      ),
    },
    {
      name: "Acciones",
      cell: (row: DataBarrio) => (
        <div className="flex gap-2 justify-center">
          <div onClick={() => setModalDetalles(row)}><BtnLeer /></div>
          <div onClick={() => openEdit(row)}><BtnEditar /></div>
          <div onClick={() => handleDelete(row.idBarrio!)}><BtnEliminar /></div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      right: true,
      grow: 0,
      width: "190px",         
    },
  ] as const;

  const filtered = barrios.filter((b) => {
    const term = search.toLowerCase();
    return (
      b.nombreBarrio.toLowerCase().includes(term) ||
      (b.ciudad ?? "").toLowerCase().includes(term) ||
      String(b.comuna ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Barrios</h2>
            <p className="text-xs text-slate-500">Gestiona los barrios registrados</p>
          </div>

          {/* Buscador + Agregar */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <span className="absolute left-3 top-2 text-slate-400 text-xs">🔎</span>
              <input
                type="text"
                placeholder="Buscar por nombre, ciudad o comuna…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div onClick={openCreate}>
              <BtnAgregar verText />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="p-2">
          <DataTable
            columns={columns as any}
            data={filtered}
            pagination
            highlightOnHover
            striped
            responsive
            dense
            customStyles={customStyles}
            noDataComponent={
              <div className="py-6 text-slate-500 text-sm text-center">
                No hay barrios disponibles
              </div>
            }
          />
        </div>
      </div>


      {modalDetalles && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl w-[520px] max-w-[92vw] max-height-[85vh] shadow-2xl">
            <h2 className="text-base font-semibold mb-3 text-slate-800">Detalles del Barrio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-slate-700 text-sm">
              <p><span className="font-medium text-slate-500">Nombre:</span> {modalDetalles.nombreBarrio}</p>
              <p><span className="font-medium text-slate-500">Latitud:</span> {modalDetalles.latitud ?? "-"}</p>
              <p><span className="font-medium text-slate-500">Longitud:</span> {modalDetalles.longitud ?? "-"}</p>
              <p><span className="font-medium text-slate-500">Habilitado:</span> {modalDetalles.habilitar ? "Sí" : "No"}</p>
            </div>
            <div className="mt-4 flex justify-end" onClick={() => setModalDetalles(null)}>
              <BtnCerrar verText text="px-4 py-1 text-sm" />
            </div>
          </div>
        </div>
      )}


      {modalFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <BarrioForm
            initialData={editing ?? undefined}
            onSubmit={handleSave}
            onCancel={() => { setModalFormOpen(false); setEditing(null); }}
          />
        </div>
      )}
    </div>
  );
};

export default DataTableBarrios;
