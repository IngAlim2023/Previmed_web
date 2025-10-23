export interface Visita {
  id_visita?: number
  fecha_visita: string
  descripcion: string
  direccion: string
  estado: boolean
  telefono: string
  paciente_id: number | null
  medico_id: number | null
  barrio_id: number | null
}

export interface ConfirmDialogProps {
  show: boolean
  onConfirm: () => void
  onCancel: () => void
  message: string
}
