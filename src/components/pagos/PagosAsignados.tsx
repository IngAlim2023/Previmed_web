import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { PagoInterface } from "../../interfaces/Pagos";
import { getPagosAsignados, setEstadoPago, subirEvidenciaPago } from "../../services/pagosService";
import { useAuthContext } from "../../context/AuthContext";

type propsModal = {
  pago: PagoInterface;
  onClose: any;
  onSuccess: any;
}

const Modal = ({ pago, onClose, onSuccess }:propsModal) => {
  const [archivo, setArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleArchivoChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVistaPrevia(reader.result as any);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOmitir = async () => {
    setCargando(true);
    try {
      await setEstadoPago('Realizado', Number(pago.idRegistro));
      toast.success('Pago realizado correctamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al realizado el pago');
    } finally {
      setCargando(false);
    }
  };

  const handleSubir = async () => {
    if (!archivo) return;
    
    setCargando(true);
    const loadingToast = toast.loading('Procesando pago...');
    try {
      await subirEvidenciaPago(archivo, pago.idRegistro);
      await setEstadoPago('Realizado', Number(pago.idRegistro));
      toast.success('Evidencia cargada y pago realizado correctamente', {
        id: loadingToast
      });
      onSuccess();
    } catch (error) {
      toast.error('Error al procesar el pago', {
        id: loadingToast
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            ¿Deseas cargar una evidencia del pago?
          </p>
          <div className="mb-4">          
            {vistaPrevia ? (
              <div className="relative">
                <img
                  src={vistaPrevia}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={() => {
                    setArchivo(null);
                    setVistaPrevia(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArchivoChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Haz clic para seleccionar una imagen
                  </span>
                </label>
              </div>
            )}
          </div>
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Monto:</span> ${pago.monto} COP
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={cargando}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleOmitir}
            disabled={cargando}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cargando ? 'Procesando...' : 'Omitir'}
          </button>
          <button
            onClick={handleSubir}
            disabled={!archivo || cargando}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              archivo && !cargando
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {cargando ? 'Subiendo...' : 'Subir'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PagosAsignados = () => {
  const { user } = useAuthContext();
  const [pagos, setPagos] = useState<PagoInterface[]>([]);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoInterface | null>(null);

  useEffect(() => {
    cargarPagos();
  }, [user.id]);

  const cargarPagos = async () => {
    try {
      const res = await getPagosAsignados(user.id ?? "");
      setPagos(res.data);
    } catch (error) {
      throw error
    }
  };

  const handleModalSuccess = () => {
    setPagoSeleccionado(null);
    cargarPagos();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-transparent mb-4">
      {/* Modal */}
      {pagoSeleccionado && (
        <Modal
          pago={pagoSeleccionado}
          onClose={() => setPagoSeleccionado(null)}
          onSuccess={handleModalSuccess}
        />
      )}

      {pagos.length > 0 ? (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 bg-white rounded-xl shadow-lg py-3 px-6 inline-block mb-6">
            Pagos asignados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pagos.map((pago) => (
              <div
                key={pago.idRegistro}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {pago.foto && (
                  <img
                    src={pago.foto}
                    alt="Comprobante de pago"
                    className="w-full h-40 object-contain"
                  />
                )}

                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-blue-600 font-semibold">
                      Nº {pago.numeroRecibo}
                    </p>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      {pago.estado}
                    </span>
                  </div>

                  <p className="text-gray-800 font-bold text-xl">
                    ${pago.monto.toLocaleString()} COP
                  </p>

                  <div className="border-t border-gray-100 pt-3 text-sm text-gray-600">
                    <p className="font-semibold text-gray-700 mb-2">Titular</p>
                    <p className="font-medium">
                      {pago.membresia.membresiaPaciente[0].paciente.usuario.nombre}{" "}
                      {pago.membresia.membresiaPaciente[0].paciente.usuario.apellido}
                    </p>
                    <p className="text-gray-500">
                      {pago.membresia.membresiaPaciente[0].paciente.usuario.email}
                    </p>
                    <p className="text-gray-500">
                      {pago.membresia.membresiaPaciente[0].paciente.usuario.direccion}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 flex justify-between bg-gray-50 rounded-lg p-2">
                    <div>
                      <span className="font-medium text-gray-700">Inicio:</span>
                      <p>{formatDate(String(pago.fechaInicio))}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-700">Fin:</span>
                      <p>{formatDate(String(pago.fechaFin))}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 px-4 pb-4">
                  <button
                    onClick={() => setPagoSeleccionado(pago)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
                  >
                    Marcar como realizado
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
        </div>
      )}
    </div>
  );
};

export default PagosAsignados;