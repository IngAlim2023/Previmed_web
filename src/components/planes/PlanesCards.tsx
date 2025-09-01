import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Plan } from "../../interfaces/planes"
import { getPlanes, deletePlan } from "../../services/planes"
import { useNavigate } from "react-router-dom"

import BtnEditar from "../botones/BtnEditar"
import BtnEliminar from "../botones/BtnEliminar"

const PlanesCards: React.FC = () => {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [search, setSearch] = useState("")
  const [modalDetalles, setModalDetalles] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchPlanes = async () => {
    try {
      setLoading(true)
      const data = await getPlanes()
      setPlanes(Array.isArray(data.msj) ? data.msj : [])
    } catch (error) {
      console.error("Error al cargar planes:", error)
      toast.error("Error al cargar planes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlanes()
  }, [])

  const handleDelete = async (idPlan: number, tipoPlan: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el plan "${tipoPlan}"?`)) {
      try {
        await deletePlan(idPlan)
        toast.success("Plan eliminado correctamente")
        fetchPlanes()
      } catch (error) {
        toast.error("Error al eliminar el plan")
      }
    }
  }

  const handleEdit = (idPlan: number) => {
    navigate(`/planes/editar/${idPlan}`)
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numPrice)
  }

  const filteredData = planes.filter((plan) => {
    const searchTerm = search.toLowerCase()
    return (
      plan.tipoPlan.toLowerCase().includes(searchTerm) ||
      plan.descripcion.toLowerCase().includes(searchTerm) ||
      plan.precio.toString().includes(searchTerm)
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
      <input
        type="text"
        placeholder="Buscar por tipo de plan, descripción o precio..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-lg mb-6 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No hay planes disponibles</div>
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="mt-2 text-blue-500 hover:text-blue-700"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((plan) => (
            <div
              key={plan.idPlan}
              className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
              onClick={() => setModalDetalles(plan)}
            >
              {/* Header de la card */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-start mb-2">
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
                
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPrice(plan.precio)}
                </div>
              </div>

              {/* Body de la card */}
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {plan.descripcion}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {plan.cantidadBeneficiarios}
                    </div>
                    <div className="text-xs text-gray-500">Beneficiarios</div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ID: {plan.idPlan}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
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
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {modalDetalles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Detalles del Plan</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Tipo de Plan</label>
                <p className="text-lg font-semibold text-gray-800">{modalDetalles.tipoPlan}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Descripción</label>
                <p className="text-gray-700 leading-relaxed">{modalDetalles.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Precio</label>
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(modalDetalles.precio)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Beneficiarios</label>
                  <p className="text-xl font-bold text-gray-800">
                    {modalDetalles.cantidadBeneficiarios}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Estado</label>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    modalDetalles.estado
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {modalDetalles.estado ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">ID del Plan</label>
                <p className="font-mono text-gray-800">{modalDetalles.idPlan}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <div 
                onClick={() => {
                  setModalDetalles(null)
                  handleEdit(modalDetalles.idPlan)
                }}
                className="flex-1"
              >
                <BtnEditar />
              </div>
              <button
                onClick={() => setModalDetalles(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
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

export default PlanesCards
