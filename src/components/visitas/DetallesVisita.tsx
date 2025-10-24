import { useEffect, useState } from "react"
import { Visita } from "../../interfaces/visitas"
import BtnCerrar from "../botones/BtnCerrar"
import { readPacientes } from "../../services/pacientes"
import { medicoService } from "../../services/medicoService"
import { getBarrios } from "../../services/barrios"

type Props = {
  visita: Visita | null
  setDetalles: (value: boolean) => void
}

const DetallesVisita: React.FC<Props> = ({ visita, setDetalles }) => {
  const [paciente, setPaciente] = useState<any>(null)
  const [medico, setMedico] = useState<any>(null)
  const [barrio, setBarrio] = useState<any>(null)

  useEffect(() => {
    if (!visita) return

    // 🔹 Buscar paciente por ID
    readPacientes().then((res) => {
      const p = res.data.find((p: any) => p.idPaciente === visita.paciente_id)
      setPaciente(p)
    })

    // 🔹 Buscar médico por ID
visita.medico_id != null
  ? medicoService.getById(visita.medico_id)
      .then((m) => setMedico(m))
      .catch(() => setMedico(null))
  : setMedico(null)


    // 🔹 Buscar barrio por ID (normalizando ids como string/number)
    getBarrios()
      .then((res) => {
        const b = res.find((b: any) => String(b.idBarrio) === String(visita.barrio_id))
        setBarrio(b || null)
      })
      .catch(() => setBarrio(null))
  }, [visita])

  if (!visita) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-100 border-b">
          <h2 className="text-xl font-bold text-gray-800">📋 Detalles de la Visita</h2>
        </div>

        <div className="px-6 py-6 space-y-3">
          <p><b>ID:</b> {visita.id_visita}</p>
          <p><b>Fecha:</b> {new Date(visita.fecha_visita).toLocaleDateString("es-CO")}</p>
          <p><b>Descripción:</b> {visita.descripcion}</p>
          <p><b>Dirección:</b> {visita.direccion}</p>
          <p><b>Teléfono:</b> {visita.telefono}</p>
          <p><b>Estado:</b> {visita.estado ? "Activo" : "Inactivo"}</p>

          {/* Paciente */}
          <p>
            <b>Paciente:</b>{" "}
            {paciente
              ? `CC: ${paciente.usuario?.numeroDocumento} - ${paciente.usuario?.nombre} ${paciente.usuario?.apellido}`
              : "Cargando..."}
          </p>

          {/* Médico */}
          <p>
            <b>Médico:</b>{" "}
            {medico
              ? `${medico.usuario?.nombre} ${medico.usuario?.apellido} - CC: ${medico.usuario?.numero_documento}`
              : "Cargando..."}
          </p>

          {/* Barrio */}
          <p>
            <b>Barrio:</b>{" "}
            {barrio ? barrio.nombreBarrio : "Cargando..."}
          </p>
        </div>

        <div className="px-6 py-4 bg-gray-100 border-t flex justify-end">
          <div onClick={() => setDetalles(false)}>
            <BtnCerrar verText={true} text="Cerrar" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetallesVisita
