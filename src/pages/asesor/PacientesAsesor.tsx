import React, { useState } from 'react'
import BuscarPaciente from '../../components/asesor/BuscarPaciente'
import ListadoPacientes from '../../components/asesor/ListadoPacientes'
import DetallePacienteModal from '../../components/asesor/DetallePacienteModal'
import AgregarPacienteButton from '../../components/asesor/AgregarPacienteButton'
import FormularioPaciente from '../../components/asesor/FormularioPaciente'


export interface Paciente {
  id: string
  nombre: string
  doctor: string
  direccion: string
  plan: string
}

const PacientesAsesor: React.FC = () => {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const handleBuscar = (termino: string) => {
    setBusqueda(termino)
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Gestión de Pacientes</h1>

      <BuscarPaciente onBuscar={handleBuscar} />

      <ListadoPacientes
        onVerDetalle={(paciente) => setPacienteSeleccionado(paciente)}
        filtro={busqueda}
      />

      <AgregarPacienteButton onClick={() => setMostrarFormulario(true)} />

      {pacienteSeleccionado && (
        <DetallePacienteModal
          paciente={pacienteSeleccionado}
          onClose={() => setPacienteSeleccionado(null)}
        />
      )}

      {mostrarFormulario && (
        <FormularioPaciente onClose={() => setMostrarFormulario(false)} />
      )}
    </div>
  )
}

export default PacientesAsesor
