import { PlanXBeneficio } from "./planxbeneficios"

export interface Plan {
  idPlan: number
  tipoPlan: string
  descripcion: string
  precio: string
  estado: boolean
  cantidadBeneficiarios: number
  beneficios?: (number | string)[]
  planXBeneficios?: PlanXBeneficio[]
}

// 🔹 Crear un nuevo plan
export interface NuevoPlanForm {
  tipoPlan: string
  descripcion: string
  precio: string
  estado: boolean
  cantidadBeneficiarios: number
  beneficios: (number | string)[]
}

// 🔹 Actualizar un plan existente
export interface ActualizarPlanForm {
  tipoPlan?: string
  descripcion?: string
  precio?: string
  estado?: boolean
  cantidadBeneficiarios?: number
  beneficios?: (number | string)[]
}
