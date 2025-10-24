import { ConfirmDialogProps } from "../../interfaces/visitas"
import BtnCancelar from "../botones/BtnCancelar"
import BtnEliminar from "../botones/BtnEliminar"

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <div onClick={onCancel}>
            <BtnCancelar verText={true} text="Cancelar" />
          </div>
          <div onClick={onConfirm}>
            <BtnEliminar verText={true} text="Eliminar" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
