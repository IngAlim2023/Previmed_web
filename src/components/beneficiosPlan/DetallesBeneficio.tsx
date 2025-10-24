import React, { useState, useEffect } from "react"
import BtnCerrar from "../botones/BtnCerrar"
import { HiOutlineHeart } from "react-icons/hi"
import { Beneficio } from "../../interfaces/beneficios"

interface Props {
  beneficio: Beneficio | null
  setShowDetalles: (v: boolean) => void
}

const DetallesBeneficio: React.FC<Props> = ({ beneficio, setShowDetalles }) => {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    // ✨ Animación de entrada suave
    const timeout = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timeout)
  }, [])

  if (!beneficio) return null

  // 🧩 Cerrar modal con animación suave (sin toasts)
  const handleClose = () => {
    setClosing(true)
    setVisible(false)
    setTimeout(() => setShowDetalles(false), 250)
  }

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
        className={`bg-white rounded-2xl shadow-2xl w-[420px] max-w-[95%] p-6 relative border border-gray-200 transform transition-all duration-300 ${
          closing || !visible ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* 🔹 Botón cerrar (solo arriba, sin toast) */}
        <div
          className="absolute top-3 right-3 cursor-pointer hover:scale-110 transition-transform"
          onClick={handleClose}
          title="Cerrar detalles del beneficio"
        >
          <BtnCerrar />
        </div>

        {/* 🔹 Encabezado con ícono */}
        <div className="flex flex-col items-center mb-5 border-b pb-3">
          <HiOutlineHeart className="text-blue-600 text-4xl mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Detalles del Beneficio
          </h2>
        </div>

        {/* 🔹 Contenido del detalle */}
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">ID:</span>
            <span className="text-gray-600">{beneficio.id_beneficio}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <span className="font-semibold text-gray-800">
              Tipo de Beneficio:
            </span>
            <span className="text-gray-600 sm:text-right mt-1 sm:mt-0 break-words max-w-[280px]">
              {beneficio.tipo_beneficio}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetallesBeneficio
