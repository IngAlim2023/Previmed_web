import {
  Membresia,
  NuevoContratoForm,
  Plan,
  Paciente,
} from "../interfaces/interfaces"

const rawApiUrl = import.meta.env.VITE_URL_BACK || "http://localhost:3333"
const API_URL = rawApiUrl.endsWith("/") ? rawApiUrl : rawApiUrl + "/"

// 🔧 Función auxiliar para leer propiedades con distintos nombres
const pick = (obj: any, keys: string[]) => {
  for (const k of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, k)) return obj[k]
  }
  return undefined
}

// 🔄 Mapper frontend → backend
export const mapContratoToBackend = (contrato: NuevoContratoForm) => ({
  firma: contrato.firma,
  forma_pago: contrato.forma_pago,
  numero_contrato: contrato.numero_contrato,
  fecha_inicio: contrato.fecha_inicio,
  fecha_fin: contrato.fecha_fin,
  estado: contrato.estado,
  plan_id: Number(contrato.plan_id),
  paciente_id: Number(contrato.paciente_id),
})

// 🔄 Mapper backend → frontend
export const mapContratoFromBackend = (m: any): Membresia => {
  const id = pick(m, ["idMembresia", "id_membresia", "id"]) as number | string

  return {
    idMembresia: typeof id === "string" ? Number(id) : (id as number),
    firma: pick(m, ["firma"]) || "",
    formaPago: pick(m, ["forma_pago", "formaPago"]) || "",
    numeroContrato: pick(m, ["numero_contrato", "numeroContrato"]) || "",
    fechaInicio: pick(m, ["fecha_inicio", "fechaInicio"]) || "",
    fechaFin: pick(m, ["fecha_fin", "fechaFin"]) || "",
    estado: pick(m, ["estado"]) ?? true,
    planId: Number(pick(m, ["planId", "plan_id"])) || 0,
    plan: pick(m, ["plan"]) || null,
    membresiaPaciente:
      pick(m, ["membresiaPaciente", "membresia_paciente"]) || [],
  }
}

// 📦 Obtener contratos
export const getContratos = async (): Promise<Membresia[]> => {
  const res = await fetch(`${API_URL}membresias`)
  if (!res.ok) throw new Error(`Error al obtener contratos: ${res.status}`)
  const raw = await res.json().catch(() => null)
  const list = Array.isArray(raw) ? raw : raw?.msj || raw?.data || []
  return list.map(mapContratoFromBackend)
}

// 📦 Crear contrato
export const createContrato = async (data: NuevoContratoForm): Promise<Membresia> => {
  const res = await fetch(`${API_URL}membresias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapContratoToBackend(data)),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.msj || `Error ${res.status}`)
  }
  const saved = await res.json().catch(() => null)
  return mapContratoFromBackend(saved)
}

// 📦 Actualizar contrato
export const updateContrato = async (id: string | number, data: NuevoContratoForm): Promise<Membresia> => {
  const res = await fetch(`${API_URL}membresias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapContratoToBackend(data)),
  })
  if (!res.ok) throw new Error(`Error al actualizar contrato: ${res.status}`)
  const updated = await res.json().catch(() => null)
  return mapContratoFromBackend(updated)
}

export const deleteContrato = async (id: string | number) => {
  try {
    const url = `${API_URL}membresias/${id}`
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      const text = await res.text()
      let parsedError
      try {
        parsedError = JSON.parse(text)
      } catch {
        parsedError = text
      }

      // Lanzamos error con mensaje legible
      throw new Error(
        typeof parsedError === "object" && parsedError !== null
          ? parsedError.error || parsedError.mensaje || `Error ${res.status}`
          : `Error al eliminar contrato: ${res.status} ${parsedError}`
      )
    }

    try {
      return await res.json()
    } catch {
      return { ok: true }
    }
  } catch (error: any) {
    console.error("❌ Error en deleteContrato:", error.message)
    throw new Error(error.message || "Error desconocido al eliminar contrato")
  }
}




// 📦 Obtener planes
export const getPlanes = async (): Promise<Plan[]> => {
  const res = await fetch(`${API_URL}planes`)
  if (!res.ok) throw new Error("Error al obtener planes")
  const raw = await res.json().catch(() => null)
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.msj)) return raw.msj
  return raw?.data ?? []
}

// 📦 Obtener pacientes (si se usa en el futuro)
export const getPacientes = async (): Promise<Paciente[]> => {
  const res = await fetch(`${API_URL}pacientes`)
  if (!res.ok) throw new Error("Error al obtener pacientes")
  const raw = await res.json().catch(() => null)
  return Array.isArray(raw) ? raw : raw?.data ?? []
}

// Obtener el contrato del usuario logueado por medio del id del usuario
export const getContratoByUserId = async(id:string) => {
  const res = await fetch(`${API_URL}membresiasxpacientes/user/${id}`);
  if (!res.ok) throw new Error("Error al obtener el contrato")
  return res.json()
}

// generar el contrato en pdf
export const getContratoPdf = async (idUsuario: string) => {
  const res = await fetch(`${API_URL}membresias/pdf/${idUsuario}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Error generando el contrato');

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  return url;
};

// servicio para renovar un contrato
export const renovarContrato = async(data : any) => {
  try {
    console.log(data)
    const res = await fetch(`${API_URL}membresias/renovar`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(data)
    })
    const response = await res.json();
    return response;
  } catch (error) {
    return { ok: false, message: "Error al renovar el contrato" }
  }
}