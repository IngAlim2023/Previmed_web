import { PagoInterface } from "../../interfaces/Pagos";

type PropsDetalles = {
  setDetalles: (value: boolean) => void;
  pago: PagoInterface;
};

const DetallesPago: React.FC<PropsDetalles> = ({ setDetalles, pago }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="w-2/3 lg:w-1/2 bg-white shadow-md rounded-2xl overflow-hidden p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {pago.imagen ? (
              <img
                src={pago.imagen}
                alt={`Recibo ${pago.noRecibo}`}
                className="w-full h-52 rounded-md object-contain md:col-auto"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-500 rounded-md border md:col-auto">
                Sin imagen
              </div>
            )}
            <div className="w-full text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Recibo #{pago.noRecibo}
              </h2>
              <p className="text-sm text-gray-500">
                Contrato: #{pago.noContrato}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Titular</p>
              <p className="font-medium text-gray-700">{pago.titular}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cobrador</p>
              <p className="font-medium text-gray-700">{pago.cobrador}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Cobro</p>
              <p className="font-medium text-gray-700">
                {new Date(pago.fechaCobro).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Periodo (inicio - fin)</p>
              <p className="font-medium text-gray-700">
                {new Date(pago.fechaInicio).toLocaleDateString()} -{" "}
                {new Date(pago.fechaFin).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Forma de Pago</p>
              <p className="font-medium text-gray-700">{pago.formaPago}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monto</p>
              <p className="font-bold text-green-600">${pago.monto}</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full mt-4">
            <button
              onClick={() => setDetalles(false)}
              className="mt-4 bg-blue-600 text-white text-xl rounded-lg px-4 py-1 cursor-pointer"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetallesPago;
