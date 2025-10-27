import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataUsuario, UsuarioFormProps } from "../../interfaces/usuario";
import BtnCancelar from "../botones/BtnCancelar";
import { epsService } from "../../services/epsService";
import { getRoles } from "../../services/roles";
import { Eps } from "../../interfaces/eps";
import { Rol } from "../../interfaces/roles";
import toast from "react-hot-toast";
import BtnActualizar from "../botones/BtnActualizar";

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DataUsuario>({
    mode: "onChange",
  });

  const [roles, setRoles] = useState<Rol[]>([]);
  const [eps, setEps] = useState<Eps[]>([]);
  const [loading, setLoading] = useState(false);

  // Vigilar cambios en los selects
  const selectedEpsId = watch("epsId");
  const selectedRolId = watch("rolId");

  // Cargar roles y EPS una sola vez
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, epsData] = await Promise.all([
          getRoles(),
          epsService.getAll(),
        ]);
        setRoles(rolesData);
        setEps(epsData.filter((x: Eps) => x.estado));
      } catch (error) {
        toast.error("Error al cargar datos del formulario");
      }
    };
    fetchData();
  }, []);

  // Resetear formulario cuando cambien initialData, roles o eps
  useEffect(() => {
    if (roles.length > 0 && eps.length > 0) {
      if (initialData) {
        const epsIdToSet = initialData.epsId || initialData.eps?.idEps;
        const rolIdToSet = initialData.rolId || initialData.rol?.idRol;

        reset({
          nombre: initialData.nombre || "",
          segundoNombre: initialData.segundoNombre || "",
          apellido: initialData.apellido || "",
          segundoApellido: initialData.segundoApellido || "",
          email: initialData.email || "",
          password: "",
          direccion: initialData.direccion || "",
          numeroDocumento: initialData.numeroDocumento || "",
          tipoDocumento: initialData.tipoDocumento || "Cédula de Ciudadanía",
          fechaNacimiento: initialData.fechaNacimiento || "",
          numeroHijos: initialData.numeroHijos || "",
          estrato: initialData.estrato || "",
          genero: initialData.genero || "Masculino",
          estadoCivil: initialData.estadoCivil || "Soltero",
          autorizacionDatos: initialData.autorizacionDatos || false,
          habilitar: initialData.habilitar !== false,
          epsId: Number(epsIdToSet) || 1,
          rolId: Number(rolIdToSet) || 1,
        });
      } else {
        reset({
          nombre: "",
          segundoNombre: "",
          apellido: "",
          segundoApellido: "",
          email: "",
          password: "",
          direccion: "",
          numeroDocumento: "",
          tipoDocumento: "Cédula de Ciudadanía",
          fechaNacimiento: "",
          numeroHijos: "",
          estrato: "",
          genero: "Masculino",
          estadoCivil: "Soltero",
          autorizacionDatos: false,
          habilitar: true,
          epsId: 1,
          rolId: 1,
        });
      }
    }
  }, [initialData, roles, eps, reset, isEditing]);

  const onValid = (data: DataUsuario) => {
    setLoading(true);

    const payload: Partial<DataUsuario> = {
      nombre: data.nombre,
      segundoNombre: data.segundoNombre,
      apellido: data.apellido,
      segundoApellido: data.segundoApellido,
      email: data.email,
      direccion: data.direccion,
      numeroDocumento: data.numeroDocumento,
      tipoDocumento: data.tipoDocumento,
      fechaNacimiento: data.fechaNacimiento,
      numeroHijos: data.numeroHijos,
      estrato: data.estrato,
      genero: data.genero,
      estadoCivil: data.estadoCivil,
      autorizacionDatos: data.autorizacionDatos,
      habilitar: data.habilitar,
      epsId: Number(data.epsId),
      rolId: Number(data.rolId),
    };

    // Solo agregar password si:
    // 1. Es creación y hay password, O
    // 2. Es edición y el usuario escribió un password nuevo
    if (!isEditing && data.password) {
      payload.password = data.password;
    } else if (isEditing && data.password) {
      payload.password = data.password;
    }

    try {
      onSubmit(payload);
    } catch (error) {
      toast.error("Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  const label = "text-gray-700 font-semibold text-sm mb-1 block";
  const input =
    "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const error = "text-red-500 text-xs mt-1";

  return (
    <div className="bg-white rounded-2xl w-full">
      <form onSubmit={handleSubmit(onValid)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Nombre *</label>
            <input
              {...register("nombre", { required: "Nombre requerido" })}
              className={input}
            />
            {errors.nombre && <p className={error}>{errors.nombre.message}</p>}
          </div>
          <div>
            <label className={label}>Segundo Nombre</label>
            <input {...register("segundoNombre")} className={input} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Apellido *</label>
            <input
              {...register("apellido", { required: "Apellido requerido" })}
              className={input}
            />
            {errors.apellido && <p className={error}>{errors.apellido.message}</p>}
          </div>
          <div>
            <label className={label}>Segundo Apellido</label>
            <input {...register("segundoApellido")} className={input} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Número Documento *</label>
            <input
              type="number"
              {...register("numeroDocumento", {
                required: "Documento requerido",
              })}
              className={input}
            />
            {errors.numeroDocumento && (
              <p className={error}>{errors.numeroDocumento.message}</p>
            )}
          </div>
          <div>
            <label className={label}>Tipo Documento</label>
            <select {...register("tipoDocumento")} className={input}>
              <option>Registro Civil</option>
              <option>Tarjeta de Identidad</option>
              <option>Cédula de Ciudadanía</option>
              <option>Tarjeta de Extranjería</option>
              <option>Cédula de Extranjería</option>
              <option>Pasaporte</option>
              <option>Documento de Identificación Extranjero (DIE)</option>
              <option>Permiso Especial de Permanencia (PEP)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Email *</label>
            <input
              type="email"
              {...register("email", { required: "Email requerido" })}
              className={input}
            />
            {errors.email && <p className={error}>{errors.email.message}</p>}
          </div>
          {!isEditing && (
            <div>
              <label className={label}>Contraseña *</label>
              <input
                type="password"
                {...register("password", {
                  required: "Contraseña requerida",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                })}
                className={input}
              />
              {errors.password && (
                <p className={error}>{errors.password.message}</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className={label}>Dirección *</label>
          <input
            {...register("direccion", { required: "Dirección requerida" })}
            className={input}
          />
          {errors.direccion && (
            <p className={error}>{errors.direccion.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Fecha Nacimiento *</label>
            <input
              type="date"
              {...register("fechaNacimiento", {
                required: "Fecha requerida",
              })}
              className={input}
            />
            {errors.fechaNacimiento && (
              <p className={error}>{errors.fechaNacimiento.message}</p>
            )}
          </div>
          <div>
            <label className={label}>Estado Civil</label>
            <select {...register("estadoCivil")} className={input}>
              <option>Soltero</option>
              <option>Casado</option>
              <option>Divorciado</option>
              <option>Viudo</option>
              <option>Unión marital</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Número Hijos</label>
            <input type="number" {...register("numeroHijos")} className={input} />
          </div>
          <div>
            <label className={label}>Estrato</label>
            <input
              type="number"
              min={1}
              max={6}
              {...register("estrato")}
              className={input}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Género</label>
            <select {...register("genero")} className={input}>
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label className={label}>EPS</label>
            <select {...register("epsId")} className={input}>
              <option value="">-- Seleccionar EPS --</option>
              {eps.length > 0 ? (
                eps.map((e) => (
                  <option key={e.idEps} value={e.idEps}>
                    {e.nombreEps}
                  </option>
                ))
              ) : (
                <option disabled>Cargando EPS...</option>
              )}
            </select>
            {selectedEpsId && (
              <small className="text-gray-500">ID: {selectedEpsId}</small>
            )}
          </div>
        </div>

        <div>
          <label className={label}>Rol</label>
          <select {...register("rolId")} className={input}>
            <option value="">-- Seleccionar Rol --</option>
            {roles.length > 0 ? (
              roles.map((r) => (
                <option key={r.id_rol} value={r.id_rol}>
                  {r.nombre_rol}
                </option>
              ))
            ) : (
              <option disabled>Cargando Roles...</option>
            )}
          </select>
          {selectedRolId && (
            <small className="text-gray-500">ID: {selectedRolId}</small>
          )}
        </div>

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

        <div className="flex justify-end gap-4 mt-6">
          <div onClick={onCancel}>
            <BtnCancelar verText />
          </div>
          <button type="submit" disabled={loading}>
            <BtnActualizar verText />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;