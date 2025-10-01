export interface TelefonoEntity {
  id_telefono: number;
  telefono: string;
  usuario_id: string;
}

export interface CrearTelefonoDto {
  telefono: string;
  usuario_id: string;
}

export interface UpdateTelefonoDto {
  id_telefono: number;
  telefono?: string;
  usuario_id?: string;
}
