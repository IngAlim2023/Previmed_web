import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FormaPago } from "../../interfaces/formaPago";
import { formasPagoService } from "../../services/formasPagoService";
import DataTableFormasPago from "../../components/formasPagos/DataTableFormasPago";
import FormularioFormaPago from "../../components/formasPagos/FormularioFormaPago";

const FormasPago: React.FC = () => {
  const [data, setData] = useState<FormaPago[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<FormaPago | null>(null);

  // Cargar lista al iniciar

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await formasPagoService.getAll();
      setData(list);
    } catch (err: any) {
      toast.error("Error cargando formas de pago");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Abrir modal para editar

  const handleEdit = (forma: FormaPago) => {
    setEditItem(forma);
    setShowForm(true);
  };

  const handleSaved = async (saved: FormaPago) => {
    setShowForm(false);
    setEditItem(null);

    // Actualizar lista en memoria
    setData((prev) => {
      const exists = prev.some((i) => i.id_forma_pago === saved.id_forma_pago);
      if (exists) {
        return prev.map((i) =>
          i.id_forma_pago === saved.id_forma_pago ? saved : i
        );
      }
      return [...prev, saved];
    });
  };


  const handleToggleState = async (id: number, nuevoEstado: boolean) => {
    try {
      const res = await formasPagoService.cambiarEstadoFormaPago(
        id,
        nuevoEstado
      );

      const updatedEstado =
        res?.data?.estado ??
        res?.estado ??
        nuevoEstado;

      setData((prev) =>
        prev.map((fp) =>
          fp.id_forma_pago === id
            ? { ...fp, estado: Boolean(updatedEstado) }
            : fp
        )
      );

      toast.success(
        `Estado cambiado a ${updatedEstado ? "ACTIVO ✔️" : "INACTIVO ❌"
        }`
      );
    } catch (error: any) {
      toast.error(error?.message || "Error cambiando estado");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Formas de Pago</h1>

      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        onClick={() => {
          setShowForm(true);
          setEditItem(null);
        }}
      >
        + Agregar Forma de Pago
      </button>

      <DataTableFormasPago
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onToggleState={handleToggleState}
      />

      {showForm && (
        <FormularioFormaPago
          mode={editItem ? "edit" : "create"}
          initial={editItem}
          onSaved={handleSaved}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default FormasPago;
