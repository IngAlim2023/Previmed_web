import type { PostSolicitud } from "../interfaces/Solicitudes";

const URL = `${import.meta.env.VITE_URL_BACK}solicitudes`;

export const crearSolicitud = async (payload: PostSolicitud): Promise<void> => {
  const { idUsuario, ...data } = payload;
  const dataToSend = idUsuario && idUsuario.trim() 
    ? { ...data, idUsuario }
    : data;

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear la solicitud");
  }
};

export const obtenerSolicitudes = async (): Promise<any[]> => {
  const response = await fetch(URL);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener solicitudes");
  }
  
  const data = await response.json();
  return data.data || [];
};

export const cambiarEstadoSolicitud = async (id: number, estado: boolean): Promise<any> => {
  const response = await fetch(`${URL}/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al cambiar el estado");
  }

  const data = await response.json();
  return data.data || data;
};