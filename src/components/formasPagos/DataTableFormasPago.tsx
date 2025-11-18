import React from "react";
import DataTable from "react-data-table-component";
import { FormaPago } from "../../interfaces/formaPago";

type Props = {
  data: FormaPago[];
  loading: boolean;
  onEdit?: (forma: FormaPago) => void;
  onDelete?: (id: number) => void;
};

const DataTableFormasPago: React.FC<Props> = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      name: "Tipo de pago",
      selector: (row: FormaPago) => row.tipo_pago,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row: FormaPago) => (row.estado ? "Activa" : "Inactiva"),
      sortable: true,
      width: "140px",
    },
    {
      name: "Acciones",
      cell: (row: FormaPago) => (
        <div className="flex gap-2 justify-center">
          <button
            className="px-2 py-1 rounded bg-blue-600 text-white text-sm"
            onClick={() => onEdit?.(row)}
          >
            Editar
          </button>
          <button
            className="px-2 py-1 rounded bg-red-600 text-white text-sm"
            onClick={() => onDelete?.(row.id_forma_pago)}
          >
            Eliminar
          </button>
        </div>
      ),
      width: "220px",
    },
  ];

  return (
    <div className="bg-white p-4 overflow-x-auto w-full max-w-4xl mx-auto">
      <DataTable
        columns={columns as any}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        striped
        noDataComponent="No hay formas de pago registradas"
      />
    </div>
  );
};

export default DataTableFormasPago;
