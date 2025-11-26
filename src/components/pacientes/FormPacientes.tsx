import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputComponent from "../formulario/InputComponent";
import SelectComponent from "../formulario/SelectCompontent";
import ReactSelectComponent, { TypeOptions } from "../formulario/ReactSelectComponent";
import { updatePaciente } from "../../services/pacientes";
import { tiposDocumento } from "../../data/tiposDocumento";
import toast from "react-hot-toast";
import { generos } from "../../data/generos";
import { estadosCiviles } from "../../data/estadosCiviles";
import { epsService } from "../../services/epsService";

interface Props {
  setFormPaciente: (v: boolean) => void;
  paciente: any;
}

const FormPacientes: React.FC<Props> = ({ setFormPaciente, paciente }) => {
  const [eps, setEps] = useState<TypeOptions[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
    paciente: {
      id_paciente: paciente.idPaciente,
      ocupacion: paciente.ocupacion ?? "",
      beneficiario: paciente.beneficiario ?? true,
      activo: paciente.activo ?? false,
      usuario: {
        id_usuario: paciente.usuario.idUsuario,
        nombre: paciente.usuario.nombre ?? "",
        segundo_nombre: paciente.usuario.segundoNombre ?? "",
        apellido: paciente.usuario.apellido ?? "",
        segundo_apellido: paciente.usuario.segundoApellido ?? "",
        tipo_documento: paciente.usuario.tipoDocumento ?? "",
        numero_documento: paciente.usuario.numeroDocumento ?? "",
        fecha_nacimiento: new Date(paciente.usuario.fechaNacimiento).toISOString().split("T")[0] ?? new Date(),
        genero: paciente.usuario.genero ?? "",
        estado_civil: paciente.usuario.estadoCivil ?? "",
        email: paciente.usuario.email ?? "",
        direccion: paciente.usuario.direccion ?? "",
        eps_id: paciente.usuario.epsId ?? null,
        numero_hijos: paciente.usuario.numeroHijos ?? 0,
        estrato: paciente.usuario.estrato ?? null,
      },
    },
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    const getEps = async () => {
      try {
        const res = await epsService.getAll();
        const epsOption = res.map((e) => ({ value: e.idEps, label: e.nombreEps }));
        setEps(epsOption);
      } catch (error) {
        console.error("Error al cargar EPS:", error);
        toast.error("No se pudieron cargar las EPS");
      }
    };
    getEps();
  }, []);

  const handleForm = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await updatePaciente(data);
      if (res.ok) {
        toast.success(res.message || "Paciente actualizado correctamente");
        handleClose();
      } else {
        toast.error(res.message || "Error al actualizar");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar el paciente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setFormPaciente(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(handleForm)(e);
  };

  return (
    <div className="fixed inset-0 bg-black/70 p-4 flex items-start justify-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-xl max-w-6xl my-2">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">
          Edición Paciente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputComponent
            label="Nombre"
            required
            errors={errors?.paciente?.usuario?.nombre}
            {...register("paciente.usuario.nombre", {
              required: "El nombre es requerido",
            })}
            placeholder="Ingrese el nombre"
          />

          <InputComponent
            label="Segundo Nombre"
            {...register("paciente.usuario.segundo_nombre")}
            placeholder="Ingrese el segundo nombre"
          />

          <InputComponent
            label="Apellido"
            required
            errors={errors?.paciente?.usuario?.apellido}
            {...register("paciente.usuario.apellido", {
              required: "El apellido es requerido",
            })}
            placeholder="Ingrese el apellido"
          />

          <InputComponent
            label="Segundo Apellido"
            {...register("paciente.usuario.segundo_apellido")}
            placeholder="Ingrese el segundo apellido"
          />

          <SelectComponent
            label="Tipo de Documento"
            required
            errors={errors?.paciente?.usuario?.tipo_documento}
            {...register("paciente.usuario.tipo_documento", {
              required: "Tipo de documento requerido",
            })}
            options={tiposDocumento}
          />

          <InputComponent
            label="Número de Documento"
            required
            type="number"
            errors={errors?.paciente?.usuario?.numero_documento}
            {...register("paciente.usuario.numero_documento", {
              required: "Número de documento requerido",
            })}
            placeholder="Ingrese el número de documento"
          />

          <InputComponent
            label="Fecha de Nacimiento"
            required
            type="date"
            max={
              new Date(new Date().setDate(new Date().getDate() - 1))
                .toISOString()
                .split("T")[0]
            }
            errors={errors?.paciente?.usuario?.fecha_nacimiento}
            {...register("paciente.usuario.fecha_nacimiento", {
              required: "Fecha de nacimiento requerida",
              validate: (value: string) => {
                const fecha = new Date(value);
                const limite = new Date();
                limite.setDate(limite.getDate() - 1);
                return (
                  fecha <= limite || "La fecha no puede ser posterior a hoy"
                );
              },
            })}
          />

          <SelectComponent
            label="Género"
            {...register("paciente.usuario.genero")}
            options={generos}
          />

          <SelectComponent
            label="Estado Civil"
            {...register("paciente.usuario.estado_civil")}
            options={estadosCiviles}
          />

          <InputComponent
            label="Correo electrónico"
            required
            type="email"
            errors={errors?.paciente?.usuario?.email}
            {...register("paciente.usuario.email", {
              required: "El correo es requerido",
            })}
            placeholder="correo@ejemplo.com"
          />

          <InputComponent
            label="Dirección"
            required
            errors={errors?.paciente?.usuario?.direccion}
            {...register("paciente.usuario.direccion", {
              required: "La dirección es requerida",
            })}
            placeholder="Cra .. # ... - .. , barrio"
          />

          <ReactSelectComponent
            name="paciente.usuario.eps_id"
            control={control}
            label="EPS"
            options={eps}
            placeholder="Selecciona la eps"
            isClearable
          />

          <InputComponent
            label="Número de Hijos"
            type="number"
            {...register("paciente.usuario.numero_hijos")}
            placeholder="0"
            min="0"
          />

          <InputComponent
            label="Ocupación"
            {...register("paciente.ocupacion")}
            placeholder="Ingrese la ocupación"
          />

          <InputComponent
            label="Estrato"
            type="number"
            {...register("paciente.usuario.estrato")}
            placeholder="Estrato"
            min="1"
            max="6"
          />

          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
            <input
              type="checkbox"
              {...register("paciente.activo")}
              className="w-4 h-4 accent-blue-600"
            />
            <span>Habilitar usuario</span>
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
            <input
              type="checkbox"
              {...register("paciente.beneficiario")}
              className="w-4 h-4 accent-blue-600"
            />
            <span>¿Desea hacer uso del servicio?</span>
          </label>

          <div className="flex justify-end gap-2 col-span-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-sm px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPacientes;