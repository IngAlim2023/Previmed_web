import React from "react";
import DataTable from "react-data-table-component";
import { ColumnDocumento, DataDocumento } from "../../../interfaces/tables.ts";

const DataTableDocumento: React.FC = () => {
  const columns: ColumnDocumento[] = [
    {
      name: "Tipo Documento",
      selector: (row) => row.nombre_documento,
      sortable: true,
    },
  ];

  const data: DataDocumento[] = [
    {
      idtipo_documento: 1,
      nombre_documento: "Cédula de ciudadanía",
    },
    {
      idtipo_documento: 2,
      nombre_documento: "Tarjeta de identidad",
    },
    {
      idtipo_documento: 3,
      nombre_documento: "Pasaporte",
    },
  ];
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Tipos de Documento</h2>
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

export default DataTableDocumento;
