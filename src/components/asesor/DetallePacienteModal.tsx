interface Paciente {
  id: string
  nombre: string
  doctor: string
  direccion: string
  plan: string
}

interface Props {
  paciente: Paciente
  onClose: () => void
}

const DetallePacienteModal: React.FC<Props> = ({ paciente, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Detalles del Paciente</h2>
        <p><strong>Nombre:</strong> {paciente.nombre}</p>
        <p><strong>Doctor:</strong> {paciente.doctor}</p>
        <p><strong>Dirección:</strong> {paciente.direccion}</p>
        <p><strong>Plan:</strong> {paciente.plan}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetallePacienteModal
