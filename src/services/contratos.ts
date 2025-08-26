import { Membresia, NuevoContratoForm } from "../interfaces/interfaces"

// src/services/contratos.ts
const API_URL = import.meta.env.VITE_URL_BACK || "http://localhost:3333"

export const getContratos = async () => {
  const res = await fetch(`${API_URL}/membresias`)
  if (!res.ok) throw new Error("Error al obtener contratos")
  return await res.json()
}

export const getContratoById = async (id: number) => {
  const res = await fetch(`${API_URL}/membresias/${id}`)
  if (!res.ok) throw new Error("Error al obtener contrato")
  return await res.json()
}

export const createContrato = async (data:NuevoContratoForm):Promise<Membresia> => {
  const res = await fetch(`${API_URL}/membresias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al crear contrato")
  return await res.json()
}

export const updateContrato = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/membresias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al actualizar contrato")
  return await res.json()
}

export const deleteContrato = async (id: number) => {
  const res = await fetch(`${API_URL}/membresias/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Error al eliminar contrato")
  return await res.json()
}
