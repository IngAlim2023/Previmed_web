import { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import toast from "react-hot-toast"
import { useAuthContext } from "../../context/AuthContext"
import { Visita } from "../../interfaces/visitas"
import { getVisitasPorMedico } from "../../services/visitasService"
import { medicoService } from "../../services/medicoService"
import { useNavigate } from "react-router-dom"
import BtnCerrar from "../../components/botones/BtnCerrar"

//Probar Socket.io Borrar cuando este implementado:
import socket from "../../services/socket";

const VisitasPorMedico: React.FC = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()


  const[notificacion, setNotificacion] =useState<boolean>(false);

  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(false)
  const [idMedico, setIdMedico] = useState<number | null>(null)
  const [visitaActiva, setVisitaActiva] = useState<string | null>(
    localStorage.getItem("visita_activa")
  )

  const RAW_URL = String(import.meta.env.VITE_URL_BACK || "")
  const API_URL = RAW_URL.replace(/\/+$/, "")

  socket.on('solicitud visita',()=>{
    setNotificacion(!notificacion)
  })
  // 🔹 Paso 1: obtener el id_medico según el usuario logueado
  /** ===========================================================
   * 1️⃣ Obtener el ID del médico según el usuario logueado
   * =========================================================== **/
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

  /** ===========================================================
   * 2️⃣ Obtener las visitas del médico
   * =========================================================== **/
  const fetchVisitas = async () => {
    if (!idMedico) return
    try {
      setLoading(true)
      const data = await getVisitasPorMedico(idMedico)
      const activas = data.filter((v) => v.estado === true)
      setVisitas(activas)
    } catch (error) {
      console.error("Error al cargar visitas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitas()
  }, [idMedico, notificacion])

  /** ===========================================================
   * 4️⃣ Canal Broadcast — sincronización bidireccional
   * =========================================================== **/
  useEffect(() => {
    const channel = new BroadcastChannel("visitas_channel")

    // Escuchar mensajes desde móvil o web
    channel.onmessage = (event) => {
      console.log("🔄 Mensaje recibido en BroadcastChannel:", event.data)
      if (event.data?.type === "VISITA_UPDATE") {
        setVisitaActiva(localStorage.getItem("visita_activa"))
        fetchVisitas()
      }
    }

    // También escuchar cambios en localStorage (por si no hay canal)
    const handleStorageChange = () => {
      setVisitaActiva(localStorage.getItem("visita_activa"))
      fetchVisitas()
    }
    window.addEventListener("storage", handleStorageChange)

    return () => {
      channel.close()
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  /** ===========================================================
   * 5️⃣ Iniciar o finalizar visita (actualiza backend + sincroniza)
   * =========================================================== **/
  const handleToggleVisita = async (idVisita: number) => {
    const visitaEnCurso = localStorage.getItem("visita_activa")
    const channel = new BroadcastChannel("visitas_channel")

    try {
      if (!idMedico) throw new Error("No se encontró el ID del médico")

      if (!visitaEnCurso) {
        // ✅ Iniciar visita
        localStorage.setItem("visita_activa", idVisita.toString())
        channel.postMessage({ type: "VISITA_UPDATE", idVisita, estado: "iniciada" })
        window.dispatchEvent(new Event("storage"))

        await medicoService.update(idMedico, {
          disponibilidad: true,
          estado: false,
        })

        toast.success(`🩺 Visita #${idVisita} iniciada — Médico ahora está ocupado`)
      } else if (visitaEnCurso === idVisita.toString()) {
        // ✅ Finalizar visita
        const res = await fetch(
          `${API_URL}/visitas/${idVisita}`.replace(/([^:]\/)\/+/g, "$1"),
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: false }),
          }
        )

        if (!res.ok) throw new Error("Error al finalizar la visita")

        localStorage.removeItem("visita_activa")
        channel.postMessage({ type: "VISITA_UPDATE", idVisita, estado: "finalizada" })
        window.dispatchEvent(new Event("storage"))

        setVisitas((prev) => prev.filter((v) => v.id_visita !== idVisita))

        await medicoService.update(idMedico, {
          disponibilidad: true,
          estado: true,
        })

        toast.success("✅ Visita finalizada — Médico disponible nuevamente")
      } else {
        toast.error("Ya tienes otra visita activa")
      }

      // 🔁 Refrescar la tabla después del cambio
      await fetchVisitas()
    } catch (error) {
      console.error("Error al manejar visita:", error)
      toast.error("Error al actualizar la visita o el estado del médico")
    } finally {
      channel.close()
    }
  }

  /** ===========================================================
   * 6️⃣ Configurar columnas de la tabla
   * =========================================================== **/
  const columns = [
    { name: "ID", selector: (row: Visita) => row.id_visita ?? "", sortable: true },
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
        const esActiva =
          row.id_visita !== undefined &&
          visitaActiva === row.id_visita.toString()
        return (
          <button
            onClick={() => {
              if (typeof row.id_visita === "number") {
                handleToggleVisita(row.id_visita)
              } else {
                toast.error("ID de visita no válido")
              }
            }}
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

  /** ===========================================================
   * 7️⃣ Render del componente
   * =========================================================== **/
  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 py-10 px-4">
      <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            📋 Mis Visitas Activas
          </h2>

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
