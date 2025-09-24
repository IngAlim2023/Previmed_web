import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Select from "react-select"
import { Visita } from "../../interfaces/visitas"
import { createVisita, updateVisita } from "../../services/visitasService"
import { readPacientes } from "../../services/pacientes"
import { medicoService } from "../../services/medicoService"
import { getBarrios } from "../../services/barrios"

// botones personalizados
import BtnAgregar from "../botones/BtnAgregar"
import BtnActualizar from "../botones/BtnActualizar"
import BtnCancelar from "../botones/BtnCancelar"

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
  paciente_id: number
  medico_id: number
  barrio_id: number
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
    setValue,
    watch,
  } = useForm<VisitaFormValues>({
    defaultValues: {
      fecha_visita: "",
      descripcion: "",
      direccion: "",
      estado: "true",
      telefono: "",
      paciente_id: 0,
      medico_id: 0,
      barrio_id: 0,
    },
  })

  const [pacientes, setPacientes] = useState<any[]>([])
  const [medicos, setMedicos] = useState<any[]>([])
  const [barrios, setBarrios] = useState<any[]>([])

  // ✅ cuando cambia la visita cargamos sus valores iniciales
  useEffect(() => {
    if (visita) {
      reset({
        fecha_visita: formatDate(visita.fecha_visita),
        descripcion: visita.descripcion,
        direccion: visita.direccion,
        estado: visita.estado ? "true" : "false",
        telefono: visita.telefono,
        paciente_id: visita.paciente_id,
        medico_id: visita.medico_id,
        barrio_id: visita.barrio_id,
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
        console.error("Error al cargar pacientes", error)
        toast.error("No se pudieron cargar los pacientes")
      }
    }

    const fetchMedicos = async () => {
      try {
        const res = await medicoService.getAll()
        setMedicos(res.data || [])
      } catch (error) {
        console.error("Error al cargar médicos", error)
        toast.error("No se pudieron cargar los médicos")
      }
    }

    const fetchBarrios = async () => {
      try {
        const res = await getBarrios()
        setBarrios(res || [])
      } catch (error) {
        console.error("Error al cargar barrios", error)
        toast.error("No se pudieron cargar los barrios")
      }
    }

    fetchPacientes()
    fetchMedicos()
    fetchBarrios()
  }, [])

  const onSubmit = async (data: VisitaFormValues) => {
    try {
      const payload: Visita = {
        id_visita: visita ? visita.id_visita : 0,
        fecha_visita: data.fecha_visita,
        descripcion: data.descripcion,
        direccion: data.direccion,
        estado: data.estado === "true",
        telefono: data.telefono,
        paciente_id: Number(data.paciente_id),
        medico_id: Number(data.medico_id),
        barrio_id: Number(data.barrio_id),
      }

      if (visita) {
        await updateVisita(visita.id_visita, payload)
        toast.success("Visita actualizada")
      } else {
        await createVisita(payload)
        toast.success("Visita creada")
      }

      setForm(false)
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error("Error al guardar la visita")
    }
  }

  // 🎨 estilos para que react-select se vea igual que los inputs
  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      borderRadius: "0.5rem",
      borderColor: "#d1d5db",
      padding: "2px 4px",
      boxShadow: "none",
      "&:hover": { borderColor: "#9ca3af" },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "0.5rem",
      overflow: "hidden",
    }),
  }

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
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Descripción</label>
            <textarea
              {...register("descripcion", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 focus:ring focus:ring-blue-200 focus:border-blue-400"
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
          </div>

          {/* Teléfono */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Teléfono</label>
            <input
              type="text"
              {...register("telefono", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* Paciente */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Paciente</label>
            <Select
              styles={customSelectStyles}
              options={pacientes.map((p: any) => ({
                value: p.idPaciente,
                label: `CC: ${p.usuario?.numeroDocumento} - ${p.usuario?.nombre} ${p.usuario?.segundoNombre ?? ""} ${p.usuario?.apellido} ${p.usuario?.segundoApellido ?? ""}`,
              }))}
              value={
                pacientes
                  .map((p: any) => ({
                    value: p.idPaciente,
                    label: `CC: ${p.usuario?.numeroDocumento} - ${p.usuario?.nombre} ${p.usuario?.segundoNombre ?? ""} ${p.usuario?.apellido} ${p.usuario?.segundoApellido ?? ""}`,
                  }))
                  .find((opt: any) => opt.value === watch("paciente_id")) || null
              }
              onChange={(option) => {
                if (option) setValue("paciente_id", option.value)
              }}
              placeholder="Buscar paciente..."
              className="text-sm"
            />
            {errors.paciente_id && <p className="text-red-500 text-sm">Campo obligatorio</p>}
          </div>

          {/* Médico */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Médico</label>
            <Select
              styles={customSelectStyles}
              options={medicos.map((m: any) => ({
                value: m.id_medico,
                label: `${m.usuario?.nombre} ${m.usuario?.apellido} - CC: ${m.usuario?.numero_documento}`,
              }))}
              value={
                medicos
                  .map((m: any) => ({
                    value: m.id_medico,
                    label: `${m.usuario?.nombre} ${m.usuario?.apellido} - CC: ${m.usuario?.numero_documento}`,
                  }))
                  .find((opt: any) => opt.value === watch("medico_id")) || null
              }
              onChange={(option) => {
                if (option) setValue("medico_id", option.value)
              }}
              placeholder="Buscar médico..."
              className="text-sm"
            />
            {errors.medico_id && <p className="text-red-500 text-sm">Campo obligatorio</p>}
          </div>

          {/* Barrio */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Barrio</label>
            <Select
              styles={customSelectStyles}
              options={barrios.map((b: any) => ({
                value: b.idBarrio,
                label: b.nombreBarrio,
              }))}
              value={
                barrios
                  .map((b: any) => ({
                    value: b.idBarrio,
                    label: b.nombreBarrio,
                  }))
                  .find((opt: any) => opt.value === watch("barrio_id")) || null
              }
              onChange={(option) => {
                if (option) setValue("barrio_id", option.value)
              }}
              placeholder="Buscar barrio..."
              className="text-sm"
            />
            {errors.barrio_id && <p className="text-red-500 text-sm">Campo obligatorio</p>}
          </div>

          {/* Botón */}
          <div className="col-span-2 flex justify-end pt-3">
            <div onClick={handleSubmit(onSubmit)}>
              {visita ? (
                <BtnActualizar verText={true} text="Actualizar" />
              ) : (
                <BtnAgregar verText={true} text="Agregar" />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioVisitas
