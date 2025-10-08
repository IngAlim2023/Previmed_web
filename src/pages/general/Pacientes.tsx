import React, { useEffect, useState } from "react";
import {
  deletePaciente,
  readPacientes,
} from "../../services/pacientes";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Paciente {
  id: number;
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
    numeroDocumento: string;
  };
}

const Pacientes: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Paciente[]>([]);
  const [idDelete, setIdDelete] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [accion, setAccion] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const dat = await readPacientes();

      setData(dat.data || []);
    };
    load();
  }, [accion]);

  const handleEdit = (row: Paciente) => {
    console.log("Editar paciente", row);
    // Aquí puedes navegar a una vista de edición o abrir un modal
  };

  const handleDelete = async (row: Paciente) => {
    setIdDelete(row.idPaciente);
    setOpen(true);
  };

  const columns: TableColumn<Paciente>[] = [
    {
      name: "Nombre",
      selector: (row) => row.usuario.nombre,
      sortable: true,
    },
    {
      name: "Apellido",
      selector: (row) => row.usuario.apellido,
      sortable: true,
    },
    {
      name: "Correo",
      selector: (row) => row.usuario.email,
      sortable: true,
    },
    {
      name: "Documento",
      selector: (row) => row.usuario.numeroDocumento,
      sortable: true,
    },
    {
      name: "Opciones",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 transition"
          >
            <FaEdit /> Editar
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1 transition"
          >
            <FaTrash /> Eliminar
          </button>
        </div>
      ),
    },
  ];

  const deletePac = async () => {
    const res = await deletePaciente(idDelete);
    setOpen(false);
    setIdDelete(0);
    if (res.message === "Error")
      return toast.error(
        "No se puede eliminar el paciente por politicas de datos"
      );
    return toast.success("Paciente eliminado");
  };

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex p-2 justify-between items-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            📋 Lista de Pacientes
          </h2>
          <button
            onClick={() => navigate("/formularioPacientes")}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1 transition"
          >
            <FaPlus /> Crear
          </button>
        </div>
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={{
            headCells: {
              style: {
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: "#f3f4f6",
              },
            },
            rows: {
              style: {
                fontSize: "14px",
                minHeight: "60px",
              },
            },
          }}
        />
      </div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Contenido del modal */}
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Eliminar paciente
            </h2>
            <p className="text-gray-600 mb-6">
              Este es un ejemplo de modal con Tailwind y React.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  setIdDelete(0);
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => deletePac()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Confirmar
              </button>
            </div>

            {/* Botón cerrar (X) arriba a la derecha */}
            <button
              onClick={() => {
                setOpen(false);
                setIdDelete(0);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 animate-pulse"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pacientes;
