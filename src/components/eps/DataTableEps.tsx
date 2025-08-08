import React from "react";
import DataTable from "react-data-table-component";
import { ColumnEps, DataEps } from "../../interfaces/tables";
import BtnEditar from "../botones/BtnEditar";
import BtnLeer from "../botones/BtnLeer";
import BtnEliminar from "../botones/BtnEliminar";

const DataTableEps: React.FC = () => {
  const columns: ColumnEps[] = [
    {
      name: "EPS",
      selector: (row) => row.nombre_eps,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) =>(
        <div className="flex gap-2 justify-center">
          <BtnEditar verText={false} text={"text-base"}/>
          <BtnLeer verText={false} text={"text-base"}/>
          <BtnEliminar  verText={false} text={"text-base"}/>
        </div>
      )
    }
  ];

  const data: DataEps[] = [
    {
      ideps: 1,
      nombre_eps: "Sanitas",
    },
    {
      ideps: 2,
      nombre_eps: "NUEVA EPS",
    },
    {
      ideps: 3,
      nombre_eps: "AIC",
    },
  ];
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          EPS
        </h2>
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          responsive
          striped
          noDataComponent="No hay documentos registrados"
        />
      </div>
    </div>
  );
};

export default DataTableEps;
