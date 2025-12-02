import { PlanXBeneficio, CrearPlanXBeneficioForm } from "../interfaces/planxbeneficios"

const BASE_URL = import.meta.env.VITE_URL_BACK
const url = (path: string) => `${BASE_URL}`.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "")
const URL = url("planxbeneficios")

// 🔹 Crear relación plan ↔ beneficio
export const createPlanBeneficio = async (
  plan_id: number,
  beneficio_id: number
): Promise<PlanXBeneficio> => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id, beneficio_id }),
    })
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    return await res.json()
  } catch (error) {
    throw error
  }
}

// 🔹 Obtener todas las asociaciones
export const getAllPlanBeneficios = async (): Promise<PlanXBeneficio[]> => {
  const res = await fetch(URL)
  if (!res.ok) throw new Error("Error al obtener asociaciones plan-beneficio")
  const data = await res.json()
  return data.data ?? data
}

// 🔹 Obtener asociaciones de un plan por ID (filtrando manualmente)
export const getPlanBeneficioById = async (idPlan: number): Promise<PlanXBeneficio[]> => {
  try {
    const res = await fetch(URL)
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    const data = await res.json()

    // Detectar correctamente dónde está el array principal
    const lista =
      data.data ?? data.msg ?? data.msj ?? (Array.isArray(data) ? data : [])

    // Filtrar las relaciones del plan
    const relaciones = lista.filter(
      (item: any) => Number(item.planId ?? item.plan_id) === Number(idPlan)
    )

    // 🔥 Mapeo limpio y completo
    const unicos: PlanXBeneficio[] = relaciones.reduce(
      (acc: PlanXBeneficio[], curr: any, i: number) => {
        const beneficioId = curr.beneficio_id ?? curr.beneficioId
        if (!acc.some((x) => x.beneficio_id === beneficioId)) {
          acc.push({
            id: curr.idPlanXBeneficios ?? curr.id ?? i + 1,
            plan_id: curr.plan_id ?? curr.planId ?? null,
            beneficio_id: beneficioId,
            planId: curr.planId,
            beneficioId: beneficioId,
            idPlanXBeneficios: curr.idPlanXBeneficios,
          })
        }
        return acc
      },
      []
    )

    return unicos
  } catch (error) {
    return []
  }
}

// 🔹 Actualizar relación
export const updatePlanBeneficio = async (id: number, data: CrearPlanXBeneficioForm) => {
  try {
    const res = await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    return await res.json()
  } catch (error) {
    throw error
  }
}

// 🔹 Eliminar todas las relaciones de un plan
export const deletePlanBeneficios = async (idPlan: number) => {
  try {
    const res = await fetch(`${URL}/${idPlan}`, { method: "DELETE" })
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    return await res.json()
  } catch (error) {
    throw error
  }
}
