import { Visita } from "../interfaces/visitas";

// ✅ Normalizar URL del backend (remove trailing slash)
const rawUrl = import.meta.env.VITE_URL_BACK || "";
const URL_BACK = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
const API_URL = `${URL_BACK}/visitas`;

// ✅ Obtener token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ✅ Función para hacer fetch con timeout (90 segundos)
const fetchWithTimeout = (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 90000
) => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Tiempo de espera agotado. El servidor no responde."
            )
          ),
        timeoutMs
      )
    ),
  ]);
};

// ✅ Recibir: backend manda camelCase dentro de msj → mantenemos la estructura
export const getVisitas = async (): Promise<Visita[]> => {
  const res = await fetchWithTimeout(API_URL, {
    headers: getAuthHeaders(),
  }, 90000);
  if (!res.ok) throw new Error("Error al obtener visitas");
  const json = await res.json();

  return (json.msj ?? []).map((v: any) => ({
    id_visita: v.idVisita,
    fecha_visita: v.fechaVisita,
    descripcion: v.descripcion,
    direccion: v.direccion,
    estado: v.estado,
    telefono: v.telefono,
    paciente_id: v.pacienteId,
    medico_id: v.medicoId,
    barrio_id: v.barrioId,
    medico: v.medico,
    paciente: v.paciente,
    barrio: v.barrio,
  }));
};

export const createVisita = async (visita: Visita): Promise<Visita> => {
  try {
    const res = await fetchWithTimeout(
      API_URL,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(visita),
      },
      90000
    );

    let json: any = null;

    // 🔍 Intentar JSON, si no es JSON → cae en texto plano
    try {
      json = await res.json();
    } catch (_) {
      const text = await res.text();
      console.warn("⚠ Backend envió texto plano:", text);
      throw new Error("El servidor envió una respuesta inesperada (texto plano). La visita podría haberse creado.");
    }

    console.log("📦 Respuesta cruda del backend:", json);

    // ❌ CASO 1: backend manda { error: "..."}
    if (json?.error) {
      console.warn("⚠ Backend envió un error:", json.error);
      throw new Error(json.error);
    }

    // ❗ CASO 2: backend no trae "msj"
    if (!json?.msj) {
      console.warn("⚠ Respuesta inesperada, falta 'msj':", json);
      throw new Error("La respuesta del servidor no tiene el formato esperado");
    }

    // ✔ CASO 3: respuesta válida
    const v = json.msj;

    return {
      id_visita: v.idVisita,
      fecha_visita: v.fechaVisita,
      descripcion: v.descripcion,
      direccion: v.direccion,
      estado: v.estado,
      telefono: v.telefono,
      paciente_id: v.pacienteId,
      medico_id: v.medicoId,
      barrio_id: v.barrioId,
    };

  } catch (error: any) {
    console.error("❌ Error final en createVisita:", error);
    throw error;
  }
};

export const updateVisita = async (
  id: number,
  visita: Visita
): Promise<Visita> => {
  try {
    const res = await fetchWithTimeout(
      `${API_URL}/${id}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(visita),
      },
      90000
    );
    if (!res.ok) throw new Error("Error al actualizar visita");

    const json = await res.json();
    const v = json.msj; // 👈 también dentro de `msj`

    return {
      id_visita: v.idVisita,
      fecha_visita: v.fechaVisita,
      descripcion: v.descripcion,
      direccion: v.direccion,
      estado: v.estado,
      telefono: v.telefono,
      paciente_id: v.pacienteId,
      medico_id: v.medicoId,
      barrio_id: v.barrioId,
    };
  } catch (error: any) {
    console.error("❌ Error en updateVisita:", error);
    if (error?.message?.includes("Tiempo de espera")) {
      console.warn("⚠️ Timeout pero la visita probablemente se actualizó en el servidor");
      throw new Error("La solicitud está tomando más tiempo del esperado. Por favor espera...");
    }
    throw error;
  }
};

export const deleteVisita = async (id: number): Promise<void> => {
  try {
    const res = await fetchWithTimeout(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
      90000
    );
    if (!res.ok) throw new Error("Error al eliminar visita");
  } catch (error: any) {
    console.error("❌ Error en deleteVisita:", error);
    throw error;
  }
};

export const getVisitasPorMedico = async (
  idMedico: number
): Promise<Visita[]> => {
  try {
    const url = `${API_URL}/medico/${idMedico}`.replace(
      /([^:]\/)\/+/g,
      "$1"
    );
    console.log("🔗 URL usada para obtener visitas del médico:", url);

    const res = await fetchWithTimeout(
      url,
      {
        headers: getAuthHeaders(),
      },
      90000
    );
    if (!res.ok) throw new Error("Error al obtener visitas por médico");

    const json = await res.json();
    console.log("📦 Respuesta del backend (visitas):", json);

    return (json.msj ?? []).map((v: any) => ({
      id_visita: v.idVisita,
      fecha_visita: v.fechaVisita,
      descripcion: v.descripcion,
      direccion: v.direccion,
      estado: v.estado,
      telefono: v.telefono,
      paciente_id: v.pacienteId,
      medico_id: v.medicoId,
      barrio_id: v.barrioId,
    }));
  } catch (error: any) {
    console.error("❌ Error en getVisitasPorMedico:", error);
    throw error;
  }
};