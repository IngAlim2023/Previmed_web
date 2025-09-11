// src/services/barrios.ts
import { DataBarrio } from "../interfaces/Barrio";

const BASE_URL = import.meta.env.VITE_URL_BACK;  
const RUTA = "barrios";


// Mapea del frontend al DTO esperado por el backend
const toDto = (b: Partial<DataBarrio>) => ({
  nombre_barrio: b.nombreBarrio,
  ciudad: b.ciudad,
  comuna: b.comuna,
  latitud: b.latitud ?? null,
  longitud: b.longitud ?? null,
  habilitar: b.habilitar ?? true,
});

// Mapea del backend al frontend, soportando diferentes posibles campos
const fromDto = (raw: any): DataBarrio => ({
  idBarrio: raw.idBarrio ?? raw.id ?? raw.id_barrio ?? String(raw.id),
  nombreBarrio: raw.nombreBarrio ?? raw.nombre_barrio ?? raw.nombre ?? "",
  ciudad: raw.ciudad ?? "",
  comuna: raw.comuna ?? "",
  latitud: raw.latitud ?? null,
  longitud: raw.longitud ?? null,
  habilitar: Boolean(raw.habilitar ?? true),
});

export const getBarrios = async (): Promise<DataBarrio[]> => {
  const res = await fetch(`${BASE_URL}${RUTA}`, { credentials: "include" });
  if (!res.ok) throw new Error("Error listando barrios");
  const data = await res.json();
  const lista = data.msj ?? [];
  return Array.isArray(lista) ? lista.map(fromDto) : [];
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
  const res = await fetch(`${BASE_URL}${RUTA}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(toDto(barrio)),
  });
  if (!res.ok) throw new Error("Error actualizando barrio");
  const data = await res.json();
  return fromDto(data.msj ?? data.data ?? {});
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
