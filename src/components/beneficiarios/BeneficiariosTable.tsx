// src/components/beneficiarios/BeneficiariosTable.tsx
import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaTrash, FaUser } from "react-icons/fa";
import BtnEliminar from "../botones/BtnEliminar";

interface Usuario {
  idUsuario: string;
  nombre: string;
  segundoNombre: string;
  apellido: string;
  segundoApellido: string;
  email: string;
  numeroDocumento: string;
}

interface Beneficiario {
  idPaciente: number;
  usuario: Usuario;
  direccionCobro: string;
  ocupacion: string;
  activo: boolean;
  beneficiario: boolean;
}

interface Props {
  data: Beneficiario[];
  onDelete: (id: number) => void;
}

const BeneficiariosTable: React.FC<Props> = ({ data, onDelete }) => {
  const columns: TableColumn<Beneficiario>[] = [
    {
      name: "Beneficiario",
      cell: (row) => (
        <div className="py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
            <FaUser />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {row.usuario.nombre} {row.usuario.apellido}
            </p>
            <p className="text-xs text-gray-500">
              {row.usuario.numeroDocumento}
            </p>
          </div>
        </div>
      ),
      width: "250px",
    },
    {
      name: "Email",
      selector: (row) => row.usuario.email,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.activo
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => onDelete(row.idPaciente)}>
            <BtnEliminar></BtnEliminar>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        paginationPerPage={10}
        highlightOnHover
        striped
        responsive
        noDataComponent={
          <div className="py-12 text-center">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No hay beneficiarios registrados
            </p>
          </div>
        }
        customStyles={{
          headCells: {
            style: {
              fontWeight: "bold",
              fontSize: "14px",
              backgroundColor: "#f3f4f6",
              borderBottom: "2px solid #e5e7eb",
            },
          },
          rows: {
            style: {
              fontSize: "14px",
              minHeight: "70px",
              borderBottom: "1px solid #e5e7eb",
            },
          },
        }}
      />
    </div>
  );
};

export default BeneficiariosTable;
