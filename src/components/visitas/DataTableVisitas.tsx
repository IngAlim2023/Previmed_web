import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import toast from "react-hot-toast"
import { Visita } from "../../interfaces/visitas"
import { getVisitas, deleteVisita } from  "../../services/visitasService"
import BtnLeer from "../botones/BtnLeer"
import BtnEditar from "../botones/BtnEditar"
import BtnEliminar from "../botones/BtnEliminar"
import BtnAgregar from "../botones/BtnAgregar"
import FormularioVisitas from "./FormularioVisitas"
import DetallesVisita from "./DetallesVisita"
import ConfirmDialog from "./ConfirmDialog"
import { HiOutlineClipboardList } from "react-icons/hi"

const EstadoBadge: React.FC<{ estado: boolean }> = ({ estado }) => (
  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
    estado ? "bg-green-100 text-green-700 border border-green-200"
           : "bg-red-100 text-red-700 border border-red-200"}`}>
    {estado ? "Activo" : "Inactivo"}
  </span>
)

const DataTableVisitas: React.FC = () => {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [search, setSearch] = useState("")
  const [form, setForm] = useState(false)
  const [detalles, setDetalles] = useState(false)
  const [visita, setVisita] = useState<Visita | null>(null)

  const [showConfirm, setShowConfirm] = useState(false)
  const [visitaAEliminar, setVisitaAEliminar] = useState<Visita | null>(null)

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
      // 🔴 Aquí cerramos el loader si quedó abierto
      toast.dismiss("visitas-toast")
    }
  }

  useEffect(() => {
    fetchVisitas(true)
  }, [])

  const handleDelete = (v: Visita) => {
    setVisitaAEliminar(v)
    setShowConfirm(true)
  }

  const confirmDelete = async () => {
    if (visitaAEliminar) {
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
  }

  const filteredData = visitas.filter((v) =>
    v.descripcion.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { name: "ID", selector: (row: Visita) => row.id_visita, sortable: true },
    { name: "Fecha", selector: (row: Visita) => row.fecha_visita, sortable: true },
    { name: "Descripción", selector: (row: Visita) => row.descripcion, sortable: true },
    { name: "Teléfono", selector: (row: Visita) => row.telefono, sortable: true },
    { name: "Estado", selector: (row: Visita) => row.estado,
      cell: (row: Visita) => <EstadoBadge estado={row.estado} />, sortable: true },
    {
      name: "Acciones",
      cell: (row: Visita) => (
        <div className="flex gap-2 p-2">
          <div onClick={() => { setVisita(row); setDetalles(true) }}>
            <BtnLeer />
          </div>
          <div onClick={() => { setVisita(row); setForm(true) }}>
            <BtnEditar />
          </div>
          <div onClick={() => handleDelete(row)}>
            <BtnEliminar />
          </div>
        </div>
      ),
      button: true, minWidth: "180px"
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
            type="text" placeholder="Buscar por descripción..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-sm p-2 border border-gray-300 rounded-xl focus:outline-none"
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
