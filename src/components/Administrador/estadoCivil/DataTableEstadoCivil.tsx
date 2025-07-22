import React from "react";
import DataTable from "react-data-table-component";
import BtnEditar from "../../botones/BtnEditar";
import BtnLeer from "../../botones/BtnLeer";
import BtnEliminar from "../../botones/BtnEliminar";
import { ColumnEstadoCivil, DataEstadoCivil } from "../../../interfaces/estadoCivil";

const DataTableEstadoCivil: React.FC = () => {
    const columns: ColumnEstadoCivil[] =[
        {
      name: "Estados civiles",
      selector: (row) => row.estado_civil,
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
    ]
  const data: DataEstadoCivil[] = [
    {
      id_estado_civil: 1,
      estado_civil: "Casado",
    },
    {
      id_estado_civil: 2,
      estado_civil: "Divorciado",
    },
    {
      id_estado_civil: 3,
      estado_civil: "Soltero",
    },
  ];
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">EPS</h2>
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

export default DataTableEstadoCivil;
