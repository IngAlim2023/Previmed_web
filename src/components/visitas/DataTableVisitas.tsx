import React, { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { Visita } from "../../interfaces/visitas"

const API_URL = "http://localhost:3333"

const DataTableVisitas: React.FC = () => {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState("")
  const [detalle, setDetalle] = useState<Visita | null>(null) // 👈 para el modal

  const cargarVisitas = async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/visitas`)
      const raw = await res.json()
      const data = Array.isArray(raw?.msj) ? raw.msj : []

      // 🔄 normalizar backend camelCase → frontend snake_case
      const normalizadas: Visita[] = data.map((v: any) => ({
        id_visita: v.idVisita,
        fecha_visita: v.fechaVisita,
        descripcion: v.descripcion,
        direccion: v.direccion,
        estado: v.estado,
        telefono: v.telefono,
        paciente_id: v.pacienteId,
        medico_id: v.medicoId,
        barrio_id: v.barrioId,
        paciente: v.paciente,
        medico: v.medico,
        barrio: v.barrio,
      }))

      setVisitas(normalizadas)
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar visitas")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarVisitas()
  }, [])

  // 🔎 filtrar por paciente, médico, barrio o fecha
  const visitasFiltradas = visitas.filter((v) => {
    const texto = filtro.toLowerCase()
    return (
      v.paciente?.nombre?.toLowerCase().includes(texto) ||
      v.medico?.nombre?.toLowerCase().includes(texto) ||
      v.barrio?.nombre?.toLowerCase().includes(texto) ||
      v.fecha_visita?.toLowerCase().includes(texto)
    )
  })

  const columnas = [
    { name: "ID", selector: (row: Visita) => row.id_visita, sortable: true },
    { name: "Fecha", selector: (row: Visita) => row.fecha_visita, sortable: true },
    { name: "Descripción", selector: (row: Visita) => row.descripcion },
    { name: "Dirección", selector: (row: Visita) => row.direccion },
    { name: "Estado", selector: (row: Visita) => (row.estado ? "Activa" : "Inactiva") },
    { name: "Teléfono", selector: (row: Visita) => row.telefono },
    { name: "Paciente", selector: (row: Visita) => row.paciente?.nombre ?? "—" },
    { name: "Médico", selector: (row: Visita) => row.medico?.nombre ?? "—" },
    { name: "Barrio", selector: (row: Visita) => row.barrio?.nombre ?? "—" },
    {
      name: "Acciones",
      cell: (row: Visita) => (
        <button
          onClick={() => setDetalle(row)}
          className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
        >
          Ver
        </button>
      ),
    },
  ]

  if (cargando) return <p>Cargando visitas...</p>
  if (error) return <p style={{ color: "red" }}>⚠️ {error}</p>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista de Visitas</h2>
        <input
          type="text"
          placeholder="Buscar por paciente, médico, barrio o fecha..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border p-2 rounded w-80"
        />
      </div>

      <DataTable
        columns={columnas}
        data={visitasFiltradas}
        pagination
        highlightOnHover
        striped
      />

      {/* Modal bonito */}
      {detalle && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              Detalles de la visita #{detalle.id_visita}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Fecha:</strong> {detalle.fecha_visita}</li>
              <li><strong>Descripción:</strong> {detalle.descripcion}</li>
              <li><strong>Dirección:</strong> {detalle.direccion}</li>
              <li><strong>Teléfono:</strong> {detalle.telefono}</li>
              <li><strong>Estado:</strong> {detalle.estado ? "Activa" : "Inactiva"}</li>
              <li><strong>Paciente:</strong> {detalle.paciente?.nombre ?? detalle.paciente_id}</li>
              <li><strong>Médico:</strong> {detalle.medico?.nombre ?? detalle.medico_id}</li>
              <li><strong>Barrio:</strong> {detalle.barrio?.nombre ?? detalle.barrio_id}</li>
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={() => setDetalle(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTableVisitas
