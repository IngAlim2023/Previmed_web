import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { ColDataTablePagos } from "../../interfaces/Pagos";
import FormularioPagos from "./FormularioPagos";
import DetallesPago from "./DetallesPago";
import AlertDelete from "../modales/AlertDelete";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import BtnLeer from "../botones/BtnLeer";
import BtnEditar from "../botones/BtnEditar";
import BtnEliminar from "../botones/BtnEliminar";
import BtnAgregar from "../botones/BtnAgregar";

const DataTablePagos: React.FC = () => {
  const [pagos, setPagos] = useState([]);
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const res = await fetch("http://localhost:3333/registros-pago");
        const data = await res.json();

        toast.success("Pagos cargados exitosamente", { id: "pagos-toast" });
        setPagos(data.data);
      } catch (error) {
        toast.error("Error al cargar los pagos", { id: "pagos-toast" });
      }
    };

    toast.loading("Cargando los pagos...", { id: "pagos-toast" });
    fetchPagos();
  }, []);

  const [form, setForm] = useState<boolean>(false); //estado para el formulario
  const [detalles, setDetalles] = useState<boolean>(false); //estado para el modal de detalles
  const [alert, setalert] = useState<boolean>(false); // estado para el modal de confirmacion antes de eliminar
  const [pago, setPago] = useState<any>();

  //COLUMNAS DE LA TABLA
  const columns: ColDataTablePagos[] = [
    {
      name: "N° Recibo",
      selector: (row) => row.idRegistro,
      sortable: true,
    },
    {
      name: "N° Contrato",
      selector: (row) => row.membresia.numeroContrato,
      sortable: true,
    },
    {
      name: "Titular",
      selector: (row) => {
        const usuario = row.membresia.membresiaPaciente[0]?.paciente?.usuario;
        if (!usuario) return "";
        return `${usuario.nombre ?? ""} ${usuario.segundoNombre ?? ""} ${
          usuario.apellido ?? ""
        } ${usuario.segundoApellido ?? ""}`.trim();
      },
      sortable: true,
    },
    {
      name: "Fecha Cobro",
      selector: (row) => row.fechaInicio,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2 p-2 space-x-1">
          <div
            title="Ver detalles"
            onClick={() => {
              setPago(row);
              setDetalles(true);
            }}
          >
            <BtnLeer />
          </div>

          <div
            title="Editar"
            onClick={() => {
              setPago(row);
              setForm(true);
            }}
          >
            <BtnEditar />
          </div>

          <div
            title="Eliminar"
            onClick={() => {
              setPago(row);
              setalert(true);
            }}
          >
            <BtnEliminar />
          </div>
        </div>
      ),
      ignoreRowClick: false,
      button: true,
      minWidth: "180px",
    },
  ];

  const [buscarPago, setBuscarPago] = useState<string>("");

  /*const pagosFiltrados:any = pagos.filter((pago)=> 
    pago.fechaInicio.toLowerCase().includes(buscarPago.toLowerCase()) ||
    pago.fechaInicio.toString().toLowerCase().includes(buscarPago.toLowerCase()) ||
    pago.fechaInicio.toString().toLowerCase().includes(buscarPago.toLowerCase()) 
  )*/

  return (
    <>
      <div className="min-h-screen flex items-center justify-center w-full px-4 py-8 bg-gray-100">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <HiOutlineDocumentCurrencyDollar className="w-10 h-auto text-blue-600 mr-4" />
              Pagos
            </h2>

            <input
              type="text"
              placeholder="Buscar.."
              value={buscarPago}
              onChange={(e) => setBuscarPago(e.target.value)}
              className="w-sm p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
            />

            <div onClick={() => setForm(true)}>
              <BtnAgregar verText={true} />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={pagos}
            pagination
            highlightOnHover
            responsive
            striped
            noDataComponent="NO HAY REGISTROS DE PAGO"
          />
        </div>
        {form && <FormularioPagos pago={pago} setForm={setForm} />}
        {detalles && <DetallesPago pago={pago} setDetalles={setDetalles} />}
        {alert && (
          <AlertDelete
            nombre={`Recibo N° ${pago?.idRegistro}`}
            setAlert={setalert}
          />
        )}
      </div>
    </>
  );
};

export default DataTablePagos;
