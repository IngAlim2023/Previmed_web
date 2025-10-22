import { Visita } from "../interfaces/visitas";

const rawUrl = import.meta.env.VITE_URL_BACK || "";
const URL_BACK = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
const API_URL = `${URL_BACK}/visitas`;

// ✅ Recibir: backend manda camelCase dentro de msj → transformamos a snake_case
export const getVisitas = async (): Promise<Visita[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener visitas");
  const json = await res.json();

  return (json.msj ?? []).map((v: any) => ({
    id_visita: v.idVisita,
    fecha_visita: v.fechaVisita,
    descripcion: v.descripcion,
    direccion: v.direccion,
    estado: v.estado,
    telefono: v.telefono,
    paciente_id: v.pacienteId,
    medico_id: v.medicoId,
    barrio_id: v.barrioId,
  }));
};

// ✅ Enviar: usamos snake_case porque así lo espera el backend
export const createVisita = async (visita: Visita): Promise<Visita> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visita),
  });
  if (!res.ok) throw new Error("Error al crear visita");

  const json = await res.json();
  const v = json.msj; // 👈 la data real viene dentro de `msj`

  return {
    id_visita: v.idVisita,
    fecha_visita: v.fechaVisita,
    descripcion: v.descripcion,
    direccion: v.direccion,
    estado: v.estado,
    telefono: v.telefono,
    paciente_id: v.pacienteId,
    medico_id: v.medicoId,
    barrio_id: v.barrioId,
  };
};

export const updateVisita = async (id: number, visita: Visita): Promise<Visita> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visita),
  });
  if (!res.ok) throw new Error("Error al actualizar visita");

  const json = await res.json();
  const v = json.msj; // 👈 también dentro de `msj`

  return {
    id_visita: v.idVisita,
    fecha_visita: v.fechaVisita,
    descripcion: v.descripcion,
    direccion: v.direccion,
    estado: v.estado,
    telefono: v.telefono,
    paciente_id: v.pacienteId,
    medico_id: v.medicoId,
    barrio_id: v.barrioId,
  };
};

export const deleteVisita = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar visita");
};

export const getVisitasPorMedico = async (idMedico: number): Promise<Visita[]> => {
  const url = `${API_URL}/medico/${idMedico}`.replace(/([^:]\/)\/+/g, "$1");
  console.log("🔗 URL usada para obtener visitas del médico:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener visitas por médico");

  const json = await res.json();
  console.log("📦 Respuesta del backend (visitas):", json);

  return (json.msj ?? []).map((v: any) => ({
    id_visita: v.idVisita,
    fecha_visita: v.fechaVisita,
    descripcion: v.descripcion,
    direccion: v.direccion,
    estado: v.estado,
    telefono: v.telefono,
    paciente_id: v.pacienteId,
    medico_id: v.medicoId,
    barrio_id: v.barrioId,
  }));
};
