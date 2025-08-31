import React, { useEffect, useMemo, useState } from "react" 
import BtnAgregar from "../../components/botones/BtnAgregar"
import BtnEditar from "../../components/botones/BtnEditar"
import BtnEliminar from "../../components/botones/BtnEliminar"
import BtnLeer from "../../components/botones/BtnLeer"
import BtnCambiar from "../../components/botones/BtnCambiar"
import { Visita } from "../../interfaces/visitas"

const API_URL = "http://localhost:3333"

const Visitas: React.FC = () => {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Visita, "id_visita">>({
    fecha_visita: "",
    descripcion: "",
    direccion: "",
    estado: true,
    telefono: "",
    paciente_id: undefined as any,
    medico_id: undefined as any,
    barrio_id: undefined as any,
  })

  const [q, setQ] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [visitaSeleccionada, setVisitaSeleccionada] = useState<Visita | null>(null)

  const formatDate = (val: string) => {
    if (!val) return "—"
    const d = new Date(val)
    if (isNaN(d.getTime())) return val
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d)
  }

  const normalizeFromApi = (v: any): Visita => ({
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
  })

  const normalizeToApi = (f: Omit<Visita, "id_visita">) => ({
    fechaVisita: f.fecha_visita,
    descripcion: f.descripcion,
    direccion: f.direccion,
    estado: f.estado,
    telefono: f.telefono,
    pacienteId: f.paciente_id,
    medicoId: f.medico_id,
    barrioId: f.barrio_id,
  })

  const cargarVisitas = async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/visitas`)
      const raw = await res.json()
      const data = Array.isArray(raw?.msj) ? raw.msj : []
      setVisitas(data.map(normalizeFromApi))
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar visitas")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarVisitas()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === "estado") {
      setForm((f) => ({ ...f, estado: value === "true" }))
    } else if (["paciente_id", "medico_id", "barrio_id"].includes(name)) {
      setForm((f) => ({ ...f, [name]: value === "" ? undefined : Number(value) }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  const resetForm = () => {
    setForm({
      fecha_visita: "",
      descripcion: "",
      direccion: "",
      estado: true,
      telefono: "",
      paciente_id: undefined as any,
      medico_id: undefined as any,
      barrio_id: undefined as any,
    })
    setEditId(null)
  }

  const crear = async () => {
    try {
      const res = await fetch(`${API_URL}/visitas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizeToApi(form)),
      })
      const data = await res.json()
      if (data?.error) throw new Error(data.error)
      await cargarVisitas()
      resetForm()
    } catch (e: any) {
      alert(e?.message ?? "Error creando visita")
    }
  }

  const actualizar = async () => {
    if (!editId) return
    try {
      const res = await fetch(`${API_URL}/visitas/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizeToApi(form)),
      })
      const data = await res.json()
      if (data?.error) throw new Error(data.error)
      await cargarVisitas()
      resetForm()
    } catch (e: any) {
      alert(e?.message ?? "Error actualizando visita")
    }
  }

  const eliminar = async (id: number) => {
    if (!confirm(`¿Eliminar visita #${id}?`)) return
    try {
      const res = await fetch(`${API_URL}/visitas/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data?.error) throw new Error(data.error)
      await cargarVisitas()
    } catch (e: any) {
      alert(e?.message ?? "Error eliminando visita")
    }
  }

  const leer = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/visitas/${id}`)
      const data = await res.json()
      const v: Visita | null = data?.msj ? normalizeFromApi(data.msj) : null
      if (!v) return alert("No se encontró la visita")
      setVisitaSeleccionada(v)
      setShowModal(true)
    } catch {
      alert("Error leyendo visita")
    }
  }

  const comenzarEditar = (v: Visita) => {
    setEditId(v.id_visita)
    setForm({
      fecha_visita: v.fecha_visita?.split("T")[0] ?? "",
      descripcion: v.descripcion ?? "",
      direccion: v.direccion ?? "",
      estado: Boolean(v.estado),
      telefono: v.telefono ?? "",
      paciente_id: Number(v.paciente_id),
      medico_id: Number(v.medico_id),
      barrio_id: Number(v.barrio_id),
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const filtradas = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return visitas
    return visitas.filter((v) => {
      const hay =
        v.descripcion?.toLowerCase().includes(term) ||
        v.direccion?.toLowerCase().includes(term) ||
        v.telefono?.toLowerCase().includes(term) ||
        v.paciente?.nombre?.toLowerCase().includes(term) ||
        v.medico?.nombre?.toLowerCase().includes(term) ||
        v.barrio?.nombre?.toLowerCase().includes(term)
      return hay
    })
  }, [q, visitas])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ---------------- HEADER ---------------- */}
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Visitas</h1>
            <p className="text-gray-600">Crea, edita y administra visitas domiciliarias.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por paciente, médico, barrio..."
              className="w-72 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </header>

        {/* ---------------- FORMULARIO ---------------- */}
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="fecha_visita" value={form.fecha_visita} onChange={handleChange} className="border rounded p-2" />
            <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="👉 Descripción" className="border rounded p-2" />
            <input type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="👉 Dirección" className="border rounded p-2" />
            <input type="text" name="telefono" value={form.telefono} onChange={handleChange} placeholder="👉 Teléfono" className="border rounded p-2" />
            <select name="estado" value={String(form.estado)} onChange={handleChange} className="border rounded p-2">
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
            <input type="number" name="paciente_id" value={form.paciente_id ?? ""} onChange={handleChange} placeholder="👉 ID Paciente" className="border rounded p-2" />
            <input type="number" name="medico_id" value={form.medico_id ?? ""} onChange={handleChange} placeholder="👉 ID Médico" className="border rounded p-2" />
            <input type="number" name="barrio_id" value={form.barrio_id ?? ""} onChange={handleChange} placeholder="👉 ID Barrio" className="border rounded p-2" />
          </div>

          <div className="mt-5 flex items-center gap-3">
            {editId ? (
              <div onClick={actualizar}><BtnCambiar /></div>
            ) : (
              <div onClick={crear}><BtnAgregar /></div>
            )}
            {editId && (
              <div onClick={resetForm}><BtnLeer /></div>
            )}
          </div>
        </div>

        {/* ---------------- TABLA ---------------- */}
        <div className="overflow-x-auto rounded-2xl bg-white shadow-md">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">Dirección</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Paciente</th>
                <th className="px-4 py-3 text-left">Médico</th>
                <th className="px-4 py-3 text-left">Barrio</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando ? (
                <tr><td colSpan={10} className="px-4 py-6 text-center text-gray-500">Cargando...</td></tr>
              ) : filtradas.length ? (
                filtradas.map((v) => (
                  <tr key={v.id_visita} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{v.id_visita}</td>
                    <td className="px-4 py-3">{formatDate(v.fecha_visita)}</td>
                    <td className="px-4 py-3">{v.descripcion}</td>
                    <td className="px-4 py-3">{v.direccion}</td>
                    <td className="px-4 py-3">{v.telefono}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${v.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {v.estado ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{v.paciente?.nombre ?? v.paciente_id}</td>
                    <td className="px-4 py-3">{v.medico?.nombre ?? v.medico_id}</td>
                    <td className="px-4 py-3">{v.barrio?.nombre ?? v.barrio_id}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <div onClick={() => leer(v.id_visita)}><BtnLeer /></div>
                        <div onClick={() => comenzarEditar(v)}><BtnEditar /></div>
                        <div onClick={() => eliminar(v.id_visita)}><BtnEliminar /></div>
                        <div onClick={async () => {
                          try {
                            await fetch(`${API_URL}/visitas/${v.id_visita}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ estado: !v.estado }),
                            })
                            await cargarVisitas()
                          } catch {
                            alert("No se pudo cambiar el estado")
                          }
                        }}>
                          <BtnCambiar />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-500">No hay resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* ---------------- MODAL PROFESIONAL ---------------- */}
      {showModal && visitaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 p-6 animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              Detalles de la Visita #{visitaSeleccionada.id_visita}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><span className="font-semibold">📅 Fecha:</span> {formatDate(visitaSeleccionada.fecha_visita)}</p>
              <p><span className="font-semibold">👤 Paciente:</span> {visitaSeleccionada.paciente?.nombre ?? visitaSeleccionada.paciente_id}</p>
              <p><span className="font-semibold">👨‍⚕️ Médico:</span> {visitaSeleccionada.medico?.nombre ?? visitaSeleccionada.medico_id}</p>
              <p><span className="font-semibold">🏘️ Barrio:</span> {visitaSeleccionada.barrio?.nombre ?? visitaSeleccionada.barrio_id}</p>
              <p><span className="font-semibold">📞 Teléfono:</span> {visitaSeleccionada.telefono}</p>
              <p>
                <span className="font-semibold">⚡ Estado:</span>{" "}
                <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${visitaSeleccionada.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {visitaSeleccionada.estado ? "Activa" : "Inactiva"}
                </span>
              </p>
              <div className="md:col-span-2">
                <p><span className="font-semibold">📝 Descripción:</span> {visitaSeleccionada.descripcion}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow"
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

export default Visitas
