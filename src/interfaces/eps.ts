// lo que devuelve el backend
export interface Eps {
  idEps: number;
  nombreEps: string;
  estado: boolean;
}

// para registrar
export interface CreateEpsDto {
  nombre_eps: string;
  estado?: boolean;
}

// para actualizar
export interface UpdateEpsDto {
  idEps: number;
  nombre_eps: string;
  estado: boolean;
}
