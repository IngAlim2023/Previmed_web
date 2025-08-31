import React from "react";
import { useForm } from "react-hook-form";
import { DataUsuario, UsuarioFormProps } from "../../interfaces/usuario";
import BtnAgregar from "../botones/BtnAgregar";
import BtnEliminar from "../botones/BtnEliminar";

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataUsuario>({
    defaultValues: initialData || {
      idUsuario: "",
      nombre: "",
      segundoNombre: "",
      apellido: "",
      segundoApellido: "",
      email: "",
      password: "",
      direccion: "",
      numeroDocumento: "",
      fechaNacimiento: "",
      numeroHijos: "",
      estrato: "",
      autorizacionDatos: false,
      habilitar: true,
      genero: "Masculino",
      estadoCivil: "Soltero",
      tipoDocumento: "Cédula de Ciudadanía",
      epsId: 1,
      rolId: 1,
    },
  });

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Usuario
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Nombre *</label>
            <input
              {...register("nombre", { required: "Nombre requerido" })}
              className="input"
              placeholder="Ej. Juan"
            />
            {errors.nombre && <p className="error">{errors.nombre.message}</p>}
          </div>
          <div>
            <label className="label">Segundo Nombre</label>
            <input {...register("segundoNombre")} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Apellido *</label>
            <input
              {...register("apellido", { required: "Apellido requerido" })}
              className="input"
            />
            {errors.apellido && (
              <p className="error">{errors.apellido.message}</p>
            )}
          </div>
          <div>
            <label className="label">Segundo Apellido</label>
            <input {...register("segundoApellido")} className="input" />
          </div>
        </div>

        {/* Documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Número Documento *</label>
            <input
              {...register("numeroDocumento", {
                required: "Documento requerido",
              })}
              className="input"
            />
            {errors.numeroDocumento && (
              <p className="error">{errors.numeroDocumento.message}</p>
            )}
          </div>
          <div>
            <label className="label">Tipo Documento</label>
            <select {...register("tipoDocumento")} className="input">
              <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
              <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
        </div>

        {/* Email y Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              {...register("email", { required: "Email requerido" })}
              className="input"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Contraseña *</label>
            <input
              type="password"
              {...register("password", { required: "Contraseña requerida" })}
              className="input"
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="label">Dirección</label>
          <input {...register("direccion")} className="input" />
        </div>

        {/* Fecha nacimiento y Estado Civil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Fecha Nacimiento</label>
            <input type="date" {...register("fechaNacimiento")} className="input" />
          </div>
          <div>
            <label className="label">Estado Civil</label>
            <select {...register("estadoCivil")} className="input">
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viudo">Viudo</option>
              <option value="Unión marital">Unión marital</option>
            </select>
          </div>
        </div>

        {/* Hijos y Estrato */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Número Hijos</label>
            <input type="number" {...register("numeroHijos")} className="input" />
          </div>
          <div>
            <label className="label">Estrato</label>
            <input type="number" {...register("estrato")} className="input" />
          </div>
        </div>

        {/* Género y EPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Género</label>
            <select {...register("genero")} className="input">
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="label">EPS (ID)</label>
            <input type="number" {...register("epsId")} className="input" />
          </div>
        </div>

        {/* Rol */}
        <div>
          <label className="label">Rol (ID)</label>
          <input type="number" {...register("rolId")} className="input" />
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("autorizacionDatos")} />
            <span>Autorización Datos</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("habilitar")} />
            <span>Habilitado</span>
          </label>
        </div>

        {/* Botones personalizados */}
        <div className="flex justify-end gap-4 mt-6">
          <div onClick={onCancel}>
            <BtnEliminar text="Cancelar" />
          </div>
          <div>
            <button type="submit">
              <BtnAgregar text="Guardar" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;

// Helpers Tailwind (opcional si quieres centralizar estilos)
const label = "text-gray-700 font-semibold text-sm mb-1 block";
const input =
  "w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500";
const error = "text-red-500 text-xs mt-1";
