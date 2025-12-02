import { RespuestaBeneficiarios } from "../interfaces/Beneficiarios";

const API_URL = import.meta.env.VITE_URL_BACK;

if (!API_URL) {
  console.error("❌ VITE_URL_BACK no está definido.");
  throw new Error("VITE_URL_BACK es obligatorio");
}

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error desconocido" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
};

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  console.log("📡 Request:", url, options);

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  return handleResponse(res);
};

/* ============================================================
   BENEFICIARIOS
   ============================================================ */

export const readAllBeneficiarios = async () => fetchAPI("pacientes/beneficiarios");

// beneficiariosService.ts

export const readBeneficiarios = async (pacienteId?: number): Promise<RespuestaBeneficiarios> => {
  if (!pacienteId) {
    const data = await readAllBeneficiarios();
    return { data };
  }
  return fetchAPI(`pacientes/beneficiarios/${pacienteId}`);
};

export const createBeneficiario = async (payload: any) => {
  return fetchAPI("pacientes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* ============================================================
   ASOCIAR / DESVINCULAR (CORRECTOS)
   ============================================================ */

export const asociarBeneficiario = async (beneficiarioId: number, titularId: number) => {
  return fetchAPI(`pacientes/asociar/${beneficiarioId}`, {
    method: "PUT",
    body: JSON.stringify({ paciente_id: titularId }), // ✅ CORREGIDO
  });
};

export const desvincularBeneficiario = async (beneficiarioId: number) => {
  return fetchAPI(`pacientes/desvincular/${beneficiarioId}`, {
    method: "PUT",
  });
};

/* ============================================================
   TITULARES
   ============================================================ */

export const getTitulares = async () => fetchAPI("pacientes/titular");
