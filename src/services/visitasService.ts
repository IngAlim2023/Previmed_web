import { Visita } from "../interfaces/visitas"

const API_URL = "http://localhost:3333/visitas"

export const getVisitas = async (): Promise<Visita[]> => {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error("Error al obtener visitas")
  const json = await res.json()

  // Mapear camelCase (backend) → snake_case (frontend)
  return json.msj.map((v: any) => ({
    id_visita: v.idVisita,
    fecha_visita: v.fechaVisita,
    descripcion: v.descripcion,
    direccion: v.direccion,
    estado: v.estado,
    telefono: v.telefono,
    paciente_id: v.pacienteId,
    medico_id: v.medicoId,
    barrio_id: v.barrioId,
  }))
}

export const createVisita = async (visita: Visita): Promise<Visita> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visita),
  })
  if (!res.ok) throw new Error("Error al crear visita")
  return res.json()
}

export const updateVisita = async (id: number, visita: Visita): Promise<Visita> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visita),
  })
  if (!res.ok) throw new Error("Error al actualizar visita")
  return res.json()
}

export const deleteVisita = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Error al eliminar visita")
}
