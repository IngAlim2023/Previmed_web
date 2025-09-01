import { Visita } from "../../interfaces/visitas"
import BtnCerrar from "../botones/BtnCerrar"

type Props = {
  visita: Visita | null
  setDetalles: (value: boolean) => void
}

const DetallesVisita: React.FC<Props> = ({ visita, setDetalles }) => {
  if (!visita) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-100 border-b">
          <h2 className="text-xl font-bold text-gray-800">📋 Detalles de la Visita</h2>
        </div>

        <div className="px-6 py-6 space-y-3">
          <p><b>ID:</b> {visita.id_visita}</p>
          <p><b>Fecha:</b> {visita.fecha_visita}</p>
          <p><b>Descripción:</b> {visita.descripcion}</p>
          <p><b>Dirección:</b> {visita.direccion}</p>
          <p><b>Teléfono:</b> {visita.telefono}</p>
          <p><b>Estado:</b> {visita.estado ? "Activo" : "Inactivo"}</p>
          <p><b>Paciente ID:</b> {visita.paciente_id}</p>
          <p><b>Médico ID:</b> {visita.medico_id}</p>
          <p><b>Barrio ID:</b> {visita.barrio_id}</p>
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
