import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eps, CreateEpsDto, UpdateEpsDto } from "../../interfaces/eps";
import { epsService } from "../../services/epsService";

type FormMode = "create" | "edit";

type Props = {
  mode: FormMode;
  initialEps?: Eps | null;
  onSaved?: (saved: Eps) => void;
  onCancel?: () => void;
};

const FormularioEps: React.FC<Props> = ({ mode, initialEps, onSaved, onCancel }) => {
  const isEdit = mode === "edit";

  const [idEps, setIdEps] = useState<number | null>(null);
  const [nombreEps, setNombreEps] = useState<string>("");
  const [estado, setEstado] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isEdit && initialEps) {
      setIdEps(initialEps.idEps);
      setNombreEps(initialEps.nombreEps); 
      setEstado(initialEps.estado);
    } else {
      setIdEps(null);
      setNombreEps("");
      setEstado(true);
    }
  }, [isEdit, initialEps]);

  const validate = () => {
    if (!nombreEps.trim()) {
      toast.error("El nombre de la EPS es obligatorio");
      return false;
    }
    if (isEdit && (idEps === null || idEps === undefined)) {
      toast.error("Falta el identificador de la EPS a editar");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      if (isEdit) {
        const payload: UpdateEpsDto = {
          idEps: idEps as number,
          nombre_eps: nombreEps.trim(),
          estado,
        };
        const updated = await epsService.update(payload);
        toast.success("EPS actualizada correctamente");
        onSaved?.(updated);
      } else {
        const payload: CreateEpsDto = {
          nombre_eps: nombreEps.trim(),
          estado,
        };
        const created = await epsService.create(payload);
        toast.success("EPS creada correctamente");
        onSaved?.(created);
        setNombreEps("");
        setEstado(true);
      }
    } catch (err: any) {
      toast.error(err?.message || "Ocurrió un error al guardar la EPS");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEdit ? "Editar EPS" : "Registrar EPS"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isEdit && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">ID</label>
            <input
              type="text"
              value={idEps ?? ""}
              readOnly
              className="w-full rounded-lg border bg-gray-100 text-gray-600 p-2 cursor-not-allowed"
            />
          </div>
        )}

        <div>
          <label htmlFor="nombreEps" className="block text-sm text-gray-600 mb-1">
            Nombre de la EPS <span className="text-red-500">*</span>
          </label>
          <input
            id="nombreEps"
            type="text"
            placeholder="Ej: Famisanar"
            value={nombreEps}
            onChange={(e) => setNombreEps(e.target.value)}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="estado"
            type="checkbox"
            checked={estado}
            onChange={(e) => setEstado(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="estado" className="text-sm text-gray-700">
            Activa
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-white ${submitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"} transition`}
          >
            {submitting ? (isEdit ? "Guardando..." : "Creando...") : isEdit ? "Guardar cambios" : "Crear EPS"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioEps;
