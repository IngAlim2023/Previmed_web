import type {
  MedicoResponse,
  CreateMedicoData,
  UpdateMedicoData,
  MedicoFilters,
  PaginatedResponse,
} from '../interfaces/medicoInterface';

const URL_BACK = import.meta.env.VITE_URL_BACK;

export const medicoService = {
  async getAll(filters?: MedicoFilters): Promise<PaginatedResponse<MedicoResponse>> {
    const params = new URLSearchParams();
    Object.entries(filters ?? {}).forEach(([k, v]) => {
      if (v !== undefined) params.set(k, String(v));
    });
    const res = await fetch(`${URL_BACK}medicos?${params}`);
    if (!res.ok) throw new Error('Error al obtener médicos');
    return res.json();
  },

  async getDisponibles(): Promise<MedicoResponse[]> {
    const res = await fetch(`${URL_BACK}medicos/disponibles`);
    const json = await res.json();
    return json.data;
  },

  async getById(id: number): Promise<MedicoResponse> {
    const res = await fetch(`${URL_BACK}medicos/${id}`);
    const json = await res.json();
    return json.data;
  },

  async create(data: CreateMedicoData): Promise<MedicoResponse> {
    const res = await fetch(`${URL_BACK}medicos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data;
  },

  async update(id: number, data: UpdateMedicoData): Promise<MedicoResponse> {
    const res = await fetch(`${URL_BACK}medicos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data;
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(`${URL_BACK}medicos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar médico');
  },

async cambiarDisponibilidad(id: number, disponible: boolean): Promise<MedicoResponse> {
  const res = await fetch(`${URL_BACK}medicos/${id}/disponibilidad`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disponible }),
  });
  const json = await res.json();
  return json.data;
},

  //esto es temporal hasta que usuarios este teminado
async getUsuarios(): Promise<any[]> {
  const res = await fetch(`${URL_BACK}/usuarios`);
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
}
};