import React, { useState, useEffect } from 'react'
import { FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi'
interface InfoVisita {
  nombre: string
  segundo_nobre: string
  apellido: string
  segundo_apellido: string
  direccion: string
  fecha_cita: Date
  descripcion: string
}

const VisitasMedico: React.FC = () => {
  const [pacientes, setPacientes] = useState<InfoVisita[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const datosTemporales: InfoVisita[] = [
        {
          nombre: 'Juan',
          segundo_nobre: 'Carlos',
          apellido: 'Gómez',
          segundo_apellido: 'Pérez',
          direccion: 'Calle jodida 123',
          fecha_cita: new Date('2025-06-25T10:00:00'),
          descripcion: 'Dolor abdominal leve',
        },
        {
          nombre: 'Ana',
          segundo_nobre: 'María',
          apellido: 'Rodríguez',
          segundo_apellido: 'López',
          direccion: 'Av. Siempre Viva 742',
          fecha_cita: new Date('2025-06-26T14:30:00'),
          descripcion: 'Chequeo general',
        },
      ]
      setPacientes(datosTemporales)
      setLoading(false)
    } catch (err) {
      setError('Error al cargar los datos')
      setLoading(false)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-teal-700 mb-6">Visitas Pendientes</h2>
        {loading && <p className="text-gray-600">Cargando visitas...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pacientes.map((paciente, index) => {
            const nombreCompleto = `${paciente.nombre} ${paciente.segundo_nobre} ${paciente.apellido} ${paciente.segundo_apellido}`
            const hora = paciente.fecha_cita.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })
            const esExpandido = expanded === index

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-teal-500 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-teal-800 mb-1">{nombreCompleto}</h3>
                <p className="text-gray-600">{paciente.direccion}</p>
                <p className="text-gray-700 text-sm flex items-center gap-1">
                  <FiClock className="inline-block" /> {hora}
                </p>

                {esExpandido && (
                  <div className="mt-4 text-sm text-gray-800 space-y-1">
                    <p>
                      <span className="font-medium">Fecha completa:</span>{' '}
                      {paciente.fecha_cita.toLocaleString('es-ES', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Motivo:</span> {paciente.descripcion}
                    </p>
                  </div>
                )}

                <button
                  className="mt-4 text-teal-700 font-medium hover:underline flex items-center gap-1"
                  onClick={() => setExpanded(esExpandido ? null : index)}
                >
                  {esExpandido ? (
                    <>
                      Ocultar detalles <FiChevronUp />
                    </>
                  ) : (
                    <>
                      Ver más detalles <FiChevronDown />
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default VisitasMedico
