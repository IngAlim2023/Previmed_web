// src/interfaces/index.ts

import { ReactNode } from "react";

// Interfaces para el componente DataTableContratos.tsx

export interface Usuario {
  id_usuario?: number;
  nombre: string;
  numeroDocumento: string;
}

export interface Paciente {
  id_paciente: number;
  usuario: Usuario;
}

export interface Plan {
  id_plan: number;
  nombre: string;
  // Otros campos del plan...
}

export interface Membresia {
  idMembresia: number;
  firma: string;
  formaPago: string;
  numeroContrato: string;
  fechaInicio: string;
  fechaFin: string;
  planId: number;
  estado: boolean;
  membresiaPaciente: Array<{
    idMembresiaXPaciente: number;
    paciente?: Paciente;
  }>;
}

// Interfaces para el formulario de creación de contratos
export interface NuevoContratoForm {
  firma: string;
  formaPago: string;
  numeroContrato: string;
  fechaInicio: string;
  fechaFin: string;
  planId: string;
  pacienteId: string;
}

// Puedes añadir más interfaces aquí según las necesites...