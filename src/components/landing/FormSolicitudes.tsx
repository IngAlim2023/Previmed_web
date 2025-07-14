import { useForm } from "react-hook-form";
import { PostSolicitud } from "../../interfaces/Solicitudes";
import { useState } from "react";

type PropsSolicitudes = {};

const FormSolicitudes: React.FC<PropsSolicitudes> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostSolicitud>();

  const enviarSolicitud = (data: PostSolicitud) => {};

  const [form, setForm] = useState<boolean>(false);

  const tipos_planes = [
    {
      id: 1,
      nombre: "Petición",
    },
    {
      id: 2,
      nombre: "Queja",
    },
    {
      id: 3,
      nombre: "Reclamo",
    },
    {
      id: 4,
      nombre: "Sugerencia",
    },
    {
      id: 5,
      nombre: "Registro",
    },
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
            Sí deseas adquirir nuestros servicios, enviar alguna solicitud, queja o sujerencia, puedes hacerlo,
            llena el siguiente formulario y espera un pronta respuesta.  
        </p>
        <div className="flex justify-center items-center">
        <button 
        className="w-1/2 bg-blue-600 text-lg text-white rounded-xl cursor-pointer mb-4"
        onClick={()=>setForm(!form)
        }>{form? 'Ocultar formulario':'Mostrar formulario'}</button>
        </div>

        {/* Primer nombre */}
        {form && <div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Primer nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("primer_nombre", {
              required: "El nombre es obligatorio",
            })}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
          />
          {errors.primer_nombre && (
            <p className="text-red-500 text-sm">
              {errors.primer_nombre.message}
            </p>
          )}
        </div>

        {/* Segundo nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Segundo nombre
          </label>
          <input
            type="text"
            {...register("segundo_nombre")}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* Primer apellido */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Primer apellido <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("primer_apellido", {
              required: "El apellido es obligatorio",
            })}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
          />
          {errors.primer_apellido && (
            <p className="text-red-500 text-sm">
              {errors.primer_apellido.message}
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
            minLength={8}
            maxLength={15}
            {...register("documento", {
              required: "Este campo es obligatorio",
            })}
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
            maxLength={14}
            minLength={10}
            {...register("telefono")}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* Tipo de solicitud */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de solicitud <span className="text-red-500">*</span>
          </label>
          <select
            {...register("id_tipo_solicitud", {
              required: "Selecciona un tipo de solicitud",
            })}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">-- Selecciona --</option>
            {tipos_planes.map((value) => (
              <option key={value.id} value={value.id}>
                {value.nombre}
              </option>
            ))}
          </select>
          {errors.id_tipo_solicitud && (
            <p className="text-red-500 text-sm">
              {errors.id_tipo_solicitud.message}
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
          />
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Enviar solicitud
        </button>
        </div>}
      </form>
    </>
  );
};

export default FormSolicitudes;
