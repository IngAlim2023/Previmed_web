export interface Rol {
  id_rol: number;
  nombre_rol: string;
  estado: boolean;
}
export interface ConfirmDialogProps {
  show: boolean
  onConfirm: () => void
  onCancel: () => void
  message: string
}