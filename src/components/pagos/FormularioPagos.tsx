import { useForm } from "react-hook-form";
import { PagoInterface, PostPagoInterface } from "../../interfaces/Pagos";
import { ImCancelCircle } from "react-icons/im";
import { MdImageSearch } from "react-icons/md";
import toast from "react-hot-toast";
import {
  FaUser,
  FaCalendarDay,
  FaCalendarPlus,
  FaCalendarCheck,
  FaDollarSign,
  FaCreditCard,
} from "react-icons/fa";
import { HiDocumentCurrencyDollar } from "react-icons/hi2";

type prop = {
  pago?: PagoInterface;
  setForm: (value: boolean) => void;
};

const FormularioPagos: React.FC<prop> = ({ pago, setForm }) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<PostPagoInterface>();

  const fecha = new Date(); //Instancia de la clase Date para manejar fechas
  const fechaHoy = fecha.toLocaleDateString("sv-SE"); //Se consigue la fecha actual

  const actualizarPago = (data: PostPagoInterface) => {
    toast.success("Pago actualizado correctamente");
    console.log(data);
    setForm(false);
  };

  const registrarPago = (data: PostPagoInterface) => {
    fetch("http://localhost:3333/registro-pago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });
    setForm(false)
  };

  const formasPago = [
    { id: 1, nombre: "Efectivo" },
    { id: 2, nombre: "Transferencia Bancaria" },
    { id: 3, nombre: "Nequi" },
    { id: 4, nombre: "Daviplata" },
    { id: 5, nombre: "Tarjeta de Crédito" },
  ];

  const titulares = [
    { id: 1, nombre: "Carlos", apellido: "Ramírez" },
    { id: 2, nombre: "Laura", apellido: "González" },
    { id: 3, nombre: "Mateo", apellido: "Torres" },
    { id: 4, nombre: "Valentina", apellido: "Martínez" },
    { id: 5, nombre: "Andrés", apellido: "Pérez" },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center overflow-y-auto z-50">
        <div className="my-6 bg-white rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl mb-8 font-bold text-gray-700 flex items-center gap-2">
              <HiDocumentCurrencyDollar />
              {pago ? `Actualiza el pago ${pago.idRegistro}` : "Registro de pago"}
            </h2>
            <ImCancelCircle
              title="Cancelar"
              className="w-6 h-auto text-gray-500 hover:text-red-600 transition-all duration-500 cursor-pointer"
              onClick={() => setForm(false)}
            />
          </div>

          <form
            onSubmit={handleSubmit(pago ? actualizarPago : registrarPago)}
            className="space-y-4">

            {/* Imagen */}
            <div>
              <label className="flex items-center  mb-1 font-medium text-gray-600">
                Comprobante (imagen)
                <MdImageSearch className="w-6 h-auto text-blue-900 ml-2" />
              </label>
              {pago?.foto && (
                <div className="my-2">
                  <p className="text-sm text-gray-600 mb-1">Imagen actual:</p>
                  <img
                    src={pago.foto}
                    alt="Comprobante"
                    className="w-full md:w-2/3 lg:w-1/2 h:auto max:h-48 object-content rounded p-4"
                  />
                </div>
              )}

              <input
                type="file"
                {...register("foto")}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-md file:font-semibold file:bg-blue-50 file:hover:file:bg-blue-100 file:text-blue-600 file:cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-24">
              {/* Titular */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaUser className="text-blue-900" /> Titular
                </label>
                <select
                  {...register("membresia_id", {
                    required: "La membresia es obligatoria",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Selecciona el titular --</option>
                  {titulares.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.nombre} {value.apellido}
                    </option>
                  ))}
                </select>
                {errors.membresia_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.membresia_id.message}
                  </p>
                )}
              </div>

              {/* Fecha cobro */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaCalendarDay className="text-blue-900" /> Fecha de cobro
                </label>
                <input
                  type="date"
                  defaultValue={pago ? pago.fechaPago : fechaHoy}
                  {...register("fecha_pago", {
                    required: "La fecha de cobro es obligatoria",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fecha_pago && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fecha_pago.message}
                  </p>
                )}
              </div>

              {/* Fecha inicio */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaCalendarPlus className="text-blue-900" /> Fecha de inicio
                </label>
                <input
                  type="date"
                  max={watch("fecha_fin")}
                  defaultValue={pago ? pago.fechaInicio : ""}
                  {...register("fecha_inicio", {
                    required: "La fecha de inicio es obligatoria",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fecha_inicio && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fecha_inicio.message}
                  </p>
                )}
              </div>

              {/* Fecha fin */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaCalendarCheck className="text-blue-900" /> Fecha de fin
                </label>
                <input
                  type="date"
                  min={watch("fecha_inicio")}
                  defaultValue={pago ? pago.fechaFin : ""}
                  {...register("fecha_fin", {
                    required: "La fecha de finalización es obligatoria",
                    validate: (fechaFin) => {
                      const fechaInicio = getValues("fecha_inicio");
                      return (
                        new Date(fechaFin) >= new Date(fechaInicio) ||
                        "La fecha de fin no puede ser menor que la fecha de inicio"
                      );
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fecha_fin && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fecha_fin.message}
                  </p>
                )}
              </div>

              {/* Forma de pago */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaCreditCard className="text-blue-900" /> Forma de pago
                </label>
                <select
                  {...register("forma_pago_id", {
                    required: "La forma de pago es obligatoria",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Selecciona la forma de pago --</option>
                  {formasPago.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.nombre}
                    </option>
                  ))}
                </select>
                {errors.forma_pago_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.forma_pago_id.message}
                  </p>
                )}
              </div>

              {/* Monto */}
              <div>
                <label className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  <FaDollarSign className="text-blue-900" /> Monto
                </label>
                <input
                  type="number"
                  defaultValue={pago ? pago.monto : ""}
                  {...register("monto", {
                    required: "El monto es obligatorio",
                    minLength: {
                      value: 5,
                      message: "El monto debe ser mayor a 4 dígitos",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.monto && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.monto.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botón */}
            <div className="flex justify-center  pt-4">
              <button
                type="submit"
                className="w-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {pago ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormularioPagos;
