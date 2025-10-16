export interface Paciente {
  id: number;
  nombre: string;
  segundo_nombre?: string;
  apellido?: string;
  segundo_apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  numero_documento?: string;
  fecha_nacimiento?: string;
  numero_hijos?: number;
  estrato?: number;
  autorizacion_datos?: boolean;
  habilitar?: boolean;
  doctor: string;
  plan: string;
  usuarioId?: string;
}