export interface Visita {
  id_visita: number
  fecha_visita: string
  descripcion: string
  direccion: string
  estado: boolean
  telefono: string
  paciente_id: number
  medico_id: number
  barrio_id: number

  // Relaciones cargadas con preload
  paciente?: {
    nombre: string
  }
  medico?: {
    nombre: string
  }
  barrio?: {
    nombre: string
  }
}
