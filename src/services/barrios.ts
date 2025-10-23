// src/services/barrios.ts
import { DataBarrio } from "../interfaces/Barrio";

const BASE_URL = import.meta.env.VITE_URL_BACK;  
const RUTA = "barrios";


// Mapea del frontend al DTO esperado por el backend
const toDto = (b: Partial<DataBarrio>) => {
  const estado = b.habilitar ?? true
  return {
    nombre_barrio: b.nombreBarrio,
    ciudad: b.ciudad,
    comuna: b.comuna,
    latitud: b.latitud ?? null,
    longitud: b.longitud ?? null,
    // Compatibilidad: algunos backends usan 'habilitado' y otros 'habilitar'
    habilitar: estado,
    habilitado: estado,
    // Compatibilidad adicional
    estado: estado,
    estado_barrio: estado ? 1 : 0,
  }
}

// Normaliza booleanos provenientes del backend (boolean | number | string)
const normalizeBool = (v: any, defaultValue = true): boolean => {
  if (v === undefined || v === null) return defaultValue
  if (typeof v === "boolean") return v
  if (typeof v === "number") return v === 1
  if (typeof v === "string") {
    const s = v.trim().toLowerCase()
    if (s === "true" || s === "1" || s === "si" || s === "sí") return true
    if (s === "false" || s === "0" || s === "no") return false
  }
  return Boolean(v)
}

// Mapea del backend al frontend, soportando diferentes posibles campos
const fromDto = (raw: any): DataBarrio => ({
  idBarrio: raw.idBarrio ?? raw.id ?? raw.id_barrio ?? String(raw.id),
  nombreBarrio: raw.nombreBarrio ?? raw.nombre_barrio ?? raw.nombre ?? "",
  ciudad: raw.ciudad ?? "",
  comuna: raw.comuna ?? "",
  latitud: raw.latitud ?? null,
  longitud: raw.longitud ?? null,
  // Aceptar 'habilitar', 'habilitado' o 'estado' y normalizar correctamente
  habilitar: normalizeBool(
    raw.habilitar !== undefined ? raw.habilitar :
    raw.habilitado !== undefined ? raw.habilitado :
    raw.estado !== undefined ? raw.estado :
    raw.estado_barrio !== undefined ? raw.estado_barrio :
    (raw.activo !== undefined ? raw.activo : raw.is_active)
  , true),
});

export const getBarrios = async (): Promise<DataBarrio[]> => {
  const url = `${BASE_URL}${RUTA}?_=${Date.now()}`
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  if (!res.ok) throw new Error("Error listando barrios");
  const data = await res.json();
  const lista = data.msj ?? data.msg ?? data.data ?? (Array.isArray(data) ? data : []);
  const parsed = Array.isArray(lista) ? lista.map(fromDto) : []
  console.debug("📥 getBarrios -> crudo:", data)
  console.debug("📄 getBarrios -> lista normalizada:", parsed)
  return parsed
};

export const createBarrio = async (barrio: Partial<DataBarrio>) => {
  const res = await fetch(`${BASE_URL}${RUTA}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(toDto(barrio)),
  });
  if (!res.ok) throw new Error("Error creando barrio");
  const data = await res.json();
  return fromDto(data.data);
};

export const updateBarrio = async (id: string, barrio: Partial<DataBarrio>) => {
  const dto = toDto(barrio)
  console.debug("📤 updateBarrio -> id:", id, "payload:", dto)
  const res = await fetch(`${BASE_URL}${RUTA}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Error actualizando barrio");
  const data = await res.json();
  const parsed = fromDto(data.msj ?? data.data ?? {});
  console.debug("✅ updateBarrio -> respuesta cruda:", data)
  console.debug("✅ updateBarrio -> normalizado:", parsed)
  return parsed;
};

export const deleteBarrio = async (id: string) => {
  const res = await fetch(`${BASE_URL}${RUTA}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error eliminando barrio");
  return true;
};

export const toggleHabilitarBarrio = async (b: DataBarrio) => {
  return updateBarrio(b.idBarrio!, { habilitar: !b.habilitar });
};
