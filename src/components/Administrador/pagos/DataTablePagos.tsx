import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { ColDataTablePagos, PagoInterface } from "../../../interfaces/Pagos";
import { FaEye, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import FormularioPagos from "./FormularioPagos";
import DetallesPago from "./DetallesPago";
import AlertDelete from "../../generales/AlertDelete";
import AlertUpdate from "../../generales/AlertUpdate";

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
          <FaEye
            className="text-gray-400 hover:text-green-500 transition-easy duration-600 cursor-pointer w-5 h-auto"
            title="Ver detalles"
            onClick={()=>{
              setPago(row); 
              setDetalles(true)}}
          />
          <FaEdit
            className="text-gray-400 hover:text-blue-600 transition-easy duration-600 cursor-pointer w-5 h-auto"
            title="Editar"
            onClick={()=>{
              setPago(row)
              setForm(true)
            }}
          />
          <FaTrash
            className="text-gray-400 hover:text-red-700 transition-easy duration-600 cursor-pointer w-5 h-auto"
            title="Eliminar"
            onClick={()=>{
              setPago(row)
              setalert(true)
            }}
          />
        </div>
      ),
      ignoreRowClick: false,
      allowOverflow: true,
      button: true,
    },
  ];

  //INFORMACIÓN QUE SE VA A RENDERIZAR
  const info: PagoInterface[] = [
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

  return (
    <>
      <div className="min-h-screen flex items-center justify-center w-full px-4 py-8 bg-gray-100">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 overflow-x-auto">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Pagos registrados
            </h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
              onClick={()=>setForm(true)}
            >
              + Agregar Pago
            </button>
          </div>

          <DataTable
            columns={columns}
            data={info}
            pagination
            highlightOnHover
            responsive
            striped
            noDataComponent="No hay pagos registrados"
          />
        </div>
      {form && <FormularioPagos pago={pago} setForm={setForm}/>}
      {detalles && <DetallesPago pago={pago} setDetalles={setDetalles}/>}
      {alert && <AlertDelete nombre={`Recibo N° ${pago?.noRecibo}`} setAlert={setalert}/>}
      </div>
    </>
  );
};

export default DataTablePagos;
