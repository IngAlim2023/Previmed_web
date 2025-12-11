import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { NuevoPlanForm } from "../../interfaces/planes"
import { createPlan, updatePlan, getPlanById } from "../../services/planes"
import { getBeneficios } from "../../services/beneficios"
import { getPlanBeneficioById } from "../../services/planxbeneficios"
import { Beneficio } from "../../interfaces/beneficios"
import BtnAgregar from "../botones/BtnAgregar"
import BtnCancelar from "../botones/BtnCancelar"

const FormPlan: React.FC = () => {
  const navigate = useNavigate()
  const { idPlan } = useParams<{ idPlan?: string }>()
  const isEditing = Boolean(idPlan)

  const [formData, setFormData] = useState<NuevoPlanForm>({
    tipoPlan: "",
    descripcion: "",
    precio: "",
    estado: true,
    cantidadBeneficiarios: 1,
    beneficios: [],
  })

  const [beneficios, setBeneficios] = useState<Beneficio[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [closing, setClosing] = useState(false)

  // 🔹 Cargar beneficios y plan (si aplica)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)

        // 🔸 1️⃣ Obtener beneficios disponibles
        const benefData = await getBeneficios()
        setBeneficios(benefData)

        // 🔸 2️⃣ Si se edita, obtener el plan y sus beneficios asociados
        if (isEditing && idPlan) {
          const planData = await getPlanById(Number(idPlan))
          const relaciones = await getPlanBeneficioById(Number(idPlan))

          const beneficiosIds = relaciones.map(
            (r) => r.beneficio_id ?? r.beneficioId
          )

          setFormData({
            tipoPlan: planData.tipoPlan,
            descripcion: planData.descripcion,
            precio: planData.precio.toString(),
            estado: planData.estado,
            cantidadBeneficiarios: planData.cantidadBeneficiarios,
            beneficios: beneficiosIds,
          })
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error)
        toast.error("No se pudieron cargar los datos del plan")
        navigate("/planes")
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [idPlan, isEditing, navigate])

  // ✏️ Manejar cambios en inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "precio"
          ? value.replace(/[^\d.]/g, "")
          : type === "number"
          ? Number(value)
          : value,
    }))
  }

  // 🔹 Activar o desactivar beneficios (checkbox)
  const toggleBeneficio = (id: number) => {
    setFormData((prev) => {
      const selected = prev.beneficios.includes(id)
      return {
        ...prev,
        beneficios: selected
          ? prev.beneficios.filter((b) => b !== id)
          : [...prev.beneficios, id],
      }
    })
  }

  // 💾 Guardar o actualizar plan
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!formData.tipoPlan || !formData.descripcion || !formData.precio) {
      toast.error("Debes completar todos los campos obligatorios")
      return
    }

    if (parseFloat(formData.precio) <= 0) {
      toast.error("El precio debe ser mayor a 0")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        ...formData,
        beneficios: formData.beneficios.map(Number),
      }

      if (isEditing && idPlan) {
        await updatePlan(Number(idPlan), payload)
        toast.success("Plan actualizado con éxito")
      } else {
        await createPlan(payload)
        toast.success("Plan creado con éxito")
      }

      navigate("/planes")
    } catch (error) {
      console.error("Error al guardar plan:", error)
      toast.error("Error al guardar el plan")
    } finally {
      setIsSaving(false)
    }
  }

  // ❌ Cancelar acción
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    setClosing(true)
    setTimeout(() => navigate("/planes"), 250)
  }

  // ⏳ Loader
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

  // 🎨 Interfaz principal
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-blue-50 p-6 transition-all duration-300 ${
        closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 bg-white rounded-xl shadow-lg w-full max-w-lg p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center border-b pb-2">
          {isEditing ? "Editar Plan" : "Crear Nuevo Plan"}
        </h2>

        {/* Tipo de plan */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tipo de plan
          </label>
          <input
            type="text"
            name="tipoPlan"
            value={formData.tipoPlan}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Ej: Básico, Premium, Familiar"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none resize-none"
            placeholder="Describe las características del plan..."
            required
          />
        </div>

        {/* Beneficios */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Beneficios disponibles
          </label>
          <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
            {beneficios.length > 0 ? (
              beneficios.map((b) => {
                const id = b.idBeneficio ?? b.id_beneficio
                const nombre = b.tipoBeneficio ?? b.tipo_beneficio
                return (
                  <label
                    key={id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.beneficios.includes(id!)}
                      onChange={() => toggleBeneficio(id!)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{nombre}</span>
                  </label>
                )
              })
            ) : (
              <p className="text-sm text-gray-500">
                No hay beneficios registrados.
              </p>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => navigate("/beneficios_plan/nuevo")}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              ➕ Crear nuevo beneficio
            </button>
          </div>
        </div>

        {/* Precio y beneficiarios */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Precio
            </label>
            <input
              type="text"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Ej: 150000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Beneficiarios
            </label>
            <input
              type="number"
              name="cantidadBeneficiarios"
              value={formData.cantidadBeneficiarios}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="1"
              min="1"
              required
            />
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="estado"
            checked={formData.estado}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Plan activo</label>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <div onClick={handleCancel}>
            <BtnCancelar />
          </div>
          <div
            onClick={!isSaving ? handleSubmit : undefined}
            className={`${isSaving ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <BtnAgregar />
          </div>
        </div>
      </form>
    </div>
  )
}

export default FormPlan
