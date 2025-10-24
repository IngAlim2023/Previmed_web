import React, { useEffect, useState } from "react"
import Select, { components } from "react-select"
import { Membresia, NuevoContratoForm, Plan } from "../../interfaces/interfaces"
import { createContrato, updateContrato, getContratos } from "../../services/contratos"
import toast from "react-hot-toast"

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
    numero_contrato: `CT-${Date.now()}`, // 🧾 Por defecto, autogenerado
    fecha_inicio: "",
    fecha_fin: "",
    plan_id: planes.length ? planes[0].idPlan : 1,
    paciente_id: 0,
    estado: true,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [closing, setClosing] = useState(false)
  const [manualNumero, setManualNumero] = useState(false)
  const [titulares, setTitulares] = useState<
    { value: number; label: string; tieneContrato: boolean }[]
  >([])

  // 🔄 Cargar datos si es edición
  useEffect(() => {
    if (contrato) {
      setForm({
        firma: contrato.firma,
        forma_pago: contrato.formaPago,
        numero_contrato: contrato.numeroContrato,
        fecha_inicio: contrato.fechaInicio.split("T")[0],
        fecha_fin: contrato.fechaFin.split("T")[0],
        plan_id: contrato.plan?.idPlan || contrato.planId || 1,
        paciente_id: contrato.membresiaPaciente?.[0]?.pacienteId || 0,
        estado: contrato.estado,
      })
      setManualNumero(true) // Si viene de edición, se asume que puede ser manual
    }
  }, [contrato, planes])

  // 🔹 Cargar titulares
  useEffect(() => {
    const fetchTitulares = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL_BACK}pacientes`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        const raw = await res.json()
        const pacientes = Array.isArray(raw.data) ? raw.data : []

        const titulares = pacientes.filter((p: any) => p.pacienteId === null)

        const contratos = await getContratos()
        const titularesConContratoSet = new Set<number>()
        contratos.forEach((m: any) => {
          m.membresiaPaciente?.forEach((mp: any) => {
            const idPaciente = mp.paciente?.idPaciente
            if (idPaciente) titularesConContratoSet.add(idPaciente)
          })
        })

        const opciones = titulares.map((p: any) => ({
          value: p.idPaciente,
          label: `${p.usuario?.nombre ?? ""} ${p.usuario?.apellido ?? ""} - ${
            p.usuario?.numeroDocumento ?? "Sin documento"
          }`,
          tieneContrato: titularesConContratoSet.has(p.idPaciente),
        }))

        setTitulares(opciones)
      } catch (err) {
        console.error("❌ Error cargando titulares:", err)
        toast.dismiss()
        toast.error("Error al cargar titulares", { duration: 1000 })
      }
    }

    fetchTitulares()
  }, [])

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
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!form.paciente_id || form.paciente_id === 0) {
      toast.dismiss()
      toast.error("Selecciona un titular antes de continuar", { duration: 1000 })
      return
    }

    if (!form.numero_contrato.trim()) {
      toast.dismiss()
      toast.error("El número de contrato es obligatorio", { duration: 1000 })
      return
    }

    setIsSaving(true)
    try {
      const saved = contrato
        ? await updateContrato(contrato.idMembresia, form)
        : await createContrato(form)

      toast.dismiss()
      toast.success(
        contrato ? "Contrato actualizado ✅" : "Contrato creado 🎉",
        { duration: 1000 }
      )

      onSuccess(saved)
      handleClose()
    } catch (error: any) {
      console.error(error)
      toast.dismiss()
      toast.error("Error al guardar contrato ", { duration: 1000 })
    } finally {
      setIsSaving(false)
    }
  }

  // ✨ Cerrar modal
  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setShowForm(false)
      setClosing(false)
    }, 250)
  }

  // 🎨 Custom Option para titulares
  const Option = (props: any) => (
    <components.Option {...props}>
      <div
        className="flex items-center gap-2"
        title={props.data.tieneContrato ? "Ya tiene contrato" : "Disponible"}
      >
        <span
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            props.data.tieneContrato
              ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]"
              : "bg-gray-300"
          }`}
        />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  )

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      <div
        className="flex items-center gap-2"
        title={props.data.tieneContrato ? "Ya tiene contrato" : "Disponible"}
      >
        <span
          className={`w-3 h-3 rounded-full ${
            props.data.tieneContrato
              ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]"
              : "bg-gray-300"
          }`}
        />
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  )

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
        {/* Titular */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Titular
          </label>
          <Select
            options={titulares}
            value={titulares.find((t) => t.value === form.paciente_id) || null}
            onChange={(selected) =>
              setForm((prev) => ({
                ...prev,
                paciente_id: selected ? selected.value : 0,
              }))
            }
            placeholder="Buscar y seleccionar titular..."
            isClearable
            isSearchable
            className="text-sm"
            components={{ Option, SingleValue }}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "8px",
                borderColor: "#d1d5db",
                boxShadow: "none",
              }),
            }}
          />
        </div>

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

        {/* Toggle Manual */}
        <div className="col-span-2 flex items-center gap-2 mt-2">
          <input
            id="manualNumero"
            type="checkbox"
            checked={manualNumero}
            onChange={(e) => {
              setManualNumero(e.target.checked)
              if (!e.target.checked) {
                setForm((prev) => ({
                  ...prev,
                  numero_contrato: `CT-${Date.now()}`,
                }))
              }
            }}
            className="w-4 h-4 accent-blue-600"
          />
          <label htmlFor="manualNumero" className="text-sm text-gray-700">
            Es un contrato antiguo (ingresar número manualmente)
          </label>
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
            className={`border rounded-lg px-3 py-2 w-full ${
              manualNumero ? "bg-white" : "bg-gray-100 text-gray-600"
            } focus:ring focus:ring-blue-200`}
            readOnly={!manualNumero}
            placeholder={
              manualNumero ? "Ej: CT-000123 (ingrésalo manualmente)" : ""
            }
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
