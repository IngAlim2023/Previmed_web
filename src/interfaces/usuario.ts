import { PostPaciente } from "./pacientes";

// ------------------- Modelos de negocio -------------------
export type TipoGenero = "Masculino" | "Femenino" | "Otro";
export type TipoEstadoCivil =
  | "Soltero"
  | "Casado"
  | "Viudo"
  | "Divorciado"
  | "Unión marital";
export type TipoDocumento =
  | "Registro Civil"
  | "Tarjeta de Identidad"
  | "Cédula de Ciudadanía"
  | "Tarjeta de Extranjería"
  | "Cédula de Extranjería"
  | "Pasaporte"
  | "Documento de Identificación Extranjero (DIE)"
  | "Permiso Especial de Permanencia (PEP)";

export interface DataUsuario {
  idUsuario?: string;
  nombre: string;
  segundoNombre?: string;
  apellido: string;
  segundoApellido?: string;
  email: string;
  password?: string;
  direccion: string;
  numeroDocumento: string;
  fechaNacimiento: Date | string;
  numeroHijos?: string;
  estrato?: string;
  autorizacionDatos: boolean;
  habilitar: boolean;
  genero: string;
  estadoCivil: string;
  tipoDocumento: string;
  epsId: number;
  rolId: number;
  eps: { idEps: number; nombreEps: string };
  rol: { idRol: number; nombreRol: string };
}

export interface UsuarioFormProps {
  initialData?: DataUsuario;
  onSubmit: (data: Partial<DataUsuario>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export interface PostUsuario {
  nombre: string;
  segundo_nombre?: string;
  apellido: string;
  segundo_apellido?: string;
  email: string;
  password: string;
  direccion: string;
  numero_documento: string;
  fecha_nacimiento: Date | string;
  rol_id: number;
  genero?: string;
  tipo_documento: string;
  estado_civil?: string;
  numero_hijos?: string;
  estrato?: number;
  eps_id?: number | null;
  autorizacion_datos: boolean;
}

export interface Persona{
  usuario:PostUsuario;
  paciente:PostPaciente;
}
