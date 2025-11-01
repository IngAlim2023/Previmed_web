// src/components/beneficiarios/BeneficiariosTable.tsx
import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import BtnEliminar from "../botones/BtnEliminar";
import BtnLeer from "../botones/BtnLeer";

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
  onRead: (row: Beneficiario) => void;
}

const BeneficiariosTable: React.FC<Props> = ({ data, onDelete, onRead }) => {
  const [search, setSearch] = useState("");

  const columns: TableColumn<Beneficiario>[] = [
    {
      name: "Nombre",
      selector: (row) => `${row.usuario.nombre} ${row.usuario.apellido}`,
      sortable: true,
    },
    {
      name: "Documento",
      selector: (row) => row.usuario.numeroDocumento,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.usuario.email,
      sortable: true,
    },
    {
      name: "Habilitado",
      selector: (row) => (row.activo ? "Sí" : "No"),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => onRead(row)}>
            <BtnLeer verText={false} text="" />
          </button>
          <button onClick={() => onDelete(row.idPaciente)}>
            <BtnEliminar></BtnEliminar>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredData = data.filter((b) => {
    const full = `${b.usuario.nombre} ${b.usuario.segundoNombre} ${b.usuario.apellido} ${b.usuario.segundoApellido}`.toLowerCase();
    return (
      full.includes(search.toLowerCase()) ||
      (b.usuario.numeroDocumento || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.usuario.email || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por nombre, documento o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        noDataComponent="No hay beneficiarios disponibles"
      />
    </div>
  );
};

export default BeneficiariosTable;
