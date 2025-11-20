import React, { useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { IoAlertCircleOutline, IoClose } from "react-icons/io5";
import { FormaPago } from "../../interfaces/formaPago";
import BtnEditar from "../../components/botones/BtnEditar";
import BtnEliminar from "../../components/botones/BtnEliminar";

type Props = {
  data: FormaPago[];
  loading: boolean;
  onEdit?: (forma: FormaPago) => void;
  onDelete?: (id: number) => void;
};

const AlertDelete: React.FC<{
  nombre: string;
  setAlert: (value: boolean) => void;
  onConfirm: () => void;
}> = ({ nombre, setAlert, onConfirm }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Confirmar eliminación</h3>
        <button
          onClick={() => setAlert(false)}
          className="text-white hover:bg-red-700 p-1 rounded-lg"
        >
          <IoClose size={20} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-center mb-4">
          <IoAlertCircleOutline className="text-6xl text-red-500" />
        </div>
        <p className="text-center text-gray-700">¿Eliminar la forma de pago?</p>
        <p className="text-center text-lg font-semibold text-red-600 mt-1 mb-6">
          "{nombre}"
        </p>
        <p className="text-center text-sm text-gray-500">
          Esta acción no se puede deshacer.
        </p>
      </div>

      <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t">
        <button
          onClick={() => setAlert(false)}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>

        <button
          onClick={() => {
            onConfirm();
            setAlert(false);
            toast.success(`${nombre} eliminado`);
          }}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

const DataTableFormasPago: React.FC<Props> = ({ data, loading, onEdit, onDelete }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FormaPago | null>(null);

  const handleDeleteClick = (row: FormaPago) => {
    setSelectedItem(row);
    setShowAlert(true);
  };

  const columns = [
    {
      name: "Tipo de pago",
      selector: (row: FormaPago) => row.tipo_pago,
      sortable: true,
      wrap: true,
      grow: 2,
    },
    {
      name: "Estado",
      selector: (row: FormaPago) => (
        <span
          className={`px-3 rounded-full text-xm font-semibold text-white ${
            row.estado
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {row.estado ? "✓  Activa" : "✗ Inactiva"}
        </span>
      ),
      center: true,
      width: "130px",
    },
    {
      name: "Acciones",
      center: true,
      width: "130px",
      cell: (row: FormaPago) => (
        <div className="flex gap-3">
          <button
            onClick={() => onEdit?.(row)}
            className="p-2 rounded-lg hover:bg-blue-100 transition"
          >
            <BtnEditar />
          </button>

          <button
            onClick={() => handleDeleteClick(row)}
            className="p-2 rounded-lg hover:bg-red-100 transition"
          >
            <BtnEliminar />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <DataTable
        columns={columns as any}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        dense
        responsive
        noDataComponent={<div className="py-10 text-gray-500">No hay datos registrados</div>}
      />

      {showAlert && selectedItem && (
        <AlertDelete
          nombre={selectedItem.tipo_pago}
          setAlert={setShowAlert}
          onConfirm={() => onDelete?.(selectedItem.id_forma_pago)}
        />
      )}
    </div>
  );
};

export default DataTableFormasPago;
