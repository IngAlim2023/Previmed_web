import type {
  MedicoResponse,
  CreateMedicoData,
  UpdateMedicoData,
  MedicoFilters,
  PaginatedResponse,
} from '../interfaces/medicoInterface';

const RAW = String(import.meta.env.VITE_URL_BACK || "");
const BASE = RAW.replace(/\/+$/, "");
const url = (path: string) => `${BASE}/${String(path).replace(/^\/+/, "")}`;

export const medicoService = {
  async getAll(filters?: MedicoFilters): Promise<PaginatedResponse<MedicoResponse>> {
    const params = new URLSearchParams();
    Object.entries(filters ?? {}).forEach(([k, v]) => {
      if (v !== undefined) params.set(k, String(v));
    });
    const res = await fetch(url(`/medicos?${params}`));
    if (!res.ok) throw new Error('Error al obtener médicos');
    return res.json();
  },

  async getDisponibles(): Promise<MedicoResponse[]> {
    const res = await fetch(url('/medicos/disponibles'));
    const json = await res.json();
    return json.data;
  },

  async getById(id: number): Promise<MedicoResponse> {
    const res = await fetch(url(`/medicos/${id}`));
    const json = await res.json();
    return json.data;
  },

  async create(data: CreateMedicoData): Promise<MedicoResponse> {
    const res = await fetch(url('/medicos'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data;
  },

  async update(id: number, data: UpdateMedicoData): Promise<MedicoResponse> {
    const res = await fetch(url(`/medicos/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data;
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(url(`/medicos/${id}`), { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar médico');
  },

async cambiarDisponibilidad(id: number, disponible: boolean): Promise<MedicoResponse> {
  const res = await fetch(url(`/medicos/${id}/disponibilidad`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disponible }),
  });
  const json = await res.json();
  return json.data;
},

  //esto es temporal hasta que usuarios este teminado
async getUsuarios(): Promise<any[]> {
  const res = await fetch(url('/usuarios'));
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
},

async getByUsuarioId(usuarioId: string): Promise<MedicoResponse | null> {
  const full = url(`/medicos/usuario/${usuarioId}`);
  console.log("🔗 URL usada para buscar médico:", full);

  const res = await fetch(full);
  if (!res.ok) throw new Error("Error al obtener médico por usuario");

  const json = await res.json();
  console.log("📦 Respuesta del backend (médico):", json);
  return json.msj ?? null;
},




};
