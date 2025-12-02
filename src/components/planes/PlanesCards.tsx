import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Plan } from "../../interfaces/planes"
import { getPlanes, deletePlan } from "../../services/planes"
import { useNavigate } from "react-router-dom"
import BtnEditar from "../botones/BtnEditar"
import BtnEliminar from "../botones/BtnEliminar"
import BtnCancelar from "../botones/BtnCancelar"
import DetallesPlan from "./DetallesPlan"

const PlanesCards: React.FC = () => {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [search, setSearch] = useState("")
  const [modalDetalles, setModalDetalles] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const navigate = useNavigate()

  // 🔹 Cargar planes (ordenados del más antiguo al más nuevo)
  const fetchPlanes = async () => {
    try {
      setLoading(true)
      const data = await getPlanes()

      // ✅ Ordenar por ID ascendente para que el más nuevo quede al final
      const planesOrdenados = Array.isArray(data)
        ? [...data].sort((a, b) => a.idPlan - b.idPlan)
        : []

      setPlanes(planesOrdenados)
    } catch (error) {
      toast.error("Error al cargar planes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlanes()
  }, [])

  // 🔹 Eliminar plan
  const handleDelete = async (idPlan: number, tipoPlan: string) => {
    toast.dismiss()
    toast(
      (t) => (
        <div className="text-center px-2">
          <p className="font-semibold text-gray-800 mb-3">
            ¿Deseas eliminar el plan “{tipoPlan}”?
          </p>
          <div className="flex justify-center gap-3 mt-2">
            <div
              onClick={async () => {
                toast.dismiss(t.id)
                try {
                  await deletePlan(idPlan)
                  setPlanes((prev) => prev.filter((p) => p.idPlan !== idPlan))
                  toast.success("Plan eliminado correctamente ✅", {
                    duration: 1200,
                  })
                } catch {
                  toast.error("Error al eliminar el plan", { duration: 1000 })
                }
              }}
            >
              <BtnEliminar />
            </div>
            <div onClick={() => toast.dismiss(t.id)}>
              <BtnCancelar />
            </div>
          </div>
        </div>
      ),
      { duration: 4000 }
    )
  }

  // 🔹 Editar plan
  const handleEdit = (idPlan: number) => navigate(`/planes/editar/${idPlan}`)

  // 🔹 Formatear precios
  const formatPrice = (price: string) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(parseFloat(price))

  // 🔹 Filtro de búsqueda
  const filteredData = planes.filter((plan) => {
    const s = search.toLowerCase()
    return (
      plan.tipoPlan.toLowerCase().includes(s) ||
      plan.descripcion.toLowerCase().includes(s) ||
      plan.precio.toString().includes(s)
    )
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="Buscar por tipo de plan, descripción o precio..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-lg mb-6 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {/* 🧾 Cards */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No hay planes disponibles</div>
          {search && (
            <div onClick={() => setSearch("")}>
              <BtnCancelar />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((plan) => {
            const beneficiosRaw = (plan as any).planXBeneficios || []
            // Deduplicación por id de beneficio para evitar repetidos
            const beneficiosMap = new Map(
              beneficiosRaw.map((b: any) => {
                const id =
                  b.beneficio?.idBeneficio ??
                  b.beneficio?.id_beneficio ??
                  b.beneficioId ??
                  b.beneficio_id ??
                  `${plan.idPlan}-${Math.random()}`
                return [id, b]
              })
            )
            const beneficios = Array.from(beneficiosMap.values())
            const isExpanded = expandedCard === plan.idPlan
            const beneficiosMostrar = isExpanded
              ? beneficios
              : beneficios.slice(0, 2)
            const beneficiosRestantes = beneficios.length - beneficiosMostrar.length

            return (
              <div
                key={plan.idPlan}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                onClick={() => setModalDetalles(plan)}
              >
                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {plan.tipoPlan}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.estado
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {plan.estado ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {plan.descripcion}
                  </p>
                </div>

                {/* Cuerpo del card */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Precio y beneficiarios */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Precio</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatPrice(plan.precio)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs uppercase">
                        Beneficiarios
                      </p>
                      <p className="text-xl font-semibold text-gray-800">
                        {plan.cantidadBeneficiarios}
                      </p>
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div className="bg-gray-50 rounded-lg p-3 transition-all duration-300">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Beneficios:
                    </p>

                    {beneficios.length > 0 ? (
                      <>
                        <ul
                          className={`list-disc list-inside text-gray-600 text-sm space-y-1 transition-all duration-300 ${
                            isExpanded ? "max-h-40 overflow-y-auto" : "max-h-20"
                          }`}
                        >
                          {beneficiosMostrar.map((b: any, i: number) => (
                            <li key={`${plan.idPlan}-${i}`}>
                              {b.beneficio?.tipoBeneficio ??
                                b.beneficio?.tipo_beneficio ??
                                "—"}
                            </li>
                          ))}
                        </ul>

                        {beneficios.length > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedCard(isExpanded ? null : plan.idPlan)
                            }}
                            className="text-blue-600 text-sm font-medium mt-2 hover:underline"
                          >
                            {isExpanded
                              ? "Ver menos"
                              : `Ver más (${beneficiosRestantes})`}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Sin beneficios asignados.
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones acción */}
                <div className="flex justify-end gap-2 px-5 py-4 bg-gray-50 rounded-b-2xl">
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(plan.idPlan)
                    }}
                  >
                    <BtnEditar />
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(plan.idPlan, plan.tipoPlan)
                    }}
                  >
                    <BtnEliminar />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal detalles */}
      {modalDetalles && (
        <DetallesPlan plan={modalDetalles} setShowDetalles={setModalDetalles} />
      )}
    </div>
  )
}

export default PlanesCards
