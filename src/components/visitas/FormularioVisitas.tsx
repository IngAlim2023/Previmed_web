import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Visita } from "../../interfaces/visitas"
import { createVisita, updateVisita } from "../../services/visitasService"
import { readPacientes } from "../../services/pacientes"
import { medicoService } from "../../services/medicoService"

// botones personalizados
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

const FormularioVisitas: React.FC<Props> = ({ visita, setForm, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<VisitaFormValues>({
    defaultValues: visita
      ? {
          fecha_visita: visita.fecha_visita,
          descripcion: visita.descripcion,
          direccion: visita.direccion,
          estado: visita.estado ? "true" : "false",
          telefono: visita.telefono,
          paciente_id: visita.paciente_id,
          medico_id: visita.medico_id,
          barrio_id: visita.barrio_id,
        }
      : {
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
      setMedicos(res.data || [])   // 👈 tu service devuelve array directo
    } catch (error) {
      console.error("Error al cargar médicos", error)
      toast.error("No se pudieron cargar los médicos")
    }
  }

  fetchPacientes()
  fetchMedicos()
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
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.fecha_visita && <p className="text-red-500 text-sm">Campo obligatorio</p>}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Estado</label>
            <select
              {...register("estado")}
              className="w-full px-3 py-2 border rounded-lg"
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
              className="w-full px-3 py-2 border rounded-lg h-20"
            />
          </div>

          {/* Dirección */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Dirección</label>
            <input
              type="text"
              {...register("direccion", { required: true })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Teléfono */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Teléfono</label>
            <input
              type="text"
              {...register("telefono", { required: true })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Paciente */}
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-1">Paciente</label>
            <select
              {...register("paciente_id", { required: true })}
              className="w-full px-3 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccione un paciente</option>
              {pacientes.map((p: any) => (
                <option key={p.idPaciente} value={p.idPaciente}>
                  CC: {p.usuario?.numeroDocumento} - {p.usuario?.nombre}{" "}
                  {p.usuario?.segundoNombre ?? ""} {p.usuario?.apellido}{" "}
                  {p.usuario?.segundoApellido ?? ""}
                </option>
              ))}
            </select>
            {errors.paciente_id && <p className="text-red-500 text-sm">Campo obligatorio</p>}
          </div>

          {/* Médico */}
<div className="col-span-2">
  <label className="block text-gray-600 text-sm mb-1">Médico</label>
  <select
    {...register("medico_id", { required: true })}
    className="w-full px-3 py-2 border rounded-lg"
  >
    <option value="">Seleccione un médico</option>
    {medicos.map((m: any) => (
      <option key={m.id_medico} value={m.id_medico}>
        {m.usuario?.nombre} {m.usuario?.apellido} - CC: {m.usuario?.numero_documento}
      </option>
    ))}
  </select>
  {errors.medico_id && <p className="text-red-500 text-sm">Campo obligatorio</p>}
</div>


          {/* Barrio */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Barrio ID</label>
            <input
              type="number"
              {...register("barrio_id", { required: true })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Botón */}
          <div className="col-span-2 flex justify-end pt-3">
            <div onClick={handleSubmit(onSubmit)}>
              <BtnActualizar verText={true} text={visita ? "Actualizar" : "Guardar"} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioVisitas
