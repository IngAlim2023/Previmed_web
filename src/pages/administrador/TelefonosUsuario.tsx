import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { TelefonoEntity } from "../../interfaces/telefono";
import { telefonosService } from "../../services/telefonosService";
import BtnEditar from "../../components/botones/BtnEditar";
import BtnEliminar from "../../components/botones/BtnEliminar";
import { MdPhone, MdPhoneDisabled, MdPhoneInTalk } from "react-icons/md";
import BtnAgregar from "../../components/botones/BtnAgregar";

type Mode = "create" | "edit";

const TelefonosUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioId = id as string;

  const state = location.state as { nombre?: string } | undefined;
  const [nombreUsuario, setNombreUsuario] = useState<string>("");

  const [items, setItems] = useState<TelefonoEntity[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editingRow, setEditingRow] = useState<TelefonoEntity | null>(null);
  const [telefono, setTelefono] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      setItems(data);
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
    setShowModal(false);
    setErrors({});
    setSubmitting(false);
  };

  const validateTelefono = (value: string): boolean => {
    const newErrors: { [key: string]: string } = {};
    const cleanedValue = value.replace(/\D/g, "");

    if (!value.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (cleanedValue.length < 10) {
      newErrors.telefono = "Mínimo 10 dígitos";
    } else if (cleanedValue.length > 10) {
      newErrors.telefono = "Máximo 10 dígitos";
    }

    // Verificar si el teléfono ya existe
    const exists = items.some(
      (t) =>
        t.telefono.replace(/\D/g, "") === cleanedValue &&
        t.id_telefono !== editingRow?.id_telefono
    );

    if (exists) {
      newErrors.telefono = "Este teléfono ya está registrado";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCreateModal = () => {
    setMode("create");
    setEditingRow(null);
    setTelefono("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTelefono(telefono)) {
      return;
    }

    if (submitting) return; // Prevenir doble clic
    setSubmitting(true);

    try {
      const value = `+57-${telefono}`;

      if (isEdit) {
        if (editId === null || !Number.isFinite(editId) || editId < 0) {
          toast.error("ID inválido para actualizar");
          setSubmitting(false);
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
      setSubmitting(false);
    }
  };

  const handleEdit = (row: TelefonoEntity) => {
    if (!Number.isFinite(row.id_telefono) || row.id_telefono < 0) {
      toast.error("El registro seleccionado tiene un ID inválido");
      return;
    }
    setMode("edit");
    setEditingRow(row);
    // Extrae solo los 10 dígitos sin el +57
    const soloDigitos = row.telefono.replace(/\D/g, "").slice(-10);
    setTelefono(soloDigitos);
    setShowModal(true);
  };

  const handleDelete = async (row: TelefonoEntity) => {
    if (!Number.isFinite(row.id_telefono) || row.id_telefono < 0) {
      toast.error("El registro seleccionado tiene un ID inválido");
      return;
    }

    if (!confirm(`¿Seguro que quieres eliminar ${row.telefono}?`)) return;

    try {
      await telefonosService.remove(row.id_telefono);
      if (editingRow?.id_telefono === row.id_telefono) resetForm();
      setItems((prev) => prev.filter((t) => t.id_telefono !== row.id_telefono));
      toast.success("Teléfono eliminado correctamente");
    } catch (e: any) {
      toast.error(e?.message || "Error al eliminar");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-md">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          ← Volver
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-600 flex items-center">
              <MdPhoneInTalk  className="w-10 h-auto text-blue-600 mr-4" />
              Telefonos
            </h2>
            {nombreUsuario && (
              <p className="text-gray-600 mt-1">de <span className="font-semibold">{nombreUsuario}</span></p>
            )}
          </div>
          
          <button
            onClick={openCreateModal}>
            <BtnAgregar verText={true} />
          </button>
        </div>
      </div>

      {/* Contenedor de teléfonos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-500">Cargando teléfonos...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center justify-center items-center flex flex-col">
            <div className="text-5xl mb-3 text-gray-500"><MdPhoneDisabled /></div>
            <p className="text-gray-500 text-lg">Sin teléfonos registrados</p>
            <p className="text-gray-400 text-sm mt-2">Agrega uno haciendo clic en el botón de arriba</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((t) => (
              <div 
                key={`${t.id_telefono}-${t.telefono}`} 
                className="p-4 hover:bg-blue-50 transition group flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition">
                      {t.telefono}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(t)}
                  >
                    <BtnEditar />
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                  >
                    <BtnEliminar />
                  </button>
                </div>
              </div>
            ))}
          </div>
                  )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3 text-blue-600 justify-center items-center flex flex-col"><MdPhone/></div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Editar Teléfono" : "Nuevo Teléfono"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isEdit ? "Actualiza el número de teléfono" : "Registra un nuevo número"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-700 whitespace-nowrap">
                    +57
                  </div>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setTelefono(value);
                      setErrors({});
                    }}
                    placeholder="300 123 4567"
                    className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition text-lg ${
                      errors.telefono
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    autoFocus
                    disabled={submitting}
                    maxLength={10}
                  />
                </div>
                {errors.telefono && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    ⚠️ {errors.telefono}
                  </p>
                )}
                {!errors.telefono && (
                  <p className="text-xs text-gray-500 mt-1">Exactamente 10 dígitos</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 px-4 py-3 rounded-lg text-white font-semibold transition ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  }`}
                >
                  {submitting ? "Guardando..." : isEdit ? "Guardar" : "Agregar"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelefonosUsuario;