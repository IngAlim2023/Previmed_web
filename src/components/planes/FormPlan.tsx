import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { Plan, NuevoPlanForm } from "../../interfaces/planes"
import { createPlan, updatePlan, getPlanById } from "../../services/planes"

const FormPlan: React.FC = () => {
  const navigate = useNavigate()
  const { idPlan } = useParams<{ idPlan?: string }>()
  const isEditing = Boolean(idPlan)

  const [formData, setFormData] = useState<NuevoPlanForm>({
    tipoPlan: "",
    descripcion: "",
    precio: "",
    estado: true,
    cantidadBeneficiarios: 1
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)

  useEffect(() => {
    if (isEditing && idPlan) {
      const fetchPlan = async () => {
        try {
          setLoadingData(true)
          const response = await getPlanById(Number(idPlan))
          const plan: Plan = response.msj
          setFormData({
            tipoPlan: plan.tipoPlan,
            descripcion: plan.descripcion,
            precio: plan.precio,
            estado: plan.estado,
            cantidadBeneficiarios: plan.cantidadBeneficiarios
          })
        } catch (error) {
          console.error("Error al cargar plan:", error)
          toast.error("Error al cargar los datos del plan")
          navigate("/planes")
        } finally {
          setLoadingData(false)
        }
      }
      fetchPlan()
    }
  }, [idPlan, isEditing, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tipoPlan || !formData.descripcion || !formData.precio || formData.cantidadBeneficiarios <= 0) {
      toast.error("Debes completar todos los campos obligatorios")
      return
    }

    if (parseFloat(formData.precio) <= 0) {
      toast.error("El precio debe ser mayor a 0")
      return
    }

    try {
      setLoading(true)
      if (isEditing && idPlan) {
        await updatePlan(Number(idPlan), formData)
        toast.success("Plan actualizado con éxito")
      } else {
        await createPlan(formData)
        toast.success("Plan creado con éxito")
      }
      navigate("/planes")
    } catch (error) {
      console.error("Error al guardar plan:", error)
      toast.error("Error al guardar el plan")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : type === "number" 
        ? Number(value)
        : value
    }))
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del plan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditing ? "Editar Plan" : "Crear Nuevo Plan"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Plan *
            </label>
            <input
              type="text"
              name="tipoPlan"
              value={formData.tipoPlan}
              onChange={handleChange}
              placeholder="Ej: Básico, Premium, Familiar"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe los beneficios y características del plan..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiarios *
              </label>
              <input
                type="number"
                name="cantidadBeneficiarios"
                value={formData.cantidadBeneficiarios}
                onChange={handleChange}
                placeholder="1"
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Plan activo
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/planes")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Guardando..." : isEditing ? "Actualizar Plan" : "Crear Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormPlan
