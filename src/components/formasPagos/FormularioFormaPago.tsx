import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
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
        toast.success("Forma de pago actualizada ✅");
        onSaved?.(updated);
      } else {
        const payload: CreateFormaPagoDto = {
          tipo_pago: tipoPago.trim(),
          estado,
        };
        const created = await formasPagoService.create(payload);
        toast.success("Forma de pago creada 🎉");
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`${isEdit ? "bg-blue-600" : "bg-green-600"} px-6 py-4 flex justify-between items-center`}>
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? "Editar forma de pago" : "Registrar forma de pago"}
          </h2>
          <button
            onClick={onCancel}
            className="text-white hover:bg-white/20 p-1 rounded-lg transition"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          

          {/* Tipo de Pago */}
          <div>
            <label
              htmlFor="tipoPago"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Tipo de pago <span className="text-red-500">*</span>
            </label>
            <input
              id="tipoPago"
              type="text"
              placeholder="Ej: Efectivo, Transferencia, Tarjeta..."
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  id="estado"
                  type="checkbox"
                  checked={estado}
                  onChange={(e) => setEstado(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {estado ? "✅ Activa" : "❌ Inactiva"}
              </span>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-2 rounded-lg text-white font-semibold transition-all duration-200 ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : isEdit
                  ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                  : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
              }`}
            >
              {submitting
                ? isEdit
                  ? "⏳ Guardando..."
                  : "⏳ Creando..."
                : isEdit
                ? "💾 Guardar cambios"
                : "✓ Crear"}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                ✕ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioFormaPago;