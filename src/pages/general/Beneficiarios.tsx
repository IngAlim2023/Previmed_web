import React, { useEffect, useState } from "react";
import {
  readBeneficiarios,
  deletePaciente,
} from "../../services/pacientes";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  titular: string;
}

const Beneficiarios: React.FC = () => {
  const [data, setData] = useState<Beneficiario[]>([]);
  const [idDelete, setIdDelete] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [accion, setAccion] = useState<boolean>(false);

  // 🔹 Carga de beneficiarios
  useEffect(() => {
    const load = async () => {
      try {
        const res = await readBeneficiarios();
        setData(res.data || []);
      } catch (error) {
        toast.error("Error al obtener los beneficiarios");
      }
    };
    load();
  }, [accion]);

  const handleEdit = (row: Beneficiario) => {
    console.log("Editar beneficiario", row);
    toast("Función de edición próximamente.");
  };

  const handleDelete = (row: Beneficiario) => {
    setIdDelete(row.id);
    setOpen(true);
  };

  const deleteBen = async () => {
    const res = await deletePaciente(idDelete);
    setOpen(false);
    setIdDelete(0);
    if (res.message === "Error") {
      return toast.error("No se puede eliminar el beneficiario");
    }
    toast.success("Beneficiario eliminado correctamente");
    setAccion(!accion);
  };

  const columns: TableColumn<Beneficiario>[] = [
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Apellido", selector: (row) => row.apellido, sortable: true },
    { name: "Documento", selector: (row) => row.documento, sortable: true },
    { name: "Correo", selector: (row) => row.email, sortable: true },
    { name: "Titular", selector: (row) => row.titular, sortable: true },
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

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex p-2 justify-between items-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            👥 Lista de Beneficiarios
          </h2>
          <button
            onClick={() => toast("Función de creación próximamente.")}
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
          noDataComponent="No hay beneficiarios registrados"
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

      {/* Modal eliminar */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Eliminar beneficiario
            </h2>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este beneficiario?
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
                onClick={deleteBen}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Confirmar
              </button>
            </div>
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

export default Beneficiarios;
