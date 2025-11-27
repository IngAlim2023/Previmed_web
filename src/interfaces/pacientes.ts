import { PostUsuario } from "./usuario";

export interface Paciente {
  idPaciente: number;
  direccionCobro: string;
  ocupacion: string;
  activo: boolean;
  beneficiario: boolean;
  pacienteId: number;
  usuarioId: string;
  usuario: any;
}

export interface PostPaciente {
  direccion_cobro?: string;
  ocupacion?: string;
  activo?: boolean;
  beneficiario?: boolean;
  paciente_id?: number;
  usuario?: PostUsuario;
}