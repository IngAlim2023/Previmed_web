export interface Beneficio {
  // Campos que usa tu frontend
  id_beneficio?: number
  tipo_beneficio: string

  // Campos opcionales que puede devolver el backend
  idBeneficio?: number
  tipoBeneficio?: string
}
