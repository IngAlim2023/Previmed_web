import React, { useEffect, useState, useCallback } from "react";
import DataTableFormasPago from "../../components/formasPagos/DataTableFormasPago";
import FormularioFormaPago from "../../components/formasPagos/FormularioFormaPago";
import { FormaPago } from "../../interfaces/formaPago";
import { formasPagoService } from "../../services/formasPagoService";
import toast from "react-hot-toast";

const FormasPago: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modo, setModo] = useState<"create" | "edit">("create");
  const [formaSeleccionada, setFormaSeleccionada] = useState<FormaPago | null>(null);
  const [data, setData] = useState<FormaPago[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    await cargar();     // refresca la tabla
    cerrarFormulario();
  };

  const onDelete = async (id: number) => {
    try {
      await formasPagoService.remove(id);
      setData((prev) => prev.filter((f) => f.id_forma_pago !== id));
      toast.success("Eliminada");
    } catch (e: any) {
      toast.error(e?.message || "Error al eliminar");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4">
      {!mostrarFormulario ? (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-700">Formas de Pago</h1>
            <button
              onClick={abrirCrear}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Nueva Forma de Pago
            </button>
          </div>

          <DataTableFormasPago
            data={data}
            loading={loading}
            onEdit={abrirEditar}
            onDelete={onDelete}
          />
        </div>
      ) : (
        <FormularioFormaPago
          mode={modo}
          initial={formaSeleccionada}
          onSaved={onSaved}
          onCancel={cerrarFormulario}
        />
      )}
    </div>
  );
};

export default FormasPago;
