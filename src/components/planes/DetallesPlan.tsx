import React, { useState, useEffect } from "react"
import BtnCerrar from "../botones/BtnCerrar"
import { HiOutlineClipboardList } from "react-icons/hi"
import { Plan } from "../../interfaces/planes"

interface Props {
  plan: Plan | null
  setShowDetalles: React.Dispatch<React.SetStateAction<Plan | null>>
}

const DetallesPlan: React.FC<Props> = ({ plan, setShowDetalles }) => {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timeout)
  }, [])

  if (!plan) return null

  // 🔹 Cerrar modal suavemente
  const handleClose = () => {
    setClosing(true)
    setVisible(false)
    setTimeout(() => setShowDetalles(null), 250)
  }

  // 💰 Formatear precio en COP
  const formatPrice = (price: string) => {
    const number = parseFloat(price)
    if (isNaN(number)) return "—"
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(number)
  }

  // 🧩 Beneficios asociados (seguro ante null o undefined)
  const beneficios = Array.isArray((plan as any).planXBeneficios)
    ? (plan as any).planXBeneficios
    : []

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 ${
        closing
          ? "opacity-0 bg-gray-900/0"
          : visible
          ? "opacity-100 bg-gray-900/60 backdrop-blur-sm"
          : "opacity-0 bg-gray-900/0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-[480px] max-w-[95%] p-6 relative border border-gray-200 transform transition-all duration-300 ${
          closing || !visible ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* 🔹 Botón cerrar */}
        <div
          className="absolute top-3 right-3 cursor-pointer hover:scale-110 transition-transform"
          onClick={handleClose}
          title="Cerrar detalles del plan"
        >
          <BtnCerrar />
        </div>

        {/* 🔹 Encabezado */}
        <div className="flex flex-col items-center mb-5 border-b pb-3">
          <HiOutlineClipboardList className="text-blue-600 text-4xl mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Detalles del Plan
          </h2>
        </div>

        {/* 🔹 Contenido */}
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">ID:</span>
            <span className="text-gray-600">{plan.idPlan}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Tipo de Plan:</span>
            <span className="text-gray-600">{plan.tipoPlan}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800 block">Descripción:</span>
            <p className="text-gray-600 mt-1">{plan.descripcion}</p>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Precio:</span>
            <span className="text-blue-600 font-semibold">
              {formatPrice(plan.precio)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Beneficiarios:</span>
            <span className="text-gray-600">{plan.cantidadBeneficiarios}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">Estado:</span>
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

          {/* 🔹 Lista de beneficios */}
          {beneficios.length > 0 ? (
            <div>
              <span className="font-semibold text-gray-800 block mb-2">
                Beneficios asociados:
              </span>
              <ul className="list-disc list-inside text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                {beneficios.map((pb: any, index: number) => (
                  <li key={`${plan.idPlan}-benef-${index}`}>
                    {pb.beneficio?.tipoBeneficio ??
                      pb.beneficio?.tipo_beneficio ??
                      "—"}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <span className="font-semibold text-gray-800 block mb-2">
                Beneficios asociados:
              </span>
              <p className="text-gray-500 italic">
                Este plan no tiene beneficios asignados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetallesPlan
