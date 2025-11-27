export interface Mensaje {
  de: "usuario" | "asistente"
  texto: string
}

export interface RespuestaIA {
  ok: boolean
  accion: string
  mensajes?: string[]
  detalle?: any
  respuesta?: string
}
