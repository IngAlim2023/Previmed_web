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
  toggleHabilitarBarrio,
} from "../../services/barrios";

import BtnAgregar from "../botones/BtnAgregar";
import BtnLeer from "../botones/BtnLeer";
import BtnEditar from "../botones/BtnEditar";
import BtnEliminar from "../botones/BtnEliminar";
import BtnCerrar from "../botones/BtnCerrar";

import BarrioForm from "./BarrioForm";

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

  const handleToggle = async (b: DataBarrio) => {
    try {
      const updated = await toggleHabilitarBarrio(b);
      setBarrios(prev => prev.map(x => x.idBarrio === updated.idBarrio ? updated : x));
      toast.success("Estado actualizado");
    } catch {
      toast.error("No se pudo cambiar el estado");
    }
  };

  const columns = [
    { name: "Nombre", selector: (row: DataBarrio) => row.nombreBarrio, sortable: true },
    {
      name: "Estado",
      selector: (row: DataBarrio) => (row.habilitar ? "Habilitado" : "Deshabilitado"),
      sortable: true,
      cell: (row: DataBarrio) => (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${row.habilitar ? "bg-green-500" : "bg-red-500"}`}
            aria-label={row.habilitar ? "Habilitado" : "Deshabilitado"}
          />
          <span>{row.habilitar ? "Habilitado" : "Deshabilitado"}</span>
        </div>
      ),
      width: "200px",
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
    },
  ];

  const filtered = barrios.filter((b) => {
    const term = search.toLowerCase();
    return (
      b.nombreBarrio.toLowerCase().includes(term) ||
      (b.ciudad ?? "").toLowerCase().includes(term) ||
      String(b.comuna ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre, ciudad o comuna…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />

      {/* Botón agregar */}
      <div className="mb-4 flex justify-end">
        <div onClick={openCreate}><BtnAgregar /></div>
      </div>

      {/* Tabla */}
      <DataTable
        columns={columns as any}
        data={filtered}
        pagination
        highlightOnHover
        striped
        noDataComponent="No hay barrios disponibles"
      />

      {/* Modal Detalles */}
      {modalDetalles && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[520px] max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Detalles del Barrio</h2>
            <div className="space-y-1">
              <p><strong>Nombre:</strong> {modalDetalles.nombreBarrio}</p>
              <p><strong>Latitud:</strong> {modalDetalles.latitud ?? "-"}</p>
              <p><strong>Longitud:</strong> {modalDetalles.longitud ?? "-"}</p>
              <p><strong>Habilitado:</strong> {modalDetalles.habilitar ? "Sí" : "No"}</p>
            </div>
            <div className="text-right mt-4" onClick={() => setModalDetalles(null)}>
              <BtnCerrar verText text="px-4" />
            </div>
          </div>
        </div>
      )}

      {/* Modal Form (Agregar/Editar) */}
      {modalFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
