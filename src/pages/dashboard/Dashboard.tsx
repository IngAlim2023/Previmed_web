import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

interface Medico {
  nombre: string
  especialidad: string
  disponibilidad: string
}

interface Asesor {
  nombre: string
  disponibilidad: string
}

interface Citas {
  citas: string
  Paciente: string
  Asesor: string
  Medico: string
  estado: 'Realizada' | 'Pendiente'
}

const asesores: Asesor[] = [
  { nombre: 'Asesor Carlos', disponibilidad: 'Disponible' },
  { nombre: 'Asesora Laura', disponibilidad: 'No disponible' },
  { nombre: 'Asesor Luis', disponibilidad: 'Disponible' },
]

const medicos: Medico[] = [
  { nombre: 'Dr. Juan Pérez', especialidad: 'Pediatría', disponibilidad: 'Disponible' },
  { nombre: 'Dra. Ana López', especialidad: 'Cardiología', disponibilidad: 'No disponible' },
  { nombre: 'Dr. Carlos Díaz', especialidad: 'Dermatología', disponibilidad: 'No disponible' },
]

const citas: Citas[] = [
  { citas: 'Cita 1', Paciente: 'Juan Pérez', Asesor: 'Asesor Carlos', Medico: 'Dr. Carlos Díaz', estado: 'Realizada' },
  { citas: 'Cita 2', Paciente: 'Juan Pérez', Asesor: 'Asesor Carlos', Medico: 'Dr. Carlos Díaz', estado: 'Pendiente' },
  { citas: 'Cita 3', Paciente: 'Juan Pérez', Asesor: 'Asesor Carlos', Medico: 'Dr. Carlos Díaz', estado: 'Realizada' },
]

const contarAsesores = (asesores: Asesor[]) => {
  let disponibles = 0
  let noDisponibles = 0
  asesores.forEach(asesor => {
    if (asesor.disponibilidad === 'Disponible') disponibles++
    else noDisponibles++
  })
  return [disponibles, noDisponibles]
}

const contarMedicos = (medicos: Medico[]) => {
  let disponibles = 0
  let noDisponibles = 0
  medicos.forEach(medico => {
    if (medico.disponibilidad === 'Disponible') disponibles++
    else noDisponibles++
  })
  return [disponibles, noDisponibles]
}

const contarCitas = (citas: Citas[]) => {
  let realizadas = 0
  let pendientes = 0
  citas.forEach(cita => {
    if (cita.estado === 'Realizada') realizadas++
    else if (cita.estado === 'Pendiente') pendientes++
  })
  return [realizadas, pendientes]
}

const DashboardData = {
  labels: ['Citas realizadas', 'Citas pendientes'],
  datasets: [
    {
      label: 'Asesores',
      data: contarAsesores(asesores),
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1,
    },
    {
      label: 'Médicos',
      data: contarMedicos(medicos),
      backgroundColor: 'rgb(54, 162, 235)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
    },
    {
      label: 'Citas',
      data: contarCitas(citas),
      backgroundColor: 'rgb(135, 255, 99)',
      borderColor: 'rgb(135, 255, 99)',
      borderWidth: 1,
    },
  ],
}

const Dashboard: React.FC = () => {
  const [showMedicos, setShowMedicos] = useState(false)
  const [showAsesores, setShowAsesores] = useState(false)
  const [showCitas, setShowCitas] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, sans-serif',
        backgroundColor: '#f4f6f8',
      }}
    >

      <aside
        style={{
          width: '220px',
          backgroundColor: '#1e293b',
          color: '#fff',
          padding: '20px',
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px', cursor: 'pointer' }}>Asesores</li>
          <li style={{ marginBottom: '15px', cursor: 'pointer' }}>Citas</li>
          <li style={{ marginBottom: '15px', cursor: 'pointer' }}>Pacientes</li>
          <li style={{ marginBottom: '15px', cursor: 'pointer' }}>Consultas</li>
          <li style={{ marginBottom: '15px', cursor: 'pointer' }}>Estadistica</li>
        </ul>
      </aside>


      <main
        style={{
          flex: 1,
          padding: '30px',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '20px',
          borderBottomLeftRadius: '20px',
          boxShadow: '-4px 0 10px rgba(0,0,0,0.05)',
        }}
      >

        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => {
              setShowMedicos(true)
              setShowAsesores(false)
              setShowCitas(false)
            }}
            style={{
              marginRight: '15px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Médicos
          </button>
          <button
            onClick={() => {
              setShowAsesores(true)
              setShowMedicos(false)
              setShowCitas(false)
            }}
            style={{
              marginRight: '15px',
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Asesores
          </button>
          <button
            onClick={() => {
              setShowCitas(true)
              setShowMedicos(false)
              setShowAsesores(false)
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Citas
          </button>
        </div>


        {showMedicos && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Médicos</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {medicos.map((medico, index) => (
                <li key={index} style={{ marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#1e40af' }}>{medico.nombre}</h3>
                  <p style={{ margin: 0, color: '#475569' }}>{medico.especialidad}</p>
                  <p style={{ margin: 0, color: '#475569' }}>{medico.disponibilidad}</p>
                </li>
              ))}
            </ul>
          </section>
        )}


        {showAsesores && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Asesores</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {asesores.map((asesor, index) => (
                <li key={index} style={{ marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#0f172a' }}>{asesor.nombre}</h3>
                  <p style={{ margin: 0, color: '#475569' }}>{asesor.disponibilidad}</p>
                </li>
              ))}
            </ul>
          </section>
        )}


        {showCitas && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Citas</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {citas.map((cita, index) => (
                <li key={index} style={{ marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#0f172a' }}>{cita.citas}</h3>
                  <p style={{ margin: 0, color: '#475569' }}>{cita.Paciente}</p>
                  <p style={{ margin: 0, color: '#475569' }}>{cita.Asesor}</p>
                  <p style={{ margin: 0, color: '#475569' }}>{cita.Medico}</p>
                  <p style={{ margin: 0, color: '#475569' }}>{cita.estado}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Estadísticas</h2>
          <div
            style={{
              width: '100%',
              maxWidth: '700px',
              height: '400px',
              backgroundColor: '#f1f5f9',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Bar data={DashboardData} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
