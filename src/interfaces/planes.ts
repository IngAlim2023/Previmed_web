export interface Plan {
  msj: Plan
  idPlan: number
  tipoPlan: string
  descripcion: string
  precio: string // Viene como string del backend
  estado: boolean
  cantidadBeneficiarios: number
}

export interface NuevoPlanForm {
  tipoPlan: string
  descripcion: string
  precio: string
  estado: boolean
  cantidadBeneficiarios: number
}

export interface ActualizarPlanForm {
  tipoPlan?: string
  descripcion?: string
  precio?: string
  estado?: boolean
  cantidadBeneficiarios?: number
}
