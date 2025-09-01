import { IoWarningOutline } from "react-icons/io5"
import { ConfirmDialogProps } from "../../interfaces/roles"

// 👇 Importamos tus botones personalizados
import BtnCancelar from "../botones/BtnCancelar"
import BtnEliminar from "../botones/BtnEliminar"

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  show,
  onConfirm,
  onCancel,
  message,
}) => {
  if (!show) return null

  return (
    // 🔥 Fondo oscuro + blur
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] animate-fadeIn">
        <div className="flex items-center gap-3">
          <IoWarningOutline className="text-red-500 text-3xl" />
          <h2 className="text-lg font-semibold text-gray-800">Confirmación</h2>
        </div>

        <p className="mt-4 text-gray-600">{message}</p>

        <div className="flex justify-end gap-3 mt-6">
          {/* 👇 Botón personalizado Cancelar */}
          <div onClick={onCancel}>
            <BtnCancelar verText={true} text="Cancelar" />
          </div>

          {/* 👇 Botón personalizado Eliminar */}
          <div onClick={onConfirm}>
            <BtnEliminar verText={true} text="Eliminar" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
