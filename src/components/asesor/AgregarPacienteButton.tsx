import { FaUserPlus } from 'react-icons/fa'

interface Props {
  onClick: () => void
}

const AgregarPacienteButton: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="flex justify-end">
      <button
        onClick={onClick}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        <FaUserPlus />
        Agregar Paciente
      </button>
    </div>
  )
}

export default AgregarPacienteButton
