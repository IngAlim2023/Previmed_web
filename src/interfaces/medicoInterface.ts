export interface MedicoResponse {
  id_medico: number;
  disponibilidad: boolean;
  estado: boolean;
  usuario_id: string;
  usuario: {
    id_usuario: string;
    nombre: string;
    apellido: string;
    email: string;
    numero_documento: string;
  };
}

export interface CreateMedicoData {
  disponibilidad: boolean;
  estado?: boolean;
  usuario_id: string;
}

export interface UpdateMedicoData {
  disponibilidad?: boolean;
  estado?: boolean;
}

export interface MedicoFilters {
  disponibilidad?: boolean;
  estado?: boolean;
  usuario_id?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}