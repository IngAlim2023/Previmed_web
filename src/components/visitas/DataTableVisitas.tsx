import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import toast from "react-hot-toast"
import Select from "react-select"
import { Visita } from "../../interfaces/visitas"
import { getVisitas, deleteVisita, updateVisita } from "../../services/visitasService"
import { medicoService } from "../../services/medicoService"
import BtnLeer from "../botones/BtnLeer"
import BtnEditar from "../botones/BtnEditar"
import BtnEliminar from "../botones/BtnEliminar"
import BtnAgregar from "../botones/BtnAgregar"
import FormularioVisitas from "./FormularioVisitas"
import DetallesVisita from "./DetallesVisita"
import ConfirmDialog from "./ConfirmDialog"
import { HiOutlineClipboardList } from "react-icons/hi"
import type { MedicoResponse } from "../../interfaces/medicoInterface"
import { FiEdit3 } from "react-icons/fi"

const DataTableVisitas: React.FC = () => {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [search, setSearch] = useState("")
  const [form, setForm] = useState(false)
  const [detalles, setDetalles] = useState(false)
  const [visita, setVisita] = useState<Visita | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [visitaAEliminar, setVisitaAEliminar] = useState<Visita | null>(null)

  const [cambiandoMedicoId, setCambiandoMedicoId] = useState<number | null>(null)
  const [medicosDisp, setMedicosDisp] = useState<{ value: number; label: string }[]>([])
  const [medicosTodos, setMedicosTodos] = useState<{ value: number; label: string }[]>([])
  const [loadingMedicos, setLoadingMedicos] = useState(true)

  // 🔁 Cargar visitas
  const fetchVisitas = async (showToast = false) => {
    try {
      if (showToast) toast.loading("Cargando visitas...", { id: "visitas-toast" })
      const data = await getVisitas()
      setVisitas(data)
      if (showToast) toast.success("Visitas cargadas exitosamente", { id: "visitas-toast" })
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar visitas", { id: "visitas-toast" })
    } finally {
      toast.dismiss("visitas-toast")
    }
  }

  // 🔁 Cargar médicos (todos y disponibles)
  const fetchMedicos = async () => {
    setLoadingMedicos(true)
    try {
      const [pagTodos, pagDisp] = await Promise.all([
        medicoService.getAll(),
        medicoService.getAll({ disponibilidad: true, estado: true })
      ])

      const todos = pagTodos.data.map(m => ({
        value: m.id_medico,
        label: `${m.usuario.nombre} ${m.usuario.apellido}`
      }))
      const disponibles = pagDisp.data.map(m => ({
        value: m.id_medico,
        label: `${m.usuario.nombre} ${m.usuario.apellido}`
      }))

      setMedicosTodos(todos)
      setMedicosDisp(disponibles)
    } catch {
      toast.error("Error al cargar médicos")
    } finally {
      setLoadingMedicos(false)
    }
  }

  useEffect(() => {
    fetchVisitas(true)
    fetchMedicos()
  }, [])

  // 🔄 Cambiar estado de visita
  const toggleEstado = async (row: Visita) => {
    try {
      const nuevaVisita = { ...row, estado: !row.estado }
      await updateVisita(row.id_visita, nuevaVisita)
      toast.success("Estado actualizado")
      fetchVisitas()
    } catch {
      toast.error("Error al actualizar estado")
    }
  }

  // 💾 Guardar médico seleccionado
  const guardarMedico = async (visita: Visita, id_medico: number | null) => {
    try {
      await updateVisita(visita.id_visita, { ...visita, id_medico })
      toast.success("Médico actualizado")
      setCambiandoMedicoId(null)
      fetchVisitas()
    } catch {
      toast.error("Error al actualizar médico")
    }
  }

  // 🗑️ Eliminar visita
  const handleDelete = (v: Visita) => {
    setVisitaAEliminar(v)
    setShowConfirm(true)
  }

  const confirmDelete = async () => {
    if (!visitaAEliminar) return
    try {
      await deleteVisita(visitaAEliminar.id_visita)
      toast.success("Visita eliminada correctamente")
      fetchVisitas()
    } catch {
      toast.error("Error al eliminar visita")
    } finally {
      setShowConfirm(false)
      setVisitaAEliminar(null)
    }
  }

  // 🔍 Filtro de búsqueda
  const filteredData = visitas.filter(v =>
    v.descripcion.toLowerCase().includes(search.toLowerCase())
  )

  // 📋 Columnas de la tabla
  const columns = [
    { name: "ID", selector: (row: Visita) => row.id_visita, sortable: true, width: "80px" },
    { name: "Fecha", selector: (row: Visita) => row.fecha_visita, sortable: true, cell: (row: Visita) => new Date(row.fecha_visita).toLocaleDateString("es-CO") },
    { name: "Descripción", selector: (row: Visita) => row.descripcion, sortable: true, grow: 2 },
    { name: "Teléfono", selector: (row: Visita) => row.telefono, sortable: true },
    {
      name: "Estado",
      cell: (row: Visita) => (
        <button
          onClick={() => toggleEstado(row)}
          className={`px-3 py-1 rounded-full text-sm font-semibold border transition ${row.estado ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"}`}
        >
          {row.estado ? "Activo" : "Inactivo"}
        </button>
      ),
      sortable: true,
      center: true
    },
    {
  name: "Médico",
  cell: (row: Visita) => {
    const actual = medicosTodos.find(m => m.value === row.medico_id)

    // 🔄 Modo edición: mostramos el Select
    if (cambiandoMedicoId === row.id_visita) {
      return (
        <Select
          autoFocus
          defaultValue={actual || null}
          options={medicosDisp}
          onChange={opt => guardarMedico(row, opt?.value ?? null)}
          onBlur={() => setCambiandoMedicoId(null)}
          placeholder="Seleccione un médico"
          isClearable
          className="w-56 text-sm"
          noOptionsMessage={() => "No hay médicos disponibles"}
        />
      )
    }

    // 👁️ Modo visual: nombre + ícono de editar
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">
          {actual?.label ?? <span className="italic text-gray-400">Sin asignar</span>}
        </span>
        <button
          onClick={() => setCambiandoMedicoId(row.id_visita)}
          disabled={loadingMedicos || medicosDisp.length === 0}
          className="text-blue-500 hover:text-blue-700 transition-colors"
          title="Cambiar médico"
        >
          <FiEdit3 className="w-4 h-4" />
        </button>
      </div>
    )
  },
  center: true
},
    {
      name: "Acciones",
      cell: (row: Visita) => (
        <div className="flex gap-2 p-2">
          <div onClick={() => { setVisita(row); setDetalles(true) }}><BtnLeer /></div>
          <div onClick={() => { setVisita(row); setForm(true) }}><BtnEditar /></div>
          <div onClick={() => handleDelete(row)}><BtnEliminar /></div>
        </div>
      ),
      button: true,
      minWidth: "180px"
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center w-full px-4 py-8 bg-blue-50">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl p-4 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-600 flex items-center">
            <HiOutlineClipboardList className="w-10 h-auto text-blue-600 mr-4" />
            Visitas
          </h2>
          <input
            type="text"
            placeholder="Buscar por descripción..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div onClick={() => { setVisita(null); setForm(true) }}>
            <BtnAgregar verText={true} />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          noDataComponent="No hay visitas disponibles"
          progressPending={loadingMedicos}
        />
      </div>

      {form && <FormularioVisitas visita={visita} setForm={setForm} onSuccess={fetchVisitas} />}
      {detalles && <DetallesVisita visita={visita} setDetalles={setDetalles} />}

      <ConfirmDialog
        show={showConfirm}
        message={`¿Eliminar la visita con ID ${visitaAEliminar?.id_visita}?`}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default DataTableVisitas