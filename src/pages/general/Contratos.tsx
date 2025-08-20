import React from "react"
import { useNavigate } from "react-router-dom"
import DataTableContratos from "../../components/contratos/DataTableContratos"

const Contratos: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full px-4 py-8 bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Contratos</h2>
          <button
            onClick={() => navigate("/contratos/crear")}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            <span className="text-lg">＋</span> Crear Contrato
          </button>
        </div>
        <DataTableContratos />
      </div>
    </div>
  )
}

export default Contratos