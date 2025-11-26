import React from "react";
import DataTable from "react-data-table-component";
import { FormaPago } from "../../interfaces/formaPago";
import BtnEditar from "../../components/botones/BtnEditar";
import BtnEstado from "../botones/BtnEstado";

type Props = {
  data: FormaPago[];
  loading: boolean;
  onEdit?: (forma: FormaPago) => void;
  onDelete?: (id: number) => void;
  onToggleState?: (id: number, estado: boolean) => void;
};


const DataTableFormasPago: React.FC<Props> = ({ data, loading, onEdit, onToggleState }) => {

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

          <div>
            <BtnEstado
              habilitado={row.estado}
              onClick={() => onToggleState?.(row.id_forma_pago, !row.estado)}
            />
          </div>
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

    </div>
  );
};

export default DataTableFormasPago;
