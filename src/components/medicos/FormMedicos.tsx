import React, { useState } from "react";
import { useForm } from "react-hook-form";
import BtnCancelar from "../botones/BtnCancelar";
import BtnAgregar from "../botones/BtnAgregar";
import toast from "react-hot-toast";
import { medicoService } from "../../services/medicoService";

/** ========= Helper URL =========
 * Usa tu .env:
 * VITE_URL_BACK=https://previmedbackend-q73n.onrender.com/
 * (termina con /)
 */
const BASE = import.meta.env.VITE_URL_BACK || ""; // termina con /
const makeUrl = (path: string) => {
  const base = BASE.endsWith("/") ? BASE : BASE + "/";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return base + clean;
};
/** ============================= */

const ENDPOINT_CREAR_USUARIO_MEDICO = "medicos/usuarioM"; // <--- mantén el endpoint que ya tienes

type FormValues = {
  // Usuario
  nombre: string;
  segundoNombre?: string;
  apellido: string;
  segundoApellido?: string;
  email: string;
  password: string; // min 8
  direccion?: string;
  numeroDocumento: string; // solo números
  tipoDocumento?: string;
  fechaNacimiento: string; // YYYY-MM-DD
  numeroHijos?: string;
  estrato?: string;
  genero?: string;
  estadoCivil?: string;
  autorizacionDatos?: boolean;
  habilitar?: boolean;
  epsId?: number | string;

  // Médico
  disponibilidad: boolean;
  estado: boolean;
};

interface Props {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const MedicoUsuarioForm: React.FC<Props> = ({ onCancel, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ mode: "onChange" });

  const [loading, setLoading] = useState(false);

  const label = "text-gray-700 font-semibold text-sm mb-1 block";
  const input =
    "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const error = "text-red-500 text-xs mt-1";

  /** POST /medicos/usuarioM -> retorna id_usuario (UUID string) */
  const crearUsuarioMedico = async (payload: any): Promise<string> => {
    const url = makeUrl(ENDPOINT_CREAR_USUARIO_MEDICO);
    console.log("POST ->", url);

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      throw new Error(j?.msg || `Error creando usuario médico (HTTP ${r.status})`);
    }
    const id = j?.data?.id_usuario;
    if (!id) throw new Error("Respuesta sin id_usuario");
    // *** IMPORTANTE: NO convertir a Number. Es UUID string. ***
    return String(id);
  };

  /** Crear el médico usando el id_usuario (UUID string) retornado */
  const crearMedico = async (
    usuarioId: string,
    data: Pick<FormValues, "disponibilidad" | "estado">
  ) => {
    const body = {
      usuario_id: usuarioId, // <-- se envía tal cual, string UUID
      disponibilidad: !!data.disponibilidad,
      estado: data.estado === undefined ? true : !!data.estado,
    };
    console.log("[POST /medicos] payload =>", body);
    await medicoService.create(body);
  };

  const onValid = async (data: FormValues) => {
    try {
      setLoading(true);

      // Validaciones rápidas del front
      if (!data.fechaNacimiento) {
        toast.error("La fecha de nacimiento es obligatoria");
        return;
      }
      if (!data.password || data.password.length < 8) {
        toast.error("La contraseña debe tener al menos 8 caracteres");
        return;
      }
      if (!data.numeroDocumento) {
        toast.error("El número de documento es obligatorio");
        return;
      }

      // Armar payload acorde al validador del backend (snake_case)
      const payloadUsuario = {
        nombre: data.nombre?.trim() || undefined,
        segundo_nombre: data.segundoNombre?.trim() || undefined,
        apellido: data.apellido?.trim() || undefined,
        segundo_apellido: data.segundoApellido?.trim() || undefined,
        email: data.email?.trim() || undefined,
        password: data.password,
        numero_documento: data.numeroDocumento,
        direccion: data.direccion?.trim() || undefined,
        habilitar: data.habilitar ?? true,
        autorizacion_datos: data.autorizacionDatos ?? true,
        genero: data.genero || undefined,
        estado_civil: data.estadoCivil || undefined,
        tipo_documento: data.tipoDocumento || undefined,
        eps_id: data.epsId ? Number(data.epsId) : undefined,
        estrato: data.estrato || undefined,
        numero_hijos: data.numeroHijos || undefined,
        fecha_nacimiento: data.fechaNacimiento, // YYYY-MM-DD
      };

      // 1) Crear usuario y obtener UUID string
      const idUsuario = await crearUsuarioMedico(payloadUsuario);

      // 2) Crear médico con ese UUID string
      await crearMedico(idUsuario, {
        disponibilidad: data.disponibilidad,
        estado: data.estado,
      });

      toast.success("Médico creado exitosamente");
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
        autorizacionDatos: true,
        habilitar: true,
        epsId: undefined,
        disponibilidad: true,
        estado: true,
      });
      onSuccess?.();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Error al crear médico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto pr-1 ios-scroll">
      <form onSubmit={handleSubmit(onValid)} className="space-y-6 bg-white rounded-2xl w-full p-2">
        {/* === Datos del Usuario (rol médico) === */}
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
              type="text"
              inputMode="numeric"
              maxLength={12}
              {...register("numeroDocumento", {
                required: "Documento requerido",
                pattern: { value: /^[0-9]{1,12}$/, message: "Solo números, máximo 12 dígitos" },
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "").slice(0, 12);
              }}
              className={input}
            />
            {errors.numeroDocumento && <p className={error}>{errors.numeroDocumento.message}</p>}
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
          <div>
            <label className={label}>Contraseña *</label>
            <input
              type="password"
              {...register("password", {
                required: "Contraseña requerida",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
              })}
              className={input}
            />
            {errors.password && <p className={error}>{errors.password.message}</p>}
          </div>
        </div>

        <div>
          <label className={label}>Dirección</label>
          <input {...register("direccion")} className={input} />
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
            {errors.fechaNacimiento && <p className={error}>{errors.fechaNacimiento.message}</p>}
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
                pattern: { value: /^[0-9]+$/, message: "Solo números enteros positivos" },
                min: { value: 0, message: "Mínimo 0" },
                max: { value: 20, message: "Máximo 20" },
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
              }}
              className={input}
            />
            {errors.numeroHijos && <p className={error}>{errors.numeroHijos.message}</p>}
          </div>
          <div>
            <label className={label}>Estrato</label>
            <input
              type="text"
              inputMode="numeric"
              {...register("estrato", {
                pattern: { value: /^[0-9]+$/, message: "Solo números enteros positivos" },
                min: { value: 1, message: "Mínimo 1" },
                max: { value: 6, message: "Máximo 6" },
              })}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
              }}
              className={input}
            />
            {errors.estrato && <p className={error}>{errors.estrato.message}</p>}
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
            <label className={label}>EPS (opcional)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="ID de EPS"
              {...register("epsId")}
              className={input}
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("autorizacionDatos")} defaultChecked />
            <span>Autorización Datos</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("habilitar")} defaultChecked />
            <span>Habilitado</span>
          </label>
        </div>

        {/* === Datos del Médico === */}
        <div className="pt-4 border-t">
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("disponibilidad")} defaultChecked />
              <span>Disponible</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("estado")} defaultChecked />
              <span>Activo</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <div onClick={onCancel}>
            <BtnCancelar verText />
          </div>
          <button type="submit" disabled={loading}>
            <BtnAgregar verText />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicoUsuarioForm;
