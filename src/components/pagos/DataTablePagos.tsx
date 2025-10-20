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

const DataTablePagos: React.FC = () => {
  const [pagos, setPagos] = useState<PagoInterface[]>([]);
  const [form, setForm] = useState<boolean>(false);
  const [detalles, setDetalles] = useState<boolean>(false);
  const [pago, setPago] = useState<PagoInterface | null>(null);
  const [buscarPago, setBuscarPago] = useState<string>("");

  // Evita doble ejecución del efecto en React 18 StrictMode
  const fetchedOnce = useRef(false);

  const getPagos = async (showToast = false) => {
    try {
      const data = await getPagosService();
      setPagos(data.data);
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
    const usuario = row.membresia.membresiaPaciente[0]?.paciente?.usuario;
    if (!usuario) return "";
    return [usuario.nombre, usuario.segundoNombre, usuario.apellido, usuario.segundoApellido]
      .filter(Boolean)
      .join(" ");
  };

  const formatFecha = (fecha: string) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-CO");
  };

  const columns: ColDataTablePagos[] = [
    { name: "N° Recibo", selector: (row) => row.idRegistro, sortable: true },
    { name: "N° Contrato", selector: (row) => row.membresia.numeroContrato, sortable: true },
    { name: "Titular", selector: (row) => formatNombre(row), sortable: true },
    { name: "Fecha Cobro", selector: (row) => formatFecha(row.fechaPago), sortable: true },
    { name: "Monto", selector: (row) => `$${row.monto}`, sortable: true },
    { name: "Forma de pago", selector: (row) => row.formaPago?.tipoPago || "", sortable: true },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2 p-2 space-x-1 w-full justify-center">
          <div title="Ver detalles" onClick={() => { setPago(row); setDetalles(true); }}>
            <BtnLeer />
          </div>
          <div title="Editar" onClick={() => { setPago(row); setForm(true); }}>
            <BtnEditar />
          </div>
          <div title="Eliminar" onClick={() => eliminarPago(row.idRegistro)}>
            <BtnEliminar />
          </div>
        </div>
      ),
    },
  ];

  const pagosFiltrados = pagos
    .sort((a, b) => new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime())
    .filter((pago) =>
      formatNombre(pago).toLowerCase().includes(buscarPago.toLowerCase()) ||
      pago.monto?.toString().toLowerCase().includes(buscarPago.toLowerCase()) ||
      pago.idRegistro?.toString().toLowerCase().includes(buscarPago.toLowerCase()) ||
      formatFecha(pago.fechaPago).includes(buscarPago) ||
      pago.membresia.numeroContrato?.toLowerCase().includes(buscarPago.toLowerCase())
    );

  return (
    <>
      <div className="min-h-screen flex items-center justify-center w-full px-4 py-8 bg-blue-50">
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
            <div onClick={() => { setPago(null); setForm(true); }}>
              <BtnAgregar verText={true} />
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
