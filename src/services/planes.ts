import { Plan, NuevoPlanForm, ActualizarPlanForm } from "../interfaces/planes"
import {
  createPlanBeneficio,
  deletePlanBeneficios,
  getPlanBeneficioById,
} from "./planxbeneficios"

const BASE_URL = import.meta.env.VITE_URL_BACK
const PLANES_URL = `${BASE_URL}planes`

// ✅ Helper: obtener beneficios asociados a un plan
const attachBeneficios = async (plan: Plan): Promise<Plan> => {
  try {
    const relaciones = await getPlanBeneficioById(plan.idPlan)

    // 🔹 Mapear correctamente los campos según el backend
    const planXBeneficios = relaciones.map((r: any, index: number) => ({
      id: r.id ?? r.idPlanXBeneficios ?? index + 1,
      plan_id:
        r.plan_id ??
        r.planId ??
        r.plan ??
        r.idPlan ??
        plan.idPlan, // fallback seguro
      beneficio_id:
        r.beneficio_id ??
        r.beneficioId ??
        r.beneficio ??
        r.idBeneficio ??
        null,
      ...r, // Conserva otros campos útiles si existen
    }))

    console.log(`✅ Beneficios finales asociados al plan ${plan.idPlan}:`, planXBeneficios)
    return { ...plan, planXBeneficios }
  } catch (error) {
    console.warn(`⚠️ No se pudieron obtener beneficios para el plan ${plan.idPlan}`)
    return { ...plan, planXBeneficios: [] }
  }
}

// 🔹 Obtener todos los planes
export const getPlanes = async (): Promise<Plan[]> => {
  const res = await fetch(PLANES_URL)
  if (!res.ok) throw new Error("Error al obtener planes")
  const data = await res.json()

  // 🔍 Detección flexible de estructura
  const planes = data.data ?? data.msj ?? data.msg ?? data ?? []
  return Array.isArray(planes) ? planes : []
}

// 🔹 Obtener plan por ID
export const getPlanById = async (idPlan: number): Promise<Plan> => {
  const res = await fetch(`${PLANES_URL}/${idPlan}`)
  if (!res.ok) throw new Error(`Error al obtener plan: ${res.status}`)
  const data = await res.json()
  return data.data ?? data.msj ?? data.msg ?? data
}

// 🔹 Crear plan y asociar beneficios
export const createPlan = async (data: NuevoPlanForm): Promise<Plan> => {
  try {
    // Crear plan base
    const res = await fetch(PLANES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo_plan: data.tipoPlan,
        descripcion: data.descripcion,
        precio: parseFloat(data.precio),
        estado: data.estado,
        cantidad_beneficiarios: data.cantidadBeneficiarios,
      }),
    })

    if (!res.ok) throw new Error("Error al crear plan")
    const planCreado = await res.json()
    console.log("📦 Respuesta backend (crear plan):", planCreado)

    // 🔍 Detectar ID real del plan creado (manejo flexible según estructura)
    const idPlan =
      planCreado.idPlan ??
      planCreado.msj?.idPlan ??
      planCreado.data?.id_plan ??
      planCreado.data?.idPlan ??
      planCreado.plan?.idPlan

    if (!idPlan) throw new Error("No se obtuvo el ID del plan creado")

    // Asociar beneficios si existen (deduplicando IDs)
    if (Array.isArray(data.beneficios) && data.beneficios.length > 0) {
      const uniqueIds = Array.from(new Set(data.beneficios.map((x) => Number(x))))
      for (const idBeneficio of uniqueIds) {
        await createPlanBeneficio(idPlan, Number(idBeneficio))
      }
    }

    // Obtener plan completo con beneficios asociados
    const planBase = await getPlanById(idPlan)
    const planCompleto = await attachBeneficios(planBase)
    console.log("✅ Plan creado con beneficios asociados:", planCompleto)

    return planCompleto
  } catch (error) {
    console.error("❌ Error en createPlan:", error)
    throw error
  }
}

// 🔹 Actualizar plan y re-asociar beneficios
export const updatePlan = async (
  idPlan: number,
  data: ActualizarPlanForm
): Promise<Plan> => {
  try {
    // 1️⃣ Preparar payload con nombres correctos
    const payload: any = {
      ...(data.tipoPlan && { tipo_plan: data.tipoPlan }),
      ...(data.descripcion && { descripcion: data.descripcion }),
      ...(data.precio !== undefined && { precio: parseFloat(data.precio) }),
      ...(data.estado !== undefined && { estado: data.estado }),
      ...(data.cantidadBeneficiarios !== undefined && {
        cantidad_beneficiarios: data.cantidadBeneficiarios,
      }),
    }

    // 2️⃣ Actualizar datos base del plan
    const res = await fetch(`${PLANES_URL}/${idPlan}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Error al actualizar plan")
    await res.json()

    //  Reasociar beneficios (deduplicando IDs)
    if (Array.isArray(data.beneficios)) {
      await deletePlanBeneficios(idPlan).catch(() =>
        console.warn("⚠️ No había beneficios previos que eliminar")
      )

      const uniqueIds = Array.from(new Set(data.beneficios.map((x) => Number(x))))
      for (const idBeneficio of uniqueIds) {
        await createPlanBeneficio(idPlan, Number(idBeneficio))
      }
    }

    // Obtener plan actualizado con beneficios
    const planBase = await getPlanById(idPlan)
    return await attachBeneficios(planBase)
  } catch (error) {
    console.error("❌ Error en updatePlan:", error)
    throw error
  }
}

// 🔹 Eliminar plan
export const deletePlan = async (idPlan: number) => {
  try {
    const res = await fetch(`${PLANES_URL}/${idPlan}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar plan")
    return await res.json()
  } catch (error) {
    console.error("❌ Error en deletePlan:", error)
    throw error
  }
}

// 🔹 Contar planes
export const contarPlanes = async (): Promise<{ count: number }> => {
  const res = await fetch(`${BASE_URL}conteoplanes`)
  if (!res.ok) throw new Error("Error al contar planes")
  return await res.json()
}
