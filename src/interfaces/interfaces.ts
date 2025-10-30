// Interfaces compartidas frontend
// Nota: frontend usa el término "Contrato", backend expone /membresias

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

export interface Paciente {
  idPaciente: number
  direccionCobro?: string
  ocupacion?: string | null
  activo: boolean
  beneficiario: boolean
  pacienteId?: string | null
  usuarioId: string
  usuario?: Usuario
}

export interface Plan {
  idPlan: number
  tipoPlan: string
  descripcion: string
  precio: string
  estado: boolean
  cantidadBeneficiarios: number
}

export interface MembresiaPaciente {
  idMembresiaXPaciente: number
  pacienteId: number
  membresiaId: number
  paciente?: Paciente
}

export interface Membresia {
  idMembresia: number
  firma?: string
  formaPago: string
  numeroContrato: string
  fechaInicio: string
  fechaFin: string
  planId:number
  estado: boolean
  membresiaPaciente?: MembresiaPaciente[]
  plan?: Plan | null
}

export interface NuevoContratoForm {
  firma: string | undefined
  forma_pago: string
  numero_contrato: string
  fecha_inicio: string
  fecha_fin: string
  plan_id: number 
  paciente_id: number 
  estado: boolean
}

export interface ApiResponse<T> {
  data?: T[] | T
  msj?: string
  error?: string
}

export interface SelectOption {
  value: number | string
  label: string
}

export interface FormaPagoOption {
  value: "Efectivo" | "Transferencia" | "Daviplata" | "Nequi" | "Tarjeta"
  label: string
}

export interface responseContratoUser {
  pacienteId: number;
  membresiaId: number;
  idMembresiaXPaciente: number;
  membresia: Membresia;
}