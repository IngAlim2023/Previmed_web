import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataUsuario, UsuarioFormProps } from "../../interfaces/usuario";
import BtnAgregar from "../botones/BtnAgregar";
import {epsService} from '../../services/epsService';
import { getRoles } from "../../services/roles";
import { Eps } from "../../interfaces/eps";
import { Rol } from "../../interfaces/roles";
import BtnCancelar from "../botones/BtnCancelar";
import BtnEditar from "../botones/BtnEditar";

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

  const [roles, setRoles] = useState<Rol[]>([]);
  const [eps, setEps] = useState<Eps[]>([]);

  const getData = async() => {
    const resRol = await getRoles();
    const resEps =await epsService.getAll();

    setEps(resEps);
    setRoles(resRol);
  }

  useEffect(()=>{
    getData()
  }, [])

  // Helpers Tailwind (opcional si quieres centralizar estilos)
  const label = "text-gray-700 font-semibold text-sm mb-1 block";
  const input = "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const error = "text-red-500 text-xs mt-1";


  return (
    <div className="bg-white rounded-2xl w-full max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Nombre *</label>
            <input
              {...register("nombre", { required: "Nombre requerido" })}
              className={input}
              placeholder="....."
            />
            {errors.nombre && <p className={error}>{errors.nombre.message}</p>}
          </div>
          <div>
            <label className={label}>Segundo Nombre</label>
            <input {...register("segundoNombre")} className={input} placeholder="....."/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Apellido *</label>
            <input
              {...register("apellido", { required: "Apellido requerido" })}
              className={input}
              placeholder="....."
            />
            {errors.apellido && (
              <p className={error}>{errors.apellido.message}</p>
            )}
          </div>
          <div>
            <label className={label}>Segundo Apellido</label>
            <input {...register("segundoApellido")} className={input} placeholder="....."/>
          </div>
        </div>

        {/* Documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Número Documento *</label>
            <input
              {...register("numeroDocumento", {
                required: "Documento requerido",
              })}
              className={input}
              placeholder="....."
            />
            {errors.numeroDocumento && (
              <p className={error}>{errors.numeroDocumento.message}</p>
            )}
          </div>
          <div>
            <label className={label}>Tipo Documento</label>
            <select {...register("tipoDocumento")} className={input}>
              <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
              <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
        </div>

        {/* Email y Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Email *</label>
            <input
              type="email"
              {...register("email", { required: "Email requerido" })}
              className={input}
              placeholder="....."
            />
            {errors.email && <p className={error}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={label}>Contraseña *</label>
            <input
              type="password"
              {...register("password", { required: "Contraseña requerida" })}
              className={input}
              placeholder="*******"
            />
            {errors.password && (
              <p className={error}>{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className={label}>Dirección</label>
          <input {...register("direccion", {required : "Dirección requerida"})} className={input} placeholder="....."/>
            {errors.direccion && (
              <p className={error}>{errors.direccion.message}</p>
            )}
        </div>

        {/* Fecha nacimiento y Estado Civil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Fecha Nacimiento</label>
            <input type="date" {...register("fechaNacimiento", {required: "Fecha de nacimiento requerida"})} className={input} />
            {errors.fechaNacimiento && (
              <p className={error}>{errors.fechaNacimiento.message}</p>
            )}
          </div>
          <div>
            <label className={label}>Estado Civil</label>
            <select {...register("estadoCivil")} className={input}>
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
            <label className={label}>Número Hijos</label>
            <input type="number" {...register("numeroHijos")} className={input} />
          </div>
          <div>
            <label className={label}>Estrato</label>
            <input type="number" max={6} min={1} {...register("estrato")} className={input} />
          </div>
        </div>

        {/* Género y EPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Género</label>
            <select {...register("genero")} className={input}>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className={label}>EPS (ID)</label>
            <select {...register("epsId")} className={input}>
              {eps
                .filter(e => e.estado)
                .map(e => (
                  <option key={e.idEps} value={e.idEps}>
                    {e.nombreEps}
                  </option>
                ))
              }
            </select>
          </div>
        </div>

        {/* Rol */}
        <div>
          <label className={label}>Rol</label>
          <select {...register("rolId")} className={input}>
            {
              roles.map((r)=>(
                <option value={r.id_rol}>{r.nombre_rol}</option>
              ))
            }
          </select>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("autorizacionDatos", {required: "La autorización de los datos es requerida"})} />
            <span>Autorización Datos</span>
            {errors.autorizacionDatos && (
              <p className={error}>{errors.autorizacionDatos.message}</p>
            )}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("habilitar")} />
            <span>Habilitado</span>
          </label>
        </div>

        {/* Botones personalizados */}
        <div className="flex justify-end gap-4 mt-6">
          <div onClick={onCancel}>
            <BtnCancelar verText={true} />
          </div>
          <div>
            <button type="submit">
              {initialData? <BtnEditar verText={true}/> : <BtnAgregar verText={true}/>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;