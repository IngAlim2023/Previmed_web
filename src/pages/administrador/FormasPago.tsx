import React, { useEffect, useState, useCallback } from "react";
import DataTableFormasPago from "../../components/formasPagos/DataTableFormasPago";
import FormularioFormaPago from "../../components/formasPagos/FormularioFormaPago";
import { FormaPago } from "../../interfaces/formaPago";
import { formasPagoService } from "../../services/formasPagoService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FormasPago: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modo, setModo] = useState<"create" | "edit">("create");
  const [formaSeleccionada, setFormaSeleccionada] = useState<FormaPago | null>(null);
  const [data, setData] = useState<FormaPago[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const list = await formasPagoService.getAll();
      setData(list);
    } catch (e: any) {
      toast.error(e?.message || "Error al cargar formas de pago");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const abrirCrear = () => {
    setModo("create");
    setFormaSeleccionada(null);
    setMostrarFormulario(true);
  };

  const abrirEditar = (forma: FormaPago) => {
    setModo("edit");
    setFormaSeleccionada(forma);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => setMostrarFormulario(false);

  const onSaved = async () => {
    await cargar();
    cerrarFormulario();
  };

  const onDelete = async (id: number) => {
    try {
      await formasPagoService.remove(id);
      setData((prev) => prev.filter((f) => f.id_forma_pago !== id));
      toast.success("Forma de pago eliminada correctamente");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      {!mostrarFormulario ? (
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Formas de Pago
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona las formas de pago disponibles
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/pagos")}
                className="flex-1 sm:flex-none bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold shadow"
              >
                ← Regresar
              </button>

              <button
                onClick={abrirCrear}
                className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold shadow flex items-center justify-center gap-1"
              >
                + Nueva Forma de Pago
              </button>
            </div>
          </header>

          {/* TABLE CARD */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <DataTableFormasPago
              data={data}
              loading={loading}
              onEdit={abrirEditar}
              onDelete={onDelete}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto animate-fade-in">
          <FormularioFormaPago
            mode={modo}
            initial={formaSeleccionada}
            onSaved={onSaved}
            onCancel={cerrarFormulario}
          />
        </div>
      )}
    </div>
  );
};

export default FormasPago;
