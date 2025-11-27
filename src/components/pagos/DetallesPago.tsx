import { PagoInterface } from "../../interfaces/Pagos";

type PropsDetalles = {
  setDetalles: (value: boolean) => void;
  setPago: (value: PagoInterface | null) => void;
  pago: any;
};

const DetallesPago: React.FC<PropsDetalles> = ({ setDetalles, pago, setPago }) => {
  // ✅ Extraemos los datos del titular
  const { nombre, segundoNombre, apellido, segundoApellido } =
    pago.membresia.membresiaPaciente[0]?.paciente?.usuario || {};

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
        <div className="w-full lg:w-2/3 bg-white shadow-md rounded-2xl overflow-hidden p-6 border border-gray-100">
          {/* 🧾 Imagen o placeholder */}
          <div className="flex flex-col md:flex-row items-center">
            {pago.foto ? (
              <img
                src={pago.foto}
                className="w-full h-80 rounded-md object-contain md:col-auto"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-500 rounded-md border md:col-auto">
                Sin imagen
              </div>
            )}
            <div className="w-full text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Recibo #{pago.idRegistro}
              </h2>
              <p className="text-sm text-gray-500">
                Contrato: #{pago.membresia.numeroContrato}
              </p>
            </div>
          </div>

          {/* 🧩 Información principal */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Titular */}
            <div>
              <p className="text-sm text-gray-500">Titular</p>
              <p className="font-medium text-gray-700">
                {`${nombre ?? ""} ${segundoNombre ?? ""} ${apellido ?? ""} ${
                  segundoApellido ?? ""
                }`}
              </p>
            </div>

            {/* Fecha de pago */}
            <div>
              <p className="text-sm text-gray-500">Fecha de Pago</p>
              <p className="font-medium text-gray-700">
                {new Date(pago.fechaPago).toLocaleDateString()}
              </p>
            </div>

            {/* Periodo */}
            <div>
              <p className="text-sm text-gray-500">Periodo (inicio - fin)</p>
              <p className="font-medium text-gray-700">
                {new Date(pago.fechaInicio).toLocaleDateString()} -{" "}
                {new Date(pago.fechaFin).toLocaleDateString()}
              </p>
            </div>

            {/* Forma de pago */}
            <div>
              <p className="text-sm text-gray-500">Forma de Pago</p>
              <p className="font-medium text-gray-700">
                {pago.formaPago?.tipoPago ?? "Sin especificar"}
              </p>
            </div>

            {/* Monto */}
            <div>
              <p className="text-sm text-gray-500">Monto</p>
              <p className="font-bold text-green-600">${pago.monto}</p>
            </div>

            {/* 🆕 Número de recibo */}
            <div>
              <p className="text-sm text-gray-500">Número de Recibo</p>
              <p className="font-medium text-gray-700">
                {pago.numeroRecibo ?? "N/A"}
              </p>
            </div>

            {/* 🆕 Estado */}
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              <p
                className={`font-semibold ${
                  pago.estado === "Pagado"
                    ? "text-green-600"
                    : pago.estado === "Anulado"
                    ? "text-red-600"
                    : pago.estado === "Asignado"
                    ? "text-blue-600"
                    : "text-yellow-600"
                }`}
              >
                {pago.estado ?? "Sin estado"}
              </p>
            </div>

            {/* 🆕 Cobrador / Asesor */}
            <div>
              <p className="text-sm text-gray-500">Asesor / Cobrador</p>
              <p className="font-medium text-gray-700">
                {pago.cobrador
                  ? `${pago.cobrador.nombre ?? ""} ${pago.cobrador.apellido ?? ""}`
                  : "No asignado"}
              </p>
            </div>
          </div>

          {/* Botón volver */}
          <div className="flex items-center justify-center w-full mt-6">
            <button
              onClick={() => {
                setPago(null);
                setDetalles(false);
              }}
              className="mt-2 bg-blue-600 text-white text-lg rounded-lg px-6 py-2 cursor-pointer hover:bg-blue-700 transition"
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
