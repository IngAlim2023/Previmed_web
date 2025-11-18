import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { ColDataTablePagos, PagoInterface } from "../../interfaces/Pagos";
import FormularioPagos from "./FormularioPagos";
import DetallesPago from "./DetallesPago";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import BtnLeer from "../botones/BtnLeer";
import BtnEditar from "../botones/BtnEditar";
import BtnEliminar from "../botones/BtnEliminar";
import BtnAgregar from "../botones/BtnAgregar";
import { getPagos as getPagosService, deletePago } from "../../services/pagosService";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { TbSettingsDollar } from "react-icons/tb";

const DataTablePagos: React.FC = () => {
  const [pagos, setPagos] = useState<PagoInterface[]>([]);
  const [form, setForm] = useState<boolean>(false);
  const [detalles, setDetalles] = useState<boolean>(false);
  const [pago, setPago] = useState<PagoInterface | null>(null);
  const [buscarPago, setBuscarPago] = useState<string>("");
  const {user} = useAuthContext()
  const navigate = useNavigate();

  // Evita doble ejecución del efecto en React 18 StrictMode
  const fetchedOnce = useRef(false);

  const getPagos = async (showToast = false) => {
    try {
      const data = await getPagosService();
      // solo el admin puede ver todos los pagos, de lo contrario aparecen los registrados o asigandos por el asesor
      if(user.rol?.nombreRol != "Administrador") {
        const pagosFiltrados = data.data.filter((p:PagoInterface) => p.cobradorId == user.id);
        setPagos(pagosFiltrados);
      }else{
        setPagos(data.data);
      }
      if (showToast) {
        toast.success("Pagos cargados exitosamente", { id: "pagos-cargados" });
      }
    } catch (error) {
      if (showToast) {
        toast.error("Error al cargar los pagos", { id: "pagos-cargados" });
      }
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    getPagos(true);
  }, []);

  const eliminarPago = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este registro de pago?")) return;
    try {
      await deletePago(id);
      toast.success("Pago eliminado correctamente");
      getPagos(); // recarga sin toast
    } catch {
      toast.error("Error al eliminar el registro de pago");
    }
  };

  const formatNombre = (row: PagoInterface) => {
    const usuario = (row.membresia as any)?.membresiaPaciente?.[0]?.paciente?.usuario;
    if (!usuario) return "";
    return [usuario.nombre, usuario.segundoNombre, usuario.apellido, usuario.segundoApellido]
      .filter(Boolean)
      .join(" ");
  };

  const formatFecha = (fecha: string | Date) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-CO");
  };

  const columns: ColDataTablePagos[] = [
    { name: "N° Recibo", selector: (row) => row.numeroRecibo || "Sin número" , sortable: true, maxWidth: '100px' },
    { name: "N° Contrato", selector: (row) => row.membresia.numeroContrato, sortable: true },
    { name: "Titular", selector: (row) => formatNombre(row), sortable: true },
    { name: "Fecha Cobro", selector: (row) => formatFecha(row.fechaPago), sortable: true, maxWidth:'130px' },
    { name: "Monto", selector: (row) => `$${row.monto}`, sortable: true },
    { name: "Forma de pago", selector: (row) => row.formaPago?.tipoPago || "", sortable: true },
    { name: "Estado", selector: (row) => <p className={`rounded-full px-2 font-semibold ${
      row.estado == 'Asignado'?'text-blue-700 bg-blue-100':
      row.estado == 'Realizado'?'text-orange-700 bg-orange-100':
      row.estado == 'Aprobado'?
      'text-green-700 bg-green-100':'text-gray-700 bg-gray-200'
    }`}>{row.estado}</p>
      
      , sortable: true, maxWidth: '110px' },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex justify-start">
          <div title="Ver detalles" onClick={() => { setPago(row); setDetalles(true); }}>
            <BtnLeer />
          </div>
          { user.rol?.nombreRol == 'Administrador'?
            (
              <>
                <div title="Editar" onClick={() => { setPago(row); setForm(true); }}>
                  <BtnEditar />
                </div>
                <div title="Eliminar" onClick={() => eliminarPago(row.idRegistro)}>
                  <BtnEliminar />
                </div>
              </>
            ):
            (<></>)
          }
        </div>
      ),
    },
  ];

  const pagosFiltrados = pagos
    .sort((a, b) => new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime())
    .filter((pago) => {
      const search = buscarPago.toLowerCase();
      const numeroContrato = (pago.membresia as any)?.numeroContrato;
      const numeroContratoStr = numeroContrato != null ? String(numeroContrato).toLowerCase() : "";
      return (
        formatNombre(pago).toLowerCase().includes(search) ||
        pago.monto?.toString().toLowerCase().includes(search) ||
        pago.idRegistro?.toString().toLowerCase().includes(search) ||
        formatFecha(pago.fechaPago).toLowerCase().includes(search) ||
        numeroContratoStr.includes(search)
      );
    });

  return (
    <>
      <div className="flex items-center justify-center w-full px-4 py-8 bg-blue-50">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-600 flex items-center">
              <HiOutlineDocumentCurrencyDollar className="w-10 h-auto text-blue-600 mr-4" />
              Pagos
            </h2>
            <input
              type="text"
              placeholder="Buscar por nombre, contrato, monto o recibo…"
              value={buscarPago}
              onChange={(e) => setBuscarPago(e.target.value)}
              className="w-sm p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
            />
            <div className="flex gap-2 items-center">
              { user.rol?.nombreRol == 'Administrador'?(
                <button onClick={()=> navigate('/formas_pago')} 
                className="
                  relative overflow-hidden flex items-center gap-2
                  text-amber-500 font-bold p-1.5 m-1 border-1 border-amber-500 rounded-md
                  transition-all duration-700 ease-in-out hover:text-white
                  bg-linear-to-r from-amber-500 to-amber-500
                  bg-no-repeat bg-[length:0%_0%] bg-left-bottom
                  hover:bg-[length:200%_200%]
                  hover:cursor-pointer
                  hover:shadow-none">
                  <TbSettingsDollar className="text-lg"/>
                  Formas de pago
                </button>
                ):(<></>)
              }
              <div onClick={() => { setPago(null); setForm(true); }}>
                <BtnAgregar verText={true} />
              </div>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={pagosFiltrados}
            pagination
            highlightOnHover
            responsive
            striped
            noDataComponent={
              <div className="text-center py-10 text-gray-500">
                <HiOutlineDocumentCurrencyDollar className="w-16 h-auto mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No hay registros de pago</p>
              </div>
            }
          />
        </div>
        {form && <FormularioPagos pago={pago} setForm={setForm} setPago={setPago} setPagos={setPagos} />}
        {detalles && <DetallesPago pago={pago} setDetalles={setDetalles} setPago={setPago} />}
      </div>
    </>
  );
};

export default DataTablePagos;
