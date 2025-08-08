import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { ColDataTablePagos, PagoInterface } from "../../interfaces/Pagos";
import FormularioPagos from "./FormularioPagos";
import DetallesPago from "./DetallesPago";
import AlertDelete from "../modales/AlertDelete";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import BtnLeer from "../botones/BtnLeer";
import BtnEditar from "../botones/BtnEditar";
import BtnEliminar from "../botones/BtnEliminar";
import BtnAgregar from "../botones/BtnAgregar";

const DataTablePagos: React.FC = () => {
  useEffect(() => {
    //Aqui se resivirá el servicio que trae los pagos desde nuestro backend
    const pagos = fetch("https://fakestoreapi.com/products", { method: "GET" });

    toast.promise(
      pagos,
      {
        loading: "Cargando los pagos...",
        success: "Pagos cargados exitosamente",
        error: "Error al cargar los pagos",
      },
      {
        id: "pagos-toast", // Este id es para evitar que el toast aparezca 2 veces
      }
    );
  }, []);

  //ESTADO PARA MANEJAR LA APAREICION DEL FORMULARIO
  const [form, setForm] = useState<boolean>(false);
  const [detalles, setDetalles] = useState<boolean>(false);
  const [alert, setalert] = useState<boolean>(false);
  const [pago, setPago] = useState<PagoInterface>();

  //COLUMNAS DE LA TABLA
  const columns: ColDataTablePagos[] = [
    {
      name: "N° Recibo",
      selector: (row) => row.noRecibo,
      sortable: true,
    },
    {
      name: "N° Contrato",
      selector: (row) => row.noContrato,
      sortable: true,
    },
    {
      name: "Titular",
      selector: (row) => row.titular,
      sortable: true,
    },
    {
      name: "Fecha Cobro",
      selector: (row) => row.fechaCobro,
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
      allowOverflow: true,
      button: true,
      minWidth:'180px'
    },
  ];

  //INFORMACIÓN QUE SE VA A RENDERIZAR
  const pagos: PagoInterface[] = [
    {
      idPago: 1,
      noRecibo: 1001,
      noContrato: 5001,
      titular: "Luis Fernández",
      cobrador: "Carlos Gómez",
      fechaCobro: "2025-07-01",
      fechaInicio: "2025-07-01",
      fechaFin: "2025-07-31",
      formaPago: "Efectivo",
      monto: 50000,
    },
    {
      idPago: 2,
      imagen:
        "https://i.pinimg.com/736x/42/d4/49/42d4497a0029456b16b9110cfed9b3a5.jpg",
      noRecibo: 1002,
      noContrato: 5002,
      titular: "María Rodríguez",
      cobrador: "Ana Torres",
      fechaCobro: "2025-07-02",
      fechaInicio: "2025-07-01",
      fechaFin: "2025-07-31",
      formaPago: "Transferencia",
      monto: 60000,
    },
    {
      idPago: 3,
      noRecibo: 1003,
      noContrato: 5003,
      titular: "Jorge Pérez",
      cobrador: "Carlos Gómez",
      fechaCobro: "2025-07-03",
      fechaInicio: "2025-07-01",
      fechaFin: "2025-07-31",
      formaPago: "Nequi",
      monto: 55000,
    },
    {
      idPago: 4,
      imagen:
        "https://i.pinimg.com/736x/42/d4/49/42d4497a0029456b16b9110cfed9b3a5.jpg",
      noRecibo: 1004,
      noContrato: 5004,
      titular: "Sandra Morales",
      cobrador: "Laura Méndez",
      fechaCobro: "2025-07-04",
      fechaInicio: "2025-07-01",
      fechaFin: "2025-07-31",
      formaPago: "Daviplata",
      monto: 52000,
    },
    {
      idPago: 5,
      noRecibo: 1005,
      noContrato: 5005,
      titular: "Andrés Castro",
      cobrador: "Ana Torres",
      fechaCobro: "2025-07-05",
      fechaInicio: "2025-07-01",
      fechaFin: "2025-07-31",
      formaPago: "Efectivo",
      monto: 58000,
    },
  ];

  const [buscarPago, setBuscarPago] = useState<string>('')

  const pagosFiltrados:PagoInterface[] = pagos.filter((pago)=> 
    pago.titular.toLowerCase().includes(buscarPago.toLowerCase()) ||
    pago.noContrato.toString().toLowerCase().includes(buscarPago.toLowerCase()) ||
    pago.noRecibo.toString().toLowerCase().includes(buscarPago.toLowerCase()) 
  )

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
              onChange={(e) =>setBuscarPago(e.target.value)}
              className="w-sm p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
            />

            <div onClick={() => setForm(true)}>
              <BtnAgregar verText={true}/>
              </div>
          </div>

          <DataTable
            columns={columns}
            data={pagosFiltrados}
            pagination
            highlightOnHover
            responsive
            striped
            noDataComponent="Pagos no encontrados"
          />
        </div>
        {form && <FormularioPagos pago={pago} setForm={setForm} />}
        {detalles && <DetallesPago pago={pago} setDetalles={setDetalles} />}
        {alert && (
          <AlertDelete
            nombre={`Recibo N° ${pago?.noRecibo}`}
            setAlert={setalert}
          />
        )}
      </div>
    </>
  );
};

export default DataTablePagos;
