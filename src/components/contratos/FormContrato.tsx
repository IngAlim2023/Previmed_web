import React, { useEffect, useState } from "react"
import { Membresia, NuevoContratoForm, Plan } from "../../interfaces/interfaces"
import { createContrato, updateContrato } from "../../services/contratos"
import toast from "react-hot-toast"

// 🧩 Botones personalizados
import BtnAgregar from "../botones/BtnAgregar"
import BtnCancelar from "../botones/BtnCancelar"

interface FormContratoProps {
  contrato?: Membresia | null
  setShowForm: (show: boolean) => void
  onSuccess: (saved?: Membresia) => void
  planes: Plan[]
}

const FormContrato: React.FC<FormContratoProps> = ({
  contrato,
  setShowForm,
  onSuccess,
  planes,
}) => {
  const [form, setForm] = useState<NuevoContratoForm>({
    firma: "",
    forma_pago: "Efectivo",
    numero_contrato: "",
    fecha_inicio: "",
    fecha_fin: "",
    plan_id: planes.length ? planes[0].idPlan : 1,
    paciente_id: 61, // ✅ fijo según tu backend
    estado: true,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [closing, setClosing] = useState(false)

  // 🔄 Cargar datos si se está editando
  useEffect(() => {
    if (contrato) {
      setForm({
        firma: contrato.firma,
        forma_pago: contrato.formaPago,
        numero_contrato: contrato.numeroContrato,
        fecha_inicio: contrato.fechaInicio.split("T")[0],
        fecha_fin: contrato.fechaFin.split("T")[0],
        plan_id: contrato.plan?.idPlan || contrato.planId || 1,
        paciente_id: contrato.membresiaPaciente?.[0]?.pacienteId || 61,
        estado: contrato.estado,
      })
    }
  }, [contrato, planes])

  // ✏️ Manejar cambios
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const isCheckbox = type === "checkbox"
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined

    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }))
  }

  // 💾 Guardar contrato
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const saved = contrato
        ? await updateContrato(contrato.idMembresia, form)
        : await createContrato(form)

      toast.success(
        contrato ? "Contrato actualizado correctamente" : "Contrato creado con éxito 🎉",
        { duration: 1500 }
      )

      onSuccess(saved)
      handleClose()
    } catch (error: any) {
      console.error(error)
      toast.error("Error al guardar el contrato", { duration: 1500 })
    } finally {
      setIsSaving(false)
    }
  }

  // ✨ Cerrar con animación suave
  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setShowForm(false)
      setClosing(false)
    }, 250)
  }

  return (
    <div
      className={`transition-all duration-300 ${
        closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white rounded-xl"
      >
        {/* Firma */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Firma
          </label>
          <input
            type="text"
            name="firma"
            value={form.firma}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
            placeholder="Ej: Daniela Usuga"
            required
          />
        </div>

        {/* Forma de Pago */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Forma de Pago
          </label>
          <select
            name="forma_pago"
            value={form.forma_pago}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Daviplata">Daviplata</option>
            <option value="Nequi">Nequi</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
        </div>

        {/* Número Contrato */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Número Contrato
          </label>
          <input
            type="text"
            name="numero_contrato"
            value={form.numero_contrato}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
            placeholder="Ej: CT-2025"
            required
          />
        </div>

        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fecha Fin
          </label>
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Plan */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Plan
          </label>
          <select
            name="plan_id"
            value={form.plan_id}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
            required
          >
            {planes.map((p) => (
              <option key={p.idPlan} value={p.idPlan}>
                {p.tipoPlan}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="estado"
            checked={form.estado}
            onChange={handleChange}
            className="mr-2 w-4 h-4 accent-blue-600"
          />
          <label className="text-sm text-gray-700">Activo</label>
        </div>

        {/* Botones */}
        <div className="col-span-2 flex justify-end gap-3 pt-4 border-t mt-4">
          <div onClick={handleClose}>
            <BtnCancelar />
          </div>
          <div
            onClick={!isSaving ? handleSubmit : undefined}
            className={`${isSaving && "opacity-60 cursor-not-allowed"}`}
          >
            <BtnAgregar />
          </div>
        </div>
      </form>
    </div>
  )
}

export default FormContrato
