import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { TelefonoEntity } from "../../interfaces/telefono";
import { telefonosService } from "../../services/telefonosService";

type Mode = "create" | "edit";

const TelefonosUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioId = id as string;

  // nombre (opcional) para el título
  const state = location.state as { nombre?: string } | undefined;
  const [nombreUsuario, setNombreUsuario] = useState<string>("");

  // data
  const [items, setItems] = useState<TelefonoEntity[]>([]);
  const [loading, setLoading] = useState(true);

  // form
  const [mode, setMode] = useState<Mode>("create");
  const [editingRow, setEditingRow] = useState<TelefonoEntity | null>(null);
  const [telefono, setTelefono] = useState("");

  const isEdit = useMemo(() => mode === "edit" && editingRow !== null, [mode, editingRow]);
  const editId = useMemo(() => (editingRow ? editingRow.id_telefono : null), [editingRow]);

  useEffect(() => {
    const fromState = state?.nombre?.trim() || "";
    if (fromState) {
      setNombreUsuario(fromState);
    } else {
      const params = new URLSearchParams(location.search);
      const fromQuery = (params.get("nombre") || "").trim();
      if (fromQuery) setNombreUsuario(fromQuery);
    }
  }, [state, location.search]);

  const load = async () => {
    if (!usuarioId) return;
    try {
      setLoading(true);
      const data = await telefonosService.listByUsuario(usuarioId);
      setItems(data); // ya vienen normalizados
    } catch (e: any) {
      toast.error(e.message || "Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [usuarioId]);

  const resetForm = () => {
    setMode("create");
    setEditingRow(null);
    setTelefono("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = telefono.trim();

    if (!value || value.length < 5) {
      toast.error("Teléfono mínimo 5 caracteres");
      return;
    }

    try {
      if (isEdit) {
        if (editId === null || !Number.isFinite(editId) || editId < 0) {
          toast.error("ID inválido para actualizar");
          return;
        }
        const updated = await telefonosService.update(editId, {
          telefono: value,
          usuario_id: editingRow!.usuario_id || usuarioId,
        });
        setItems((prev) =>
          prev.map((t) => (t.id_telefono === updated.id_telefono ? updated : t))
        );
        toast.success("Teléfono actualizado");
      } else {
        const created = await telefonosService.create({
          telefono: value,
          usuario_id: usuarioId,
        });
        setItems((prev) => [created, ...prev]);
        toast.success("Teléfono creado");
      }

      resetForm();
    } catch (e: any) {
      toast.error(e?.message || "Error al guardar");
    }
  };

  const handleEdit = (row: TelefonoEntity) => {
    if (!Number.isFinite(row.id_telefono) || row.id_telefono < 0) {
      toast.error("El registro seleccionado tiene un ID inválido");
      return;
    }
    setMode("edit");
    setEditingRow(row);
    setTelefono(row.telefono ?? "");
  };

  const handleDelete = async (row: TelefonoEntity) => {
    if (!Number.isFinite(row.id_telefono) || row.id_telefono < 0) {
      toast.error("El registro seleccionado tiene un ID inválido");
      return;
    }
    if (!confirm("¿Eliminar este teléfono?")) return;
    try {
      await telefonosService.remove(row.id_telefono);
      if (editingRow?.id_telefono === row.id_telefono) resetForm();
      setItems((prev) => prev.filter((t) => t.id_telefono !== row.id_telefono));
      toast.success("Eliminado");
    } catch (e: any) {
      toast.error(e?.message || "Error al eliminar");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Teléfonos del usuario{nombreUsuario ? `: ${nombreUsuario}` : ""}
        </h1>
        <button onClick={() => navigate(-1)} className="px-3 py-2 border rounded">
          Volver
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        {isEdit && (
          <input
            value={editId ?? ""}
            readOnly
            className="border rounded px-3 py-2 w-full md:w-32 bg-gray-100"
            aria-label="ID teléfono"
            title="ID teléfono (solo lectura)"
          />
        )}

        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej: +57 300 123 4567"
          className="border rounded px-3 py-2 flex-1"
        />

        <div className="flex gap-2 md:justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
          >
            {isEdit ? "Guardar cambios" : "Agregar"}
          </button>
          {isEdit && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded border">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista */}
      <div className="bg-white rounded shadow">
        {loading ? (
          <div className="p-4">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="p-4">Sin teléfonos.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={`${t.id_telefono}-${t.telefono}`} className="border-t">
                  <td className="p-3">{t.id_telefono}</td>
                  <td className="p-3">{t.telefono}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 rounded bg-blue-600 text-white"
                        onClick={() => handleEdit(t)}
                      >
                        Editar
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-red-600 text-white"
                        onClick={() => handleDelete(t)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TelefonosUsuario;
