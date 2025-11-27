import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataUsuario, UsuarioFormProps } from "../../interfaces/usuario";
import BtnCancelar from "../botones/BtnCancelar";
import { epsService } from "../../services/epsService";
import { Eps } from "../../interfaces/eps";
import toast from "react-hot-toast";
import BtnAgregar from "../botones/BtnAgregar";

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<DataUsuario>({
    mode: "onChange",
  });

  const [eps, setEps] = useState<Eps[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar roles y EPS una sola vez
  useEffect(() => {
    const fetchData = async () => {
      try {
        const epsData = await epsService.getAll();
        setEps(epsData.filter((x: Eps) => x.estado));
      } catch (error) {
        toast.error("Error al cargar datos del formulario");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (eps.length > 0) {
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
          fechaNacimiento: new Date(initialData.fechaNacimiento).toISOString().split("T")[0] || new Date(),
          numeroHijos: initialData.numeroHijos || "",
          estrato: initialData.estrato || "",
          genero: initialData.genero || "Masculino",
          estadoCivil: initialData.estadoCivil || "Soltero",
          autorizacionDatos: initialData.autorizacionDatos || false,
          habilitar: initialData.habilitar !== false,
          epsId: Number(epsIdToSet) || 1,
          rolId: Number(rolIdToSet) || 2,
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
          fechaNacimiento: new Date(),
          numeroHijos: "",
          estrato: "",
          genero: "Masculino",
          estadoCivil: "Soltero",
          autorizacionDatos: false,
          habilitar: true,
          epsId: 1,
          rolId: 2,
        });
      }
    }
  }, [initialData, eps, reset, isEditing]);

  const onValid = (data: DataUsuario) => {
    // Prevenir envío si hay errores
    if (!isValid || Object.keys(errors).length > 0) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

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

    if (!isEditing && data.password) {
      payload.password = data.password;
    } else if (isEditing && data.password) {
      payload.password = data.password;
    }

    try {
      onSubmit(payload);
      toast.success("Usuario creado correctamente");
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Permitir Enter solo en el botón submit, no en inputs
    if (e.key === "Enter" && e.currentTarget.tagName !== "BUTTON") {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white rounded-2xl w-full">
      <form
        onSubmit={handleSubmit(onValid)}
        onKeyDown={handleKeyDown}
        className="space-y-6"
      >
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
            {errors.apellido && (
              <p className={error}>{errors.apellido.message}</p>
            )}
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
              type="text"
              inputMode="numeric"
              maxLength={12}
              {...register("numeroDocumento", {
                required: "Documento requerido",
                pattern: {
                  value: /^[0-9]{1,12}$/,
                  message: "Solo números, máximo 12 dígitos",
                },
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 12);
              }}
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
                validate: (value) => {
                  const hoy = new Date();
                  const fecha = new Date(value);
                  return fecha <= hoy || "No puede ser una fecha futura";
                },
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
            <label className={label}>Número de Hijos</label>
            <input
              type="text"
              inputMode="numeric"
              {...register("numeroHijos", {
                required: false,
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo números enteros positivos",
                },
                min: { value: 0, message: "Mínimo 0" },
                max: { value: 20, message: "Máximo 20" },
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
              className={input}
            />
            {errors.numeroHijos && (
              <p className={error}>{errors.numeroHijos.message}</p>
            )}
          </div>
          <div>
            <label className={label}>Estrato</label>
            <input
              type="text"
              inputMode="numeric"
              {...register("estrato", {
                required: false,
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo números enteros positivos",
                },
                min: { value: 1, message: "Mínimo 1" },
                max: { value: 6, message: "Máximo 6" },
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
              className={input}
            />
            {errors.estrato && (
              <p className={error}>{errors.estrato.message}</p>
            )}
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
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("autorizacionDatos", {
                required: "Debes autorizar el tratamiento de datos",
              })}
            />
            <span>Autorización Datos *</span>
          </label>

          {errors.autorizacionDatos && (
            <p className={error}>{errors.autorizacionDatos.message}</p>
          )}

          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" {...register("habilitar")} />
            <span>Habilitado</span>
          </label>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <div onClick={onCancel}>
            <BtnCancelar verText />
          </div>
          <button type="submit" disabled={loading || !isValid}>
            <BtnAgregar verText />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;