import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import toast from "react-hot-toast"
import { useAuthContext } from "../../context/AuthContext"
import { Visita } from "../../interfaces/visitas"
import { getVisitasPorMedico } from "../../services/visitasService"
import { medicoService } from "../../services/medicoService"
import { useNavigate } from "react-router-dom"
import BtnCerrar from "../../components/botones/BtnCerrar"

const VisitasPorMedico: React.FC = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(false)
  const [idMedico, setIdMedico] = useState<number | null>(null)
  const [visitaActiva, setVisitaActiva] = useState<string | null>(localStorage.getItem("visita_activa"))

  const RAW_URL = String(import.meta.env.VITE_URL_BACK || "")
  const API_URL = RAW_URL.replace(/\/+$/, "")

  // 🔹 Paso 1: obtener el id_medico según el usuario logueado
  useEffect(() => {
    const fetchMedico = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        toast.loading("Cargando información del médico...", { id: "medico" })

        const medico = await medicoService.getByUsuarioId(user.id)
        if (!medico) {
          toast.error("No se encontró información del médico", { id: "medico" })
          return
        }

        setIdMedico(medico.id_medico)
        toast.success("Médico identificado correctamente", { id: "medico" })
      } catch (error) {
        console.error("🚨 Error en fetchMedico:", error)
        toast.error("Error al obtener información del médico", { id: "medico" })
      } finally {
        toast.dismiss("medico")
        setLoading(false)
      }
    }

    fetchMedico()
  }, [user])

  // 🔹 Paso 2: obtener las visitas del médico
  useEffect(() => {
    const fetchVisitas = async () => {
      if (!idMedico) return

      try {
        setLoading(true)
        toast.loading("Cargando visitas del médico...", { id: "visitas" })

        const data = await getVisitasPorMedico(idMedico)
        const activas = data.filter((v) => v.estado === true)
        setVisitas(activas)

        toast.success("Visitas cargadas correctamente", { id: "visitas" })
      } catch (error) {
        console.error("Error al cargar visitas:", error)
        toast.error("Error al cargar las visitas", { id: "visitas" })
      } finally {
        toast.dismiss("visitas")
        setLoading(false)
      }
    }

    fetchVisitas()
  }, [idMedico])

  // 🔹 Escuchar cambios globales del localStorage (sincroniza con HomeMedico)
  useEffect(() => {
    const handleStorageChange = () => {
      setVisitaActiva(localStorage.getItem("visita_activa"))
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // 🔹 Manejar inicio o finalización de visita
  const handleToggleVisita = async (idVisita: number) => {
    const visitaEnCurso = localStorage.getItem("visita_activa")

    try {
      if (!visitaEnCurso) {
        // ✅ Iniciar visita
        localStorage.setItem("visita_activa", idVisita.toString())
        window.dispatchEvent(new Event("storage")) // sincroniza Home
        toast.success(`Visita #${idVisita} iniciada`)
      } else if (visitaEnCurso === idVisita.toString()) {
        // ✅ Finalizar visita
        const res = await fetch(`${API_URL}/visitas/${idVisita}`.replace(/([^:]\/)\/+/g, "$1"), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: false }),
        })

        if (!res.ok) throw new Error("Error al finalizar la visita")

        localStorage.removeItem("visita_activa")
        window.dispatchEvent(new Event("storage"))
        setVisitas((prev) => prev.filter((v) => v.id_visita !== idVisita))
        toast.success("🩺 Visita finalizada y enviada al historial")
      } else {
        toast.error("Ya tienes otra visita activa")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error al actualizar la visita")
    }
  }

  // 🔹 Columnas de la tabla
  const columns = [
    { name: "ID", selector: (row: Visita) => row.id_visita, sortable: true },
    {
      name: "Fecha",
      selector: (row: Visita) =>
        new Date(row.fecha_visita).toLocaleDateString("es-CO"),
      sortable: true,
    },
    { name: "Descripción", selector: (row: Visita) => row.descripcion },
    { name: "Dirección", selector: (row: Visita) => row.direccion },
    { name: "Teléfono", selector: (row: Visita) => row.telefono },
    {
      name: "Estado",
      selector: (row: Visita) => (row.estado ? "Activa" : "Finalizada"),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: Visita) => {
        const esActiva = visitaActiva === row.id_visita.toString()
        return (
          <button
            onClick={() => handleToggleVisita(row.id_visita)}
            className={`px-3 py-1 rounded-md text-white font-semibold transition-all ${
              esActiva
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {esActiva ? "Finalizar Visita" : "Iniciar Visita"}
          </button>
        )
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 py-10 px-4">
      <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            📋 Mis Visitas Activas
          </h2>

          {/* 🔹 Botón personalizado para volver */}
          <div onClick={() => navigate(-1)}>
            <BtnCerrar text="Volver" />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={visitas}
          pagination
          progressPending={loading}
          striped
          highlightOnHover
          noDataComponent="No hay visitas activas registradas para este médico"
        />
      </div>
    </div>
  )
}

export default VisitasPorMedico
