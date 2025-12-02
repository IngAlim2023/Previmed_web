import { useForm } from "react-hook-form";
import { PostSolicitud } from "../../interfaces/Solicitudes";
import { useState } from "react";
import { crearSolicitud } from "../../services/solicitudesServices";
import toast from "react-hot-toast";

type PropsSolicitudes = {};

const FormSolicitudes: React.FC<PropsSolicitudes> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostSolicitud>();

  const [form, setForm] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const enviarSolicitud = async (data: PostSolicitud) => {
    setLoading(true);
    try {
      await crearSolicitud(data);
      toast.success("Solicitud enviada con éxito");
      reset();
      setForm(false);
    } catch (e) {
      toast.error("No se pudo enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const tipos_planes = [
    { id: 1, nombre: "Petición", valor: "Petición" as const },
    { id: 2, nombre: "Queja", valor: "Queja" as const },
    { id: 3, nombre: "Reclamo", valor: "Reclamo" as const },
    { id: 4, nombre: "Consulta", valor: "Consulta" as const },
    { id: 5, nombre: "Sugerencia", valor: "Sugerencia" as const },
    { id: 6, nombre: "Felicitación", valor: "Felicitación" as const },
    { id: 7, nombre: "Registro", valor: "Registro" as const },
    { id: 8, nombre: "Cambio de datos personales", valor: "Cambio de datos personales" as const },
    { id: 9, nombre: "Retiro", valor: "Retiro" as const },
  ];

  return (
    <>
      <form
        onSubmit={handleSubmit(enviarSolicitud)}
        className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Formulario de Solicitud
        </h2>
        <p>
          Sí deseas adquirir nuestros servicios, enviar alguna solicitud, queja o sugerencia, puedes hacerlo,
          llena el siguiente formulario y espera un pronta respuesta.
        </p>
        <div className="flex justify-center items-center">
          <button
            type="button"
            className="w-1/2 bg-blue-600 text-lg text-white rounded-xl cursor-pointer mb-4"
            onClick={() => setForm(!form)}
          >
            {form ? "Ocultar formulario" : "Mostrar formulario"}
          </button>
        </div>

        {form && (
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("apellido", {
                  required: "El apellido es obligatorio",
                })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
              />
              {errors.apellido && (
                <p className="text-red-500 text-sm">
                  {errors.apellido.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo inválido",
                  },
                })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Número de documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                minLength={5}
                maxLength={12}
                {...register("documento", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[0-9]{5,12}$/,
                    message: "5-12 dígitos numéricos",
                  },
                })}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "").slice(0, 12);
                }}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
              />
              {errors.documento && (
                <p className="text-red-500 text-sm">{errors.documento.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                {...register("telefono", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "10 dígitos",
                  },
                })}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "").slice(0, 10);
                }}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm">{errors.telefono.message}</p>
              )}
            </div>

            {/* Tipo de solicitud */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de solicitud <span className="text-red-500">*</span>
              </label>
              <select
                {...register("tipo_solicitud", {
                  required: "Selecciona un tipo de solicitud",
                })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">-- Selecciona --</option>
                {tipos_planes.map((value) => (
                  <option key={value.id} value={value.nombre}>
                    {value.nombre}
                  </option>
                ))}
              </select>
              {errors.tipo_solicitud && (
                <p className="text-red-500 text-sm">
                  {errors.tipo_solicitud.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                {...register("descripcion")}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
                rows={4}
              ></textarea>
            </div>

            {/* Autorización de datos */}
            <div className="flex items-start mb-4">
              <input
                type="checkbox"
                {...register("autorizacion_datos", {
                  required: "Debes autorizar el uso de tus datos",
                })}
                className="w-4 h-4 mt-1 mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                Autorizo el tratamiento de mis datos personales
                <span className="text-red-500"> *</span>
              </label>
            </div>
            {errors.autorizacion_datos && (
              <p className="text-red-500 text-sm">
                {errors.autorizacion_datos.message}
              </p>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default FormSolicitudes;