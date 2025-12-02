// src/interfaces/beneficiarios.ts
export interface Usuario {
  idUsuario: string;
  nombre: string;
  segundoNombre: string | null;
  apellido: string;
  segundoApellido: string | null;
  email: string;
  numeroDocumento: string;
  direccion: string;
  fechaNacimiento: string;
  estrato: string;
  genero: string;
  estadoCivil: string;
  tipoDocumento: string;
  rolId: number;
  epsId: number | null;
  habilitar: boolean;
  autorizacionDatos: boolean;
}

export interface Beneficiario {
  idPaciente: number;
  usuario: Usuario;
  direccionCobro: string;
  ocupacion: string | null;
  activo: boolean;
  beneficiario: boolean;
  pacienteId: number | null;
  usuarioId: string;
}
export interface Plan {
  idPlan: number;
  tipoPlan: string;
  cantidadBeneficiarios: number; // ✅ IMPORTANTE
  precioTotal: number;
  descripcion?: string;
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
  plan: Plan;
}

export interface MembresiaXPaciente {
  pacienteId: number;
  membresiaId: number;
  idMembresiaXPaciente: number;
  membresia: Membresia;
}

export interface BeneficiarioCompleto extends Beneficiario {
  membresiaPaciente?: MembresiaXPaciente[];
}

export interface Titular {
  idPaciente: number;
  usuario?: Usuario;
  nombre?: string;
  apellido?: string;
  numeroDocumento?: string;
}

// ✅ NUEVA INTERFACE para la respuesta con titular
export interface RespuestaBeneficiarios {
  data: BeneficiarioCompleto[];
  titular?: BeneficiarioCompleto;
  message?: string;
}