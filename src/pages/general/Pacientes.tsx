import React, { useEffect, useState } from "react";
import {
  deletePaciente,
  readPacientes,
} from "../../services/pacientes";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaPlus, FaUsers } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BtnEliminar from "../../components/botones/BtnEliminar";
import BtnEditar from "../../components/botones/BtnEditar";
import BtnLeer from "../../components/botones/BtnLeer";
import { useAuthContext } from "../../context/AuthContext";
import BtnDescargarPdf from "../../components/botones/BtnDescargarPdf";
import BtnExportarPacientes from "../../components/botones/BtnExportPacientes";
import DetallesPaciente from "../../components/pacientes/DetallesPaciente";

interface Paciente {
  id: number;
  usuario: {
    nombre: string;
    segundoNombre: string;
    apellido: string;
    segundoApellido: string;
    email: string;
    numeroDocumento: string;
  };
}

const Pacientes: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Paciente[]>([]);
  const [idDelete, setIdDelete] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [buscar, setBuscar] = useState<string>('');
  const {user} = useAuthContext();
  const [detalles, setDetalles] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const dat = await readPacientes();
      setData(dat.data || []);
    };
    load();
  }, []);

  const handleEdit = (row: Paciente) => {
    console.log("Editar paciente", row);
  };

  const handleDelete = async (row: Paciente) => {
    setIdDelete(row.id);
    setOpen(true);
  };

  const columns: TableColumn<any>[] = [
    {
      name: "Nombres",
      selector: (row) => `${row.usuario.nombre} ${row.usuario.segundo_nombre??''}`,
      sortable: true,
    },
    {
      name: "Apellidos",
      selector: (row) => `${row.usuario.apellido} ${row.usuario.segundo_apellido??''}`,
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
      name: "Cargo",
      selector: (row) => row.pacienteId == null? (<p className="bg-blue-100 text-blue-600 px-2 rounded-full">TITULAR</p>) : (<p className="bg-gray-100 text-gray-600 px-2 rounded-full">BENEFICIARIO</p>),
      sortable: true,
    },
    {
      name: "Opciones",
      minWidth: "310px",
      cell: (row) => (
        <div className="flex">
          <div
            title="Descargar contrato"
            onClick={() => handleEdit(row)}
            >
            <BtnDescargarPdf idUsuario={row.usuario.idUsuario??''}/>
          </div>
          <div
            title="Ver detalles"
            onClick={() => console.log(row)}
            >
            <BtnLeer/>
          </div>
          {user.rol?.nombreRol == 'Administrador'? (
            <>
              <div onClick={() => handleEdit(row)}>
                <BtnEditar/>
              </div>
              <div onClick={() => handleDelete(row)}>
                <BtnEliminar/>
              </div>
              </>
            ):
            (<></>)}
            {
              row.pacienteId == null? ( 
              <button
              onClick={() => navigate('/beneficiarios', {state: {row}})}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 m-1 rounded-md flex items-center transition"
            >
              Beneficiarios
            </button>) : (<></>)
            }
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

  const pacientesFiltrados = data.filter((pac) => {
    const fullName = [
      pac.usuario.nombre,
      pac.usuario.segundoNombre,
      pac.usuario.apellido,
      pac.usuario.segundoApellido
    ].join(" ").toLowerCase();

    const buscarLower = buscar.toLowerCase();

    return (
      fullName.includes(buscarLower) || 
      pac.usuario.email?.toLowerCase().includes(buscarLower) ||
      pac.usuario.numeroDocumento?.toString().toLowerCase().includes(buscarLower)
    );
  });

  return (
    <div className="py-6 px-4 bg-blue-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex p-2 justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-600 flex items-center">
            <FaUsers className="w-10 h-auto text-blue-600 mr-4" />Pacientes
          </h2>

          <input
            type="text"
            placeholder="Buscar..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="w-sm p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
          />

          <div className="flex gap-2">
          <BtnExportarPacientes/>

          <button
            onClick={() => navigate("/formularioPacientes")}
            className="bg-green-500 hover:bg-green-600 text-white px-3 p-2 rounded-md flex items-center gap-2 transition text-lg"
            >
            <FaPlus /> Agregar Titular
          </button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={pacientesFiltrados}
          pagination
          highlightOnHover
          striped
          noDataComponent={'No hay resultados'}
          responsive
        />
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          {/* Contenido del modal */}
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Eliminar paciente
            </h2>
            <p className="text-gray-600 mb-6">
              Estas seguro de eliminar este paciente ?
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

      {detalles && <DetallesPaciente detalles={detalles} setDetalles={setDetalles}/>}
    </div>
  );
};

export default Pacientes;