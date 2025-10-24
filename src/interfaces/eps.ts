// src/interfaces/eps.ts
export interface Eps {
  idEps: number;
  nombreEps: string;
  estado: boolean;
}

export interface CreateEpsDto {
  nombre_eps: string;
  estado?: boolean;
}

export interface UpdateEpsDto {
  idEps: number;
  nombre_eps: string;
  estado: boolean;
}