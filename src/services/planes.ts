import { Plan, NuevoPlanForm, ActualizarPlanForm } from "../interfaces/planes"

// Normaliza API_URL para que siempre termine con "/"
const BASE_URL = import.meta.env.VITE_URL_BACK;
const RUTA = "planes";

export const getPlanes = async (): Promise<Plan[]> => {
  const res = await fetch(`${BASE_URL}planes`);
  if (!res.ok) throw new Error("Error al obtener planes");
  return await res.json();
}

export const getPlanById = async (idPlan: number): Promise<Plan> => {
  const res = await fetch(`${BASE_URL}planes/${idPlan}`);
  if (!res.ok) throw new Error("Error al obtener plan");
  return await res.json();
}

export const createPlan = async (data: NuevoPlanForm): Promise<Plan> => {
  const res = await fetch(`${BASE_URL}planes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo_plan: data.tipoPlan,
      descripcion: data.descripcion,
      precio: parseFloat(data.precio),
      estado: data.estado,
      cantidad_beneficiarios: data.cantidadBeneficiarios
    }),
  });
  if (!res.ok) throw new Error("Error al crear plan");
  return await res.json();
}

export const updatePlan = async (idPlan: number, data: ActualizarPlanForm): Promise<Plan> => {
  const bodyPayload: any = {
    ...(data.tipoPlan && { tipo_plan: data.tipoPlan }),
    ...(data.descripcion && { descripcion: data.descripcion }),
    ...(data.precio !== undefined && { precio: parseFloat(data.precio) }),
    ...(data.estado !== undefined && { estado: data.estado }),
    ...(data.cantidadBeneficiarios !== undefined && { cantidad_beneficiarios: data.cantidadBeneficiarios }),
  };

  const res = await fetch(`${BASE_URL}planes/${idPlan}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyPayload),
  });
  if (!res.ok) throw new Error("Error al actualizar plan");
  return await res.json();
}

export const deletePlan = async (idPlan: number) => {
  const res = await fetch(`${BASE_URL}planes/${idPlan}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar plan");
  return await res.json();
}

export const contarPlanes = async (): Promise<{ count: number }> => {
  const res = await fetch(`${BASE_URL}conteoplanes`);
  if (!res.ok) throw new Error("Error al contar planes");
  return await res.json();
}
