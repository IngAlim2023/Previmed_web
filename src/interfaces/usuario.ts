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
  password: string;
  direccion: string;
  numeroDocumento: string;
  fechaNacimiento: string;
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

// ------------------- Props de componentes (UI) -------------------
export interface UsuarioFormProps {
  initialData?: DataUsuario;
  onSubmit: (usuario: Partial<DataUsuario>) => void;
  onCancel: () => void;
}
