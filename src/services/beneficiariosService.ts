const API_URL = import.meta.env.VITE_URL_BACK;

if (!API_URL) {
  console.error("❌ VITE_API_URL no está definido. Revisa tu archivo .env");
  throw new Error("VITE_API_URL es obligatorio");
}

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
};

const fetchAPI = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_URL}${endpoint}`;
  console.log("🔍 Llamando a:", url);

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    console.log("📡 Respuesta HTTP:", res.status, res.statusText);

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Cuerpo del error:", text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return await handleResponse(res);
  } catch (error) {
    console.error(`❌ Error en ${endpoint}:`, error);
    throw error;
  }
};

export const readAllBeneficiarios = async () => {
  return await fetchAPI('pacientes/beneficiarios');
};

export const readBeneficiarios = async (pacienteId?: number) => {
  if (!pacienteId) {
    return await readAllBeneficiarios();
  }
  
  return await fetchAPI(`pacientes/beneficiarios/${pacienteId}`);
};

export const createBeneficiario = async (payload: any) => {
  return await fetchAPI('pacientes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const deleteBeneficiario = async (id: number) => {
  return await fetchAPI(`pacientes/${id}`, {
    method: 'DELETE',
  });
};

export const asociarBeneficiario = async (beneficiarioId: number, titularId: number) => {
  return await fetchAPI('pacientes/asociar', {
    method: 'POST',
    body: JSON.stringify({ beneficiario_id: beneficiarioId, titular_id: titularId }),
  });
};

export const desvincularBeneficiario = async (id: number, forzar: boolean = false) => {
  return await fetchAPI(`pacientes/desvincular/${id}?forzar=${forzar}`, {
    method: 'DELETE',
  });
};

export const getUsuarioDeBeneficiario = async (id: number) => {
  return await fetchAPI(`pacientes/${id}/usuario`);
};

export const getTitulares = async () => {
  return await fetchAPI('pacientes/titular');
};