// Usuario
// Usuario
export interface Usuario {
  idUsuario: string
  nombre: string
  segundoNombre?: string | null
  apellido: string
  segundoApellido?: string | null
  email: string
  password?: string
  direccion?: string
  numeroDocumento?: string
  fechaNacimiento?: string
  numeroHijos?: string | null
  estrato?: string | null
  autorizacionDatos?: boolean
  epsId?: number | null
  rolId?: number
  habilitar?: boolean
  genero?: string | null
  estadoCivil?: string | null
  tipoDocumento?: string | null
}

// Paciente
export interface Paciente {
  idPaciente: number
  direccionCobro?: string
  ocupacion?: string | null
  activo: boolean
  beneficiario: boolean
  pacienteId?: number | null
  usuarioId: string
  usuario?: Usuario
}


// Plan (estructura real del backend)
export interface Plan {
  idPlan: number
  tipoPlan: string
  descripcion: string
  precio: string // Viene como string del backend
  estado: boolean
  cantidadBeneficiarios: number
}

// Membresía x Paciente (tabla intermedia)
export interface MembresiaPaciente {
  pacienteId: number
  membresiaId: number
  idMembresiaXPaciente: number
  paciente?: Paciente
}

// Membresía (Contrato)
export interface Membresia {
  idMembresia: number
  firma: string
  formaPago: string
  numeroContrato: string
  fechaInicio: string
  fechaFin: string
  planId: number
  estado: boolean
  membresiaPaciente: MembresiaPaciente[]
  plan?: Plan
}


// Para crear contrato (ajustado a la estructura real)
export interface NuevoContratoForm {
  firma: string
  forma_pago: string
  numero_contrato: string
  fecha_inicio: string
  fecha_fin: string
  plan_id: number
  paciente_id: number
  estado: boolean
}


// Para respuestas de la API
export interface ApiResponse<T> {
  data?: T[]
  msj?: T[]
  error?: string
}

// Opciones para los selects
export interface SelectOption {
  value: number | string
  label: string
}

export interface FormaPagoOption {
  value: "Efectivo" | "Transferencia" | "Daviplata" | "Nequi"
  label: string
}