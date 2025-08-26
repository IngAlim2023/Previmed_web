// Tipos estrictos según backend
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

// ⚠️ camelCase → como devuelve el backend en Postman
export interface DataUsuario {
  idUsuario?: string;
  nombre: string;
  segundoNombre?: string;
  apellido: string;
  segundoApellido?: string;
  email: string;
  password: string;
  direccion: string;
  numeroDocumento: string;
  fechaNacimiento: string; // YYYY-MM-DD
  numeroHijos: string;
  estrato: string;
  autorizacionDatos: boolean;
  habilitar: boolean;
  genero: TipoGenero;
  estadoCivil: TipoEstadoCivil;
  tipoDocumento: TipoDocumento;
  epsId: number | null;
  rolId: number;
}
