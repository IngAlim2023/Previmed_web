import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import FormMedicos from "./FormMedicos";
import DetallesMedico from "./DetallesMedico";
import AlertDelete from "../modales/AlertDelete";
import {
  ColDataTableMedicos,
  MedicosInterface,
} from "../../interfaces/Medicos";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import BtnEliminar from "../botones/BtnEliminar";
import BtnEditar from "../botones/BtnEditar";
import BtnLeer from "../botones/BtnLeer";
import BtnAgregar from "../botones/BtnAgregar";
import { FaUserDoctor } from "react-icons/fa6";
import toast from "react-hot-toast";
import BtnCambiar from "../botones/BtnCambiar";

const TableMedicos: React.FC = () => {
  const [form, setForm] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [detalles, setDetalles] = useState<boolean>(false);
  const [medico, setMedico] = useState<MedicosInterface>();

  useEffect(() => {
    //Aqui se resivirá el servicio que trae los medicos desde nuestro backend
    const doctors = fetch("https://fakestoreapi.com/products", {
      method: "GET",
    });

    toast.promise(
      doctors,
      {
        loading: "Cargando los médicos...",
        success: "Médicos cargados exitosamente",
        error: "Error al cargar los Médicos",
      },
      {
        id: "doctors-toast", // Este id es para evitar que el toast aparezca 2 veces
      }
    );
  }, []);

  const columns: ColDataTableMedicos[] = [
    {
      name: "Nombre",
      selector: (row) => `${row.nombre} ${row.apellido}`,
      sortable: true,
    },
    {
      name: "N° documento",
      selector: (row) => row.numero_documento,
      sortable: true,
    },
    {
      name: "Dirección",
      selector: (row) => row.direccion,
    },
    {
      name: "Estado",
      selector: (row) =>
        row.estado ? (
          <FaCheckCircle title="Activo" className="w-4 h-auto text-green-500" />
        ) : (
          <FaTimesCircle
            title="Innactivo"
            className="w-4 h-auto text-red-500"
          />
        ),
      maxWidth: "80px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2 p-2 space-x-1">
          <div title="Cambiar estado">
            <BtnCambiar />
          </div>

          <div
            title="Ver detalles"
            onClick={() => {
              setMedico(row);
              setDetalles(true);
            }}
          >
            <BtnLeer />
          </div>

          <div
            title="Editar"
            onClick={() => {
              setMedico(row);
              setForm(true);
            }}
          >
            <BtnEditar />
          </div>

          <div
            title="Eliminar"
            onClick={() => {
              setMedico(row);
              setAlert(true);
            }}
          >
            <BtnEliminar />
          </div>
        </div>
      ),
      ignoreRowClick: false,
      allowOverflow: true,
      button: true,
      minWidth: "240px",
    },
  ];

  const medicos: MedicosInterface[] = [
    {
      id_medico: 1,
      nombre: "Carlos",
      segundo_nombre: "Eduardo",
      apellido: "Ramírez",
      segundo_apellido: "Gómez",
      email: "carlos.ramirez@example.com",
      telefono: "3104567890",
      direccion: "Calle 45 #12-30",
      numero_documento: "1032456789",
      fecha_nacimiento: new Date("1980-05-14"),
      numero_hijos: "2",
      estrato: "3",
      barrio: "La Esperanza",
      eps: "Sura",
      rol: "medico",
      genero: "masculino",
      tipo_documento: "CC",
      estado_civil: "casado",
      autorizacion_datos: true,
      password: "12345678",
      created: new Date("2023-01-10"),
      updated: new Date("2024-07-01"),
      habilitar: true,
      disponibilidad: true,
      estado: true,
      usuario_id: "u001",
    },
    {
      id_medico: 2,
      nombre: "Laura",
      apellido: "Martínez",
      email: "laura.martinez@example.com",
      telefono: "3112345678",
      direccion: "Carrera 7 #56-89",
      numero_documento: "1045896231",
      fecha_nacimiento: new Date("1990-08-22"),
      barrio: "El Prado",
      rol: "medico",
      tipo_documento: "CC",
      autorizacion_datos: true,
      password: "securepass123",
      created: new Date("2023-05-12"),
      updated: new Date("2024-07-01"),
      habilitar: true,
      disponibilidad: false,
      estado: false,
      usuario_id: "u002",
    },
    {
      id_medico: 3,
      nombre: "Andrés",
      segundo_nombre: "Felipe",
      apellido: "González",
      email: "andres.gonzalez@example.com",
      telefono: "3009876543",
      direccion: "Av. Siempre Viva 123",
      numero_documento: "1098765432",
      fecha_nacimiento: new Date("1985-12-03"),
      numero_hijos: "1",
      barrio: "San Fernando",
      rol: "medico",
      genero: "masculino",
      tipo_documento: "CC",
      autorizacion_datos: true,
      password: "claveAndres!",
      created: new Date("2022-09-01"),
      updated: new Date("2024-06-15"),
      habilitar: false,
      disponibilidad: true,
      estado: true,
      usuario_id: "u003",
    },
    {
      id_medico: 4,
      nombre: "Diana",
      segundo_nombre: "Carolina",
      apellido: "Ríos",
      email: "diana.rios@example.com",
      telefono: "3201234567",
      direccion: "Cra 33 #45-67",
      numero_documento: "1056789345",
      fecha_nacimiento: new Date("1992-04-18"),
      estrato: "4",
      barrio: "Santa Fe",
      eps: "Coomeva",
      rol: "medico",
      genero: "femenino",
      tipo_documento: "CC",
      estado_civil: "soltera",
      autorizacion_datos: true,
      password: "dianaSecure456",
      created: new Date("2023-11-25"),
      updated: new Date("2024-07-10"),
      habilitar: true,
      disponibilidad: false,
      estado: false,
      usuario_id: "u004",
    },
    {
      id_medico: 5,
      nombre: "José",
      apellido: "Moreno",
      segundo_apellido: "López",
      email: "jose.moreno@example.com",
      telefono: "3011122334",
      direccion: "Calle 10 #20-30",
      numero_documento: "1067890123",
      fecha_nacimiento: new Date("1978-11-09"),
      barrio: "Las Palmas",
      rol: "medico",
      tipo_documento: "CC",
      autorizacion_datos: true,
      password: "joseClave987",
      created: new Date("2022-04-03"),
      updated: new Date("2024-05-25"),
      habilitar: false,
      disponibilidad: true,
      estado: true,
      usuario_id: "u005",
    },
  ];

  const [buscarMedico, setBuscarMedico] = useState<string>('')

    const medicosFiltrados:MedicosInterface[] = medicos.filter((medico)=>
      medico.nombre.toLowerCase().includes(buscarMedico.toLowerCase()) ||
      medico.segundo_nombre?.toLowerCase().includes(buscarMedico.toLowerCase()) ||
      medico.apellido.toLowerCase().includes(buscarMedico.toLowerCase()) ||
      medico.segundo_apellido?.toLowerCase().includes(buscarMedico.toLowerCase()) ||
      medico.numero_documento.toLowerCase().includes(buscarMedico.toLowerCase())
    );
  

  return (
    <>
      <div className="min-h-screen flex items-center justify-center w-full px-4 py-8 bg-gray-100">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FaUserDoctor className="w-10 h-auto text-blue-600 mr-4" />
              Médicos 
            </h2>

            <input
              type="text"
              placeholder="Buscar..."
              value={buscarMedico}
              onChange={(e) =>setBuscarMedico(e.target.value)}
              className="w-sm p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
            />

            <div onClick={() => setForm(true)}>
              <BtnAgregar verText={true} />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={medicosFiltrados}
            pagination
            highlightOnHover
            responsive
            striped
            noDataComponent="Médicos no encontrados"
          />
        </div>
        {form && <FormMedicos medico={medico} setForm={setForm} />}
        {detalles && (
          <DetallesMedico medico={medico} setDetalles={setDetalles} />
        )}
        {alert && (
          <AlertDelete
            nombre={`Medico ${medico?.nombre} ${medico?.apellido}`}
            setAlert={setAlert}
          />
        )}
      </div>
    </>
  );
};

export default TableMedicos;
