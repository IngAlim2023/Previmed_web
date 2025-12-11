import React, { useEffect, useState } from "react"
import { createBeneficio, updateBeneficio } from "../../services/beneficios"
import BtnAgregar from "../botones/BtnAgregar"
import BtnCancelar from "../botones/BtnCancelar"
import { Beneficio } from "../../interfaces/beneficios"

interface Props {
  beneficio?: Beneficio | null
  setShowForm: (v: boolean) => void
  onSuccess: (saved?: Beneficio) => void
}

const FormBeneficio: React.FC<Props> = ({ beneficio, setShowForm, onSuccess }) => {
  const [form, setForm] = useState<Beneficio>({ tipo_beneficio: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (beneficio) setForm(beneficio)
  }, [beneficio])

  // ✏️ Manejar cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 💾 Guardar beneficio
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!form.tipo_beneficio.trim()) return

    setIsSaving(true)
    try {
      let saved: Beneficio
      if (beneficio && beneficio.id_beneficio) {
        saved = await updateBeneficio(beneficio.id_beneficio, form)
      } else {
        saved = await createBeneficio(form)
      }

      // ✅ Solo notificamos si realmente se guardó
      if (saved) onSuccess(saved)
    } catch (error) {
      console.error("Error al guardar beneficio:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // ❌ Cancelar sin submit ni toast
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault() // 🔥 Evita que el form se dispare
    setClosing(true)
    setTimeout(() => setShowForm(false), 250)
  }

  return (
    <div
      className={`transition-all duration-300 ${
        closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <form onSubmit={handleSubmit} className="grid gap-4 bg-white rounded-xl">
        {/* Campo tipo de beneficio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tipo de beneficio
          </label>
          <input
            type="text"
            name="tipo_beneficio"
            value={form.tipo_beneficio}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Ej: Atención médica a domicilio"
            required
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          {/* ❌ Cancelar sin toast ni submit */}
          <div onClick={handleCancel}>
            <BtnCancelar />
          </div>

          {/* 💾 Guardar / Actualizar */}
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

export default FormBeneficio
