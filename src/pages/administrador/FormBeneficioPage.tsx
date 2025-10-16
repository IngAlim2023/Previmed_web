import React from "react"
import { useNavigate } from "react-router-dom"
import FormBeneficio from "../../components/beneficiosPlan/FormBeneficios"
import toast from "react-hot-toast"

const FormBeneficioPage: React.FC = () => {
  const navigate = useNavigate()

  // 🔹 Al guardar, mostrar éxito y volver al formulario de plan
  const handleSuccess = () => {
    toast.success("Beneficio creado correctamente ✅")
    navigate("/planes/crear") // 👈 vuelve al formulario de plan
  }

  // 🔹 Al cancelar, volver al formulario de plan sin guardar
  const handleCancel = () => {
    navigate("/planes/crear")
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Crear Nuevo Beneficio
        </h2>

        {/* ✅ Usamos los botones originales del FormBeneficio */}
        <FormBeneficio
          beneficio={null}
          setShowForm={() => handleCancel()} // ⬅ vuelve al plan al cancelar
          onSuccess={() => handleSuccess()} // ⬅ vuelve al plan al guardar
        />
      </div>
    </div>
  )
}

export default FormBeneficioPage
