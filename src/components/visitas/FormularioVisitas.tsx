import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Visita } from "../../interfaces/visitas"
import { createVisita, updateVisita } from "../../services/visitasService"
import { readPacientes } from "../../services/pacientes"
import { medicoService } from "../../services/medicoService"
import { getBarrios } from "../../services/barrios"

// botones personalizados
import BtnAgregar from "../botones/BtnAgregar"
import BtnActualizar from "../botones/BtnActualizar"
import BtnCancelar from "../botones/BtnCancelar"
import ReactSelectComponent from "../formulario/ReactSelectComponent"

type Props = {
  visita?: Visita | null
  setForm: (value: boolean) => void
  onSuccess: () => void
}

type VisitaFormValues = {
  fecha_visita: string
  descripcion: string
  direccion: string
  estado: string
  telefono: string
  paciente_id: number | null
  medico_id: number | null
  barrio_id: number | null
}

// ✅ función para convertir fecha ISO a yyyy-mm-dd
const formatDate = (dateString: string) => {
  if (!dateString) return ""
  return new Date(dateString).toISOString().split("T")[0]
}

const FormularioVisitas: React.FC<Props> = ({ visita, setForm, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<VisitaFormValues>({
    defaultValues: {
      fecha_visita: new Date().toISOString().split("T")[0], // fecha actual
      descripcion: "",
      direccion: "",
      estado: "true",
      telefono: "",
      paciente_id: null,
      medico_id: null,
      barrio_id: null,
    },
  })

  const [pacientes, setPacientes] = useState<any[]>([])
  const [medicos, setMedicos] = useState<any[]>([])
  const [barrios, setBarrios] = useState<any[]>([])

  useEffect(() => {
    if (visita) {
      reset({
        fecha_visita: formatDate(visita.fecha_visita),
        descripcion: visita.descripcion,
        direccion: visita.direccion,
        estado: visita.estado ? "true" : "false",
        telefono: visita.telefono,
        paciente_id: visita.paciente_id ?? 0,
        medico_id: visita.medico_id ?? 0,
        barrio_id: visita.barrio_id ?? 0,
      })

    }
  }, [visita, reset])

  // cargar datos externos
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await readPacientes()
        setPacientes(res.data || [])
      } catch (error) {
        toast.error("No se pudieron cargar los pacientes")
      }
    }

    const fetchMedicos = async () => {
      try {
        const res = await medicoService.getAll()
        setMedicos(res.data || [])
      } catch (error) {
        toast.error("No se pudieron cargar los médicos")
      }
    }

    const fetchBarrios = async () => {
      try {
        const res = await getBarrios()
        setBarrios(res || [])
      } catch (error) {
        toast.error("No se pudieron cargar los barrios")
      }
    }

    fetchPacientes()
    fetchMedicos()
    fetchBarrios()
  }, [])

  const onSubmit = async (data: VisitaFormValues) => {
  toast.success("Visita Agregada Correctamente");
  setForm(false);

  try {
    const payload: Visita = {
      id_visita: visita ? visita.id_visita : 0,
      fecha_visita: data.fecha_visita,
      descripcion: data.descripcion.trim() || "",
      direccion: data.direccion,
      estado: data.estado === "true",
      telefono: data.telefono,
      paciente_id: Number(data.paciente_id),
      medico_id: Number(data.medico_id),
      barrio_id: Number(data.barrio_id),
    };

    if (visita) {
      const id = visita.id_visita;
      if (typeof id !== "number") {
        toast.error("ID de la visita inválido");
      } else {
        await updateVisita(id, payload);
        toast.success("Visita actualizada exitosamente");
      }
    } else {
      await createVisita(payload);
      toast.success("Visita agregada exitosamente");
    }

    onSuccess();
  } catch (error) {
    toast.error("Error al guardar la visita");
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[95vh] overflow-y-auto p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h2 className="text-xl font-semibold text-gray-700">
            {visita ? "Editar Visita" : "Nueva Visita"}
          </h2>
          <div onClick={() => setForm(false)}>
            <BtnCancelar verText={false} text="" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Fecha</label>
            <input
              type="date"
              {...register("fecha_visita", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
            {errors.fecha_visita && <p className="text-red-500 text-sm">Campo obligatorio</p>}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Estado</label>
            <select
              {...register("estado")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            >
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Descripción <span className="text-gray-400 text-xs">(Opcional)</span></label>
            <textarea
              {...register("descripcion")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 focus:ring focus:ring-blue-200 focus:border-blue-400"
            placeholder="Ingrese una descripción (opcional)"
            />
          </div>

          {/* Dirección */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Dirección</label>
            <input
              type="text"
              {...register("direccion", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
            {errors.direccion && <p className="text-red-500 text-sm">Campo obligatorio</p>}
          </div>

          {/* Teléfono */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Teléfono</label>
            <input
              type="text"
              {...register("telefono", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
            {errors.telefono && <p className="text-red-500 text-sm">Campo obligatorio</p>}
          </div>

          {/* Paciente */}
          <div className="col-span-2">
          <ReactSelectComponent
            name="paciente_id"
            control={control}
            label="Paciente"
            required
            isClearable
            placeholder="Selecciona el paciente ...."
            options={pacientes.map((p: any) => ({
              value: p.idPaciente,
              label: `CC: ${p.usuario?.numeroDocumento} - ${p.usuario?.nombre} ${p.usuario?.segundoNombre ?? ""} ${p.usuario?.apellido} ${p.usuario?.segundoApellido ?? ""}`,
            }))}
            />
          </div>

          {/* Médico */}
          <div className="col-span-2">
          <ReactSelectComponent
            name="medico_id"
            control={control}
            label="Médico"
            required
            options={medicos.map((p: any) => ({
              value: p.id_medico,
              label: `CC: ${p.usuario.numero_documento} - ${p.usuario?.nombre} ${p.usuario?.segundoNombre ?? ""} ${p.usuario?.apellido} ${p.usuario?.segundoApellido ?? ""}`,
            }))}
            placeholder="Selecciona el médico ...."
            isClearable
          />
          </div>

          {/* Barrio */}
          <div className="col-span-2">
          <ReactSelectComponent
            name="barrio_id"
            control={control}
            label="Barrio"
            required
            options={barrios.map((b: any) => ({
              value: b.idBarrio,
              label: b.nombreBarrio,
            }))}
            placeholder="Selecciona el barrio ...."
            isClearable
          />  
          </div>

          <div className="col-span-2 flex justify-end pt-3">
            <button type="submit" className="focus:outline-none">
              {visita ? (
                <BtnActualizar verText={true} text="Actualizar" />
              ) : (
                <BtnAgregar verText={true} text="Agregar" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioVisitas
