import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

interface Props {
  onBuscar: (termino: string) => void
}

const BuscarPaciente: React.FC<Props> = ({ onBuscar }) => {
  const [termino, setTermino] = useState('')

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setTermino(valor)
    onBuscar(valor)
  }

  return (
    <div className="flex items-center gap-2">
      <FaSearch className="text-gray-600" />
      <input
        type="text"
        value={termino}
        onChange={manejarCambio}
        placeholder="Buscar paciente..."
        className="border border-gray-300 rounded px-3 py-1 w-full max-w-md"
      />
    </div>
  )
}

export default BuscarPaciente
