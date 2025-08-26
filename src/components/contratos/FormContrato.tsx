import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import toast from "react-hot-toast"
import { Plan, Paciente } from "../../interfaces/interfaces"
import { createContrato } from "../../services/contratos"
import { NuevoContratoForm, Membresia} from "../../interfaces/interfaces"


const FormContrato: React.FC = () => {
  const navigate = useNavigate()

  const [planes, setPlanes] = useState<Plan[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [selectedPlan, setSelectedPlan] = useState<{ value: number; label: string } | null>(null)
  const [selectedPaciente, setSelectedPaciente] = useState<{ value: number; label: string } | null>(null)
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [firma, setFirma] = useState("")
  const [formaPago, setFormaPago] = useState<{ value: string; label: string } | null>(null)
  const [numeroContrato, setNumeroContrato] = useState("")

  const opcionesFormaPago = [
    { value: "Efectivo", label: "Efectivo" },
    { value: "Transferencia", label: "Transferencia" },
    { value: "Daviplata", label: "Daviplata" },
    { value: "Nequi", label: "Nequi" },
  ]

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resPlanes, resPacientes] = await Promise.all([
          fetch("http://localhost:3333/planes"),
          fetch("http://localhost:3333/pacientes"),
        ])

        const planesData = await resPlanes.json()
        const pacientesData = await resPacientes.json()

        console.log("Planes response:", planesData) // Para debug
        console.log("Pacientes response:", pacientesData) // Para debug

        // Tu backend devuelve los planes en 'msj' y pacientes pueden venir diferente
        const planesCargados = Array.isArray(planesData.msj) 
          ? planesData.msj 
          : Array.isArray(planesData.data) 
          ? planesData.data
          : Array.isArray(planesData) 
          ? planesData 
          : []

        const pacientesCargados = Array.isArray(pacientesData.msj) 
          ? pacientesData.msj 
          : Array.isArray(pacientesData.data) 
          ? pacientesData.data
          : Array.isArray(pacientesData) 
          ? pacientesData 
          : []

        console.log("Planes cargados:", planesCargados) // Para debug
        console.log("Pacientes cargados:", pacientesCargados) // Para debug

        setPlanes(planesCargados)
        setPacientes(pacientesCargados)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast.error("Error al cargar planes o pacientes")
      }
    }

    fetchDatos()
  }, [])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!formaPago || !selectedPlan || !selectedPaciente) {
    toast.error("Debes completar todos los campos obligatorios")
    return
  }

  const payload: NuevoContratoForm = {
    firma,
    forma_pago: formaPago.value,
    numero_contrato: numeroContrato,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    plan_id: selectedPlan.value,
    paciente_id: selectedPaciente.value,
    estado: true
  }

  try {
    await createContrato(payload)
    toast.success("Contrato creado con éxito")
    navigate("/contratos") // regresa a la tabla de contratos
  } catch (error) {
    toast.error("Error al guardar contrato")
  }
}




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear Contrato</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Firma</label>
            <input
              type="text"
              value={firma}
              onChange={(e) => setFirma(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Forma de pago</label>
            <Select
              options={opcionesFormaPago}
              value={formaPago}
              onChange={setFormaPago}
              placeholder="Selecciona la forma de pago"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de contrato</label>
            <input
              type="text"
              value={numeroContrato}
              onChange={(e) => setNumeroContrato(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
            <Select
              options={pacientes.map((p: any) => ({
                // Ajustado para manejar diferentes nombres de ID
                value: p.idPaciente,
                label: `${[
                  p.usuario?.nombre,
                  p.usuario?.segundoNombre,
                  p.usuario?.apellido,
                  p.usuario?.segundoApellido
                ].filter(Boolean).join(" ")} (${p.usuario?.numeroDocumento || "Sin documento"})`,
              }))}
              value={selectedPaciente}
              onChange={setSelectedPaciente}
              placeholder="Selecciona un paciente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
            <Select
              options={planes.map((p: any) => ({
                // Manejo flexible de IDs de plan
                value: p.idPlan,
                label: `${p.tipoPlan} - $${p.precio}`,
              }))}
              value={selectedPlan}
              onChange={setSelectedPlan}
              placeholder="Selecciona un plan"
              isLoading={planes.length === 0}
              noOptionsMessage={() => planes.length === 0 ? "Cargando planes..." : "No hay planes disponibles"}
            />
            {planes.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Si no cargan los planes, verifica la URL del endpoint
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/contratos")}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormContrato