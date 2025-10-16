import { Plan } from "./planes"
import { Beneficio } from "./beneficios"

// 🔹 Interfaz de relación Plan ↔ Beneficio
export interface PlanXBeneficio {
  id: number
  plan_id: number
  beneficio_id: number

  // 🔹 Campos opcionales para adaptarse al backend (camelCase)
  planId?: number
  beneficioId?: number
  idPlanXBeneficios?: number

  plan?: Plan
  beneficio?: Beneficio
}

// 🔹 Para crear una relación nueva
export interface CrearPlanXBeneficioForm {
  plan_id: number
  beneficio_id: number
}
