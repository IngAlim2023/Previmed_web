import React from "react"
import BtnCerrar from "../botones/BtnCerrar"
import { Membresia } from "../../interfaces/interfaces"

type Props = {
  contrato: (Membresia & { planNombre?: string }) | null
  setShowDetalles: (v: boolean) => void
}

const DetallesContrato: React.FC<Props> = ({ contrato, setShowDetalles }) => {
  if (!contrato) return null

  // 🔹 Buscar titular dentro de la membresía
  const titular = contrato.membresiaPaciente?.find(
    (mp) => mp.paciente?.pacienteId === null
  )?.paciente?.usuario

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-100 border-b">
          <h2 className="text-xl font-bold text-gray-800">📜 Detalles del Contrato</h2>
        </div>

        <div className="px-6 py-6 space-y-3">
          <p><b>ID:</b> {contrato.idMembresia}</p>
          <p><b>Firma:</b> {contrato.firma}</p>
          <p><b>Forma de Pago:</b> {contrato.formaPago}</p>
          <p><b>Número Contrato:</b> {contrato.numeroContrato}</p>
          <p><b>Fecha Inicio:</b> {new Date(contrato.fechaInicio).toLocaleDateString("es-CO")}</p>
          <p><b>Fecha Fin:</b> {new Date(contrato.fechaFin).toLocaleDateString("es-CO")}</p>
          <p><b>Plan:</b> {contrato.planNombre}</p>
          <p><b>Estado:</b> {contrato.estado ? "Activo" : "Inactivo"}</p>

          {/* 🔹 Nuevo campo: Titular */}
          <div className="mt-4 border-t pt-3">
            <p><b>👤 Titular:</b> {titular
              ? `${titular.nombre ?? ""} ${titular.apellido ?? ""}`.trim()
              : "Sin titular asociado"}</p>
            {titular?.numeroDocumento && (
              <p><b>Documento:</b> {titular.numeroDocumento}</p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-100 border-t flex justify-end">
          <div onClick={() => setShowDetalles(false)}>
            <BtnCerrar verText={true} text="Cerrar" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetallesContrato
