// src/interfaces/beneficiarios.ts
export interface Usuario {
  idUsuario: string;
  nombre: string;
  segundoNombre: string;
  apellido: string;
  segundoApellido: string;
  email: string;
  numeroDocumento: string;
  direccion: string;
  genero: string;
  estadoCivil: string;
  tipoDocumento: string;
}

export interface Beneficiario {
  idPaciente: number;
  usuario: Usuario;
  direccionCobro: string;
  ocupacion: string;
  activo: boolean;
  beneficiario: boolean;
}

export interface Titular {
  id_paciente: number;
  usuario?: {
    nombre?: string;
    apellido?: string;
    numero_documento?: string;
  };
  nombre?: string;
  apellido?: string;
  numero_documento?: string;
}