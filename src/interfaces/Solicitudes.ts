export type TipoSolicitud =
  | 'Petición'
  | 'Queja'
  | 'Reclamo'
  | 'Consulta'
  | 'Sugerencia'
  | 'Felicitación'
  | 'Registro'
  | 'Cambio de datos personales'
  | 'Retiro';

export interface PostSolicitud {
  nombre: string;
  apellido: string;
  email: string;
  documento: string;
  telefono?: string;
  descripcion?: string;
  segundo_nombre?: string;
  segundo_apellido?: string;
  autorizacion_datos: boolean;
  tipo_solicitud: TipoSolicitud;
  idUsuario?: string;
}