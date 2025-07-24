import React from 'react';
import DataTable from 'react-data-table-component';
import { ColumnGeneros, DataGeneros } from '../../../interfaces/generos';
import BtnEditar from "../../botones/BtnEditar";
import BtnLeer from "../../botones/BtnLeer";
import BtnEliminar from "../../botones/BtnEliminar";


const DataTableGeneros:React.FC = () => {
  const columns: ColumnGeneros[] = [
    {
      name: "Generos",
      selector: (row) => row.generos,
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
  const data: DataGeneros[] = [
      {
        id_genero: 1,
        generos: "Masculino",
      },
      {
        id_genero: 2,
        generos: "Femenino",
      },
      {
        id_genero: 3,
        generos: "Otro",
      },
    ];
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Generos
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
  )
}

export default DataTableGeneros
