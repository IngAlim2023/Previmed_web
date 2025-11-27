import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { crearSolicitud } from "../../services/solicitudesServices";
import { PostSolicitud } from "../../interfaces/Solicitudes";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const tipos = [
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

const SolicitudesVisitaPaciente: React.FC = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostSolicitud>({
    defaultValues: {
      nombre: user?.nombre || "",
      apellido: "",
      email: "",
      documento: user?.documento || "",
      idUsuario: user?.id || "",
    },
  });

  const onSubmit = async (data: PostSolicitud) => {
    setLoading(true);
    try {
      // Solo incluir id_usuario si el usuario está autenticado
      const dataToSend = { ...data };
      if (!user?.id) {
        delete dataToSend.idUsuario;
      }
      console.log("Payload siendo enviado:", dataToSend);
      await crearSolicitud(dataToSend);
      toast.success("Solicitud enviada con éxito");
      reset();
    } catch (e) {
      console.error("Error:", e);
      toast.error("No se pudo enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const label = "block text-sm font-medium text-gray-700";
  const input = "w-full mt-1 px-3 py-2 border border-gray-300 rounded";
  const error = "text-red-500 text-sm mt-1";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-700">Enviar solicitud</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={label}>Nombre *</label>
          <input
            {...register("nombre", { required: "Requerido" })}
            className={input}
          />
          {errors.nombre && <p className={error}>{errors.nombre.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className={label}>Apellido *</label>
          <input
            {...register("apellido", { required: "Requerido" })}
            className={input}
          />
          {errors.apellido && <p className={error}>{errors.apellido.message}</p>}
        </div>

        <div>
          <label className={label}>Email *</label>
          <input
            type="email"
            {...register("email", {
              required: "Requerido",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
            })}
            className={input}
          />
          {errors.email && <p className={error}>{errors.email.message}</p>}
        </div>

        <div>
          <label className={label}>Documento *</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            {...register("documento", {
              required: "Requerido",
              pattern: { value: /^[0-9]{5,12}$/, message: "5-12 dígitos numéricos" },
            })}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "").slice(0, 12);
            }}
            className={input}
          />
          {errors.documento && <p className={error}>{errors.documento.message}</p>}
        </div>

        <div>
          <label className={label}>Teléfono</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            {...register("telefono", {
              pattern: { value: /^[0-9]{10}$/, message: "10 dígitos" },
            })}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "").slice(0, 10);
            }}
            className={input}
          />
          {errors.telefono && <p className={error}>{errors.telefono.message}</p>}
        </div>

        <div>
          <label className={label}>Tipo de solicitud *</label>
          <select
            {...register("tipo_solicitud", { required: "Seleccione un tipo" })}
            className={input}
          >
            <option value="">-- Seleccione --</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.valor}>
                {t.nombre}
              </option>
            ))}
          </select>
          {errors.tipo_solicitud && <p className={error}>{errors.tipo_solicitud.message}</p>}
        </div>
      </div>

      <div>
        <label className={label}>Descripción</label>
        <textarea {...register("descripcion")} className={input} rows={4} />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          {...register("autorizacion_datos", { required: "Debe autorizar el uso de sus datos" })}
          className="mt-1 mr-2"
        />
        <label className="text-sm text-gray-700">
          Autorizo el tratamiento de mis datos personales <span className="text-red-500">*</span>
        </label>
      </div>
      {errors.autorizacion_datos && <p className={error}>{errors.autorizacion_datos.message}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>
    </form>
  );
};

export default SolicitudesVisitaPaciente;