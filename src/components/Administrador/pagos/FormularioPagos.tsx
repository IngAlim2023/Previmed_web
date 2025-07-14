import { useForm } from "react-hook-form";
import { PagoInterface, PostPagoInterface } from "../../../interfaces/Pagos";
import { ImCancelCircle } from "react-icons/im";
import { MdImageSearch } from "react-icons/md";
import toast from "react-hot-toast";

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

  const registrarPago = (data: PostPagoInterface) => {
    toast.success("Pago agregado correctamente");
    console.log(data);
    setForm(false);
  };

  const actualizarPago = (data: PostPagoInterface | PagoInterface) => {
    toast.success("Pago actualizado correctamente");
    console.log(data);
    setForm(false);
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
      <div className="fixed inset-0 bg-black/80 flex justify-center items-start overflow-y-auto z-50">
        <div className="my-6 bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-700">
              {pago
                ? `Actualiza el pago ${pago.noRecibo}`
                : "Formulario de registro"}
            </h2>
            <ImCancelCircle
              title="Cancelar"
              className="w-6 h-auto text-gray-500 hover:text-red-600 transition-all duration-500 cursor-pointer tran"
              onClick={() => setForm(false)}
            />
          </div>

          <form
            onSubmit={handleSubmit(pago ? actualizarPago : registrarPago)}
            className="space-y-4"
          >
            {/* Imagen */}
            <div>
              <label className="flex items-center  mb-1 font-medium text-gray-600">
                Comprobante (imagen)
                <MdImageSearch className="w-6 h-auto text-gray-600 ml-2" />
              </label>
              {pago?.imagen && (
                <div className="my-2">
                  <p className="text-sm text-gray-600 mb-1">Imagen actual:</p>
                  <img
                    src={pago.imagen}
                    alt="Comprobante"
                    className="w-full md:w-2/3 lg:w-1/2 h:auto max:h-48 object-content rounded p-4"
                  />
                </div>
              )}

              <input
                type="file"
                {...register("imagen")}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-md file:font-semibold file:bg-blue-50 file:hover:file:bg-blue-100 file:text-blue-600 file:cursor-pointer"
              />
            </div>

            {/* Titular */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Titular
              </label>
              <select
                {...register("titular", {
                  required: "El titular es obligatorio",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">-- Selecciona el titular --</option>
                {titulares.map((value) => (
                  <option key={value.id} value={value.id}>
                    {value.nombre} {value.apellido}
                  </option>
                ))}
              </select>
              {errors.titular && (
                <p className="text-red-500 text-sm">{errors.titular.message}</p>
              )}
            </div>

            {/* Fecha cobro */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Fecha de cobro
              </label>
              {/* El defaultValue es momentaneo */}
              <input
                type="date"
                defaultValue={pago ? pago.fechaCobro : fechaHoy}
                {...register("fechaCobro", {
                  required: "La fecha de cobro es obligatoria",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.fechaCobro && (
                <p className="text-red-500 text-sm">
                  {errors.fechaCobro.message}
                </p>
              )}
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Fecha de inicio
              </label>
              {/* El defaultValue es momentaneo */}
              <input
                type="date"
                max={watch('fechaFin')}
                defaultValue={pago ? pago.fechaInicio : ""}
                {...register("fechaInicio", {
                  required: "La fecha de inicio es obligatoria",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.fechaInicio && (
                <p className="text-red-500 text-sm">
                  {errors.fechaInicio.message}
                </p>
              )}
            </div>

            {/* Fecha fin */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Fecha de fin
              </label>
              {/* El defaultValue es momentaneo */}
              <input
                type="date"
                min={watch('fechaInicio')}
                defaultValue={pago ? pago.fechaFin : ""}
                {...register("fechaFin", {
                  required: "La fecha de finalización es obligatoria",
                  validate: (fechaFin) => {
                    const fechaInicio = getValues("fechaInicio");
                    return (
                      new Date(fechaFin) >= new Date(fechaInicio) ||
                      "La fecha de fin no puede ser menor que la fecha de inicio"
                    );
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.fechaFin && (
                <p className="text-red-500 text-sm">
                  {errors.fechaFin.message}
                </p>
              )}
            </div>

            {/* Forma de pago */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Forma de pago
              </label>
              <select
                {...register("formaPago", {
                  required: "La forma de pago es obligatoria",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">-- Selecciona la forma de pago --</option>
                {formasPago.map((value) => (
                  <option key={value.id} value={value.id}>
                    {value.nombre}
                  </option>
                ))}
              </select>
              {errors.formaPago && (
                <p className="text-red-500 text-sm">
                  {errors.formaPago.message}
                </p>
              )}
            </div>

            {/* Monto */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Monto
              </label>
              <input
                defaultValue={pago ? pago.monto : ""}
                type="number"
                {...register("monto", {
                  required: "El monto es obligatorio",
                  minLength: {
                    value: 5,
                    message: "El monto debe ser mayor a de 4 digitos",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.monto && (
                <p className="text-red-500 text-sm">{errors.monto.message}</p>
              )}
            </div>

            {/* Botón */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
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
