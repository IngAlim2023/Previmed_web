// src/components/eps/FormularioEps.tsx
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
      }
    } catch (err: any) {
      toast.error(err?.message || "Ocurrió un error al guardar la EPS");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID de la EPS
          </label>
          <input
            type="text"
            value={idEps ?? ""}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-600 p-3 cursor-not-allowed"
          />
        </div>
      )}

      <div>
        <label htmlFor="nombreEps" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la EPS <span className="text-red-500">*</span>
        </label>
        <input
          id="nombreEps"
          type="text"
          placeholder="Ej: Sanitas, Compensar, Famisanar..."
          value={nombreEps}
          onChange={(e) => setNombreEps(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
        <input
          id="estado"
          type="checkbox"
          checked={estado}
          onChange={(e) => setEstado(e.target.checked)}
          className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="estado" className="text-sm font-medium text-gray-700">
          EPS activa
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${
            submitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting
            ? isEdit
              ? "Guardando..."
              : "Creando..."
            : isEdit
            ? "Guardar Cambios"
            : "Crear EPS"}
        </button>
      </div>
    </form>
  );
};

export default FormularioEps;