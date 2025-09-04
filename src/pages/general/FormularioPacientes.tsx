import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { createPaciente, getTitulares } from "../../services/pacientes";
import toast from "react-hot-toast";
import Select from "react-select";

interface FormData {
  nombre: string;
  segundo_nombre: string;
  apellido: string;
  segundo_apellido: string;
  email: string;
  password: string;
  password2: string;
  direccion: string;
  numero_documento: string;
  fecha_nacimiento: string;
  numero_hijos: number;
  estrato: number;
  autorizacion_datos: boolean;
  habilitar: boolean;
  genero: string;
  estado_civil: string;
  tipo_documento: string;
  eps_id: string;
  rol_id: string;
  direccion_cobro: string;
  ocupacion: string;
  activo: boolean;
  beneficiario: boolean;
  paciente_id: string;
}

const FormularioPacientes: React.FC = () => {
  const { register, handleSubmit, reset, control } = useForm<FormData>();

  const [titulares, setTitulares] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      const tit = await getTitulares();

      setTitulares(tit.data || []);
    };
    load();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (data.password != data.password2) {
      return toast.error("Verifica las contraseñas");
    }
    console.log(data);

    const res = await createPaciente(data);
    if (res.msg === "Error") {
      return toast.error("No se logro crear el paciente");
    }
    if (res.message === "El usuario ya se encuentra registrado") {
      return toast.error("El paciente ya se encuentra registrado");
    }

    return toast.success("Paciente creado");
  };

  //Creacion de la opciones para el titular con react Select
  const optionsTitulares = titulares.map((val) => ({
    value: val.idPaciente,
    label: val.usuario.numeroDocumento,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-6 p-8 bg-white shadow-lg rounded-2xl border border-gray-200"
    >
      {/* Inputs */}
      <input
        {...register("nombre", { required: true })}
        placeholder="Nombre"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("segundo_nombre")}
        placeholder="Segundo Nombre"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("apellido", { required: true })}
        placeholder="Apellido"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("segundo_apellido")}
        placeholder="Segundo Apellido"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("email", { required: true })}
        placeholder="Email"
        type="email"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("password", { required: true })}
        placeholder="Password"
        type="password"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("password2", { required: true })}
        placeholder="Password"
        type="password"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("direccion", { required: true })}
        placeholder="Dirección"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("numero_documento", { required: true })}
        placeholder="Número de documento"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("fecha_nacimiento", { required: true })}
        type="date"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("numero_hijos", { required: true, valueAsNumber: true })}
        placeholder="Número de hijos"
        type="number"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("estrato", { required: true, valueAsNumber: true })}
        placeholder="Estrato"
        type="number"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Selects */}
      <select
        {...register("genero", { required: true })}
        className="border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Seleccione género</option>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
        <option value="otro">Otro</option>
      </select>

      <select
        {...register("estado_civil", { required: true })}
        className="border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Seleccione estado civil</option>
        <option value="Soltero">Soltero</option>
        <option value="Casado">Casado</option>
        <option value="Unión marital">Unión libre</option>
        <option value="Divorciado">Divorciado</option>
        <option value="viudo">Viudo</option>
      </select>

      <select
        {...register("tipo_documento", { required: true })}
        className="border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Seleccione tipo de documento</option>
        <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
        <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
        <option value="Tarjeta de Extranjería">Tarjeta de Extranjería</option>
        <option value="Cédula de Extranjería">Cédula de Extranjería</option>
        <option value="Pasaporte">Pasaporte</option>
        <option value="Documento de Identificación Extranjero (DIE)">
          Documento de Identificación Extranjero (DIE)
        </option>
        <option value="Permiso Especial de Permanencia (PEP)">
          Permiso Especial de Permanencia (PEP)
        </option>
      </select>

      <select
        {...register("eps_id", { required: true })}
        className="border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Seleccione la EPS</option>
        <option value="1">Famisanar</option>
        <option value="2">Compensar</option>
        <option value="3">Aliansalud</option>
        <option value="4">Ecoopsos</option>
      </select>

      <select
        {...register("rol_id", { required: true })}
        className="border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Seleccione el rol</option>
        <option value="4">Paciente</option>
      </select>

      <input
        {...register("direccion_cobro", { required: true })}
        placeholder="Dirección de cobro"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        {...register("ocupacion", { required: true })}
        placeholder="Ocupación"
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <Controller
        name="paciente_id"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <Select
            inputRef={ref}
            options={optionsTitulares}
            placeholder="Seleccione el titular"
            value={optionsTitulares.find((c) => c.value === value)}
            onChange={(val) => onChange(val?.value)}
            isClearable
            classNamePrefix="react-select"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                boxShadow: state.isFocused
                  ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  : "none",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                "&:hover": {
                  borderColor: "#9ca3af",
                },
              }),
            }}
          />
        )}
      />

      {/* Checkboxes */}
      <label className="flex items-center gap-2 text-sm col-span-2">
        <input
          type="checkbox"
          {...register("autorizacion_datos")}
          className="w-4 h-4 accent-blue-600"
        />
        Autorización de datos
      </label>
      <label className="flex items-center gap-2 text-sm col-span-2">
        <input
          type="checkbox"
          {...register("habilitar")}
          className="w-4 h-4 accent-blue-600"
        />
        Habilitar usuario
      </label>
      <label className="flex items-center gap-2 text-sm col-span-2">
        <input
          type="checkbox"
          {...register("activo")}
          className="w-4 h-4 accent-blue-600"
        />
        Activo
      </label>
      <label className="flex items-center gap-2 text-sm col-span-2">
        <input
          type="checkbox"
          {...register("beneficiario")}
          className="w-4 h-4 accent-blue-600"
        />
        Beneficiario
      </label>

      {/* Botones */}
      <div className="col-span-2 flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => reset()}
          className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-md transition"
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
        >
          Enviar
        </button>
      </div>
    </form>
  );
};

export default FormularioPacientes;
