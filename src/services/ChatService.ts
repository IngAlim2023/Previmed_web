// src/services/ChatService.ts
export interface MensajeChat {
  role: "user" | "assistant";
  text: string;
}

export interface RespuestaIA {
  ok: boolean;
  accion: string;
  respuesta: string;
  detalle?: Record<string, any>;
}

const URL_IA = import.meta.env.VITE_URL_IA;

export async function enviarMensajeIA(
  texto: string,
  documento: string,
  historial: MensajeChat[]
): Promise<RespuestaIA> {
  if (!URL_IA) throw new Error("⚠️ Falta VITE_URL_IA en .env");

  const resp = await fetch(`${URL_IA}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, documento, historial }),
  });

  if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);
  return await resp.json();
}
