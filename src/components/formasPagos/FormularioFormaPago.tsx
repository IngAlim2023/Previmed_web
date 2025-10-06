import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FormaPago,
  CreateFormaPagoDto,
  UpdateFormaPagoDto,
} from "../../interfaces/formaPago";
import { formasPagoService } from "../../services/formasPagoService";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initial?: FormaPago | null;
  onSaved?: (saved: FormaPago) => void;
  onCancel?: () => void;
};

const FormularioFormaPago: React.FC<Props> = ({
  mode,
  initial,
  onSaved,
  onCancel,
}) => {
  const isEdit = mode === "edit";

  const [id, setId] = useState<number | null>(null);
  const [tipoPago, setTipoPago] = useState<string>("");
  const [estado, setEstado] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isEdit && initial) {
      setId(initial.id_forma_pago);
      setTipoPago(initial.tipo_pago);
      setEstado(initial.estado);
    } else {
      setId(null);
      setTipoPago("");
      setEstado(true);
    }
  }, [isEdit, initial]);

  const validate = () => {
    if (!tipoPago.trim()) {
      toast.error("El tipo de pago es obligatorio");
      return false;
    }
    if (isEdit && (id === null || id === undefined)) {
      toast.error("Falta el ID para editar");
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
        const payload: UpdateFormaPagoDto = {
          id_forma_pago: id as number,
          tipo_pago: tipoPago.trim(),
          estado,
        };
        const updated = await formasPagoService.update(payload);
        toast.success("Forma de pago actualizada");
        onSaved?.(updated);
      } else {
        const payload: CreateFormaPagoDto = {
          tipo_pago: tipoPago.trim(),
          estado,
        };
        const created = await formasPagoService.create(payload);
        toast.success("Forma de pago creada");
        onSaved?.(created);
        setTipoPago("");
        setEstado(true);
      }
    } catch (err: any) {
      toast.error(err?.message || "Ocurrió un error al guardar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEdit ? "Editar forma de pago" : "Registrar forma de pago"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isEdit && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">ID</label>
            <input
              type="text"
              value={id ?? ""}
              readOnly
              className="w-full rounded-lg border bg-gray-100 text-gray-600 p-2 cursor-not-allowed"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="tipoPago"
            className="block text-sm text-gray-600 mb-1"
          >
            Tipo de pago <span className="text-red-500">*</span>
          </label>
          <input
            id="tipoPago"
            type="text"
            placeholder="Ej: Efectivo, Transferencia, Tarjeta..."
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
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
            className={`px-4 py-2 rounded-lg text-white ${
              submitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {submitting
              ? isEdit
                ? "Guardando..."
                : "Creando..."
              : isEdit
              ? "Guardar cambios"
              : "Crear"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={() => {
                onCancel();
              }}
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

export default FormularioFormaPago;
