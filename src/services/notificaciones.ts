const BASE_URL = import.meta.env.VITE_URL_BACK;

interface DataNotificacionMedico {
  paciente_id: string|null;
  medico_id: number|null;
}

export const getNoficacionesMedicos = async (id: number | null) => {
  if (id === null) return;
  const res = await fetch(`${BASE_URL}notificaciones/medico/${id}`);
  if (!res.ok) throw new Error("Error al obtener notificaciones");
  return res.json();
};
export const createNotificacionMedico = async (
  noti: Partial<DataNotificacionMedico>
) => {
  const res = await fetch(`${BASE_URL}notificaciones/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noti),
  });
  if (!res.ok) throw new Error("Error al crear la notificación");
  return res.json();
};
export const putNoficacionVista = async (id: number | null) => {
  if (id === null) return;
  const res = await fetch(`${BASE_URL}notificacion/${id}`,{
    method: "PATCH",
    headers: { "Content-Type": "application/json" }});
  if (!res.ok) throw new Error("Error al modificar la notificación");
  return res.json();
};


export const getNoficacionesAdminVisitas = async () => {
  const res = await fetch(`${BASE_URL}notificaciones/admin/visitas`);
  if (!res.ok) throw new Error("Error al obtener notificaciones");
  return res.json();
};

export const deleteNoficacionesAdmin = async (id: number | null) => {
  if (id === null) return;
  const res = await fetch(`${BASE_URL}notificaciones/delete/${id}`,
    {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }
  );
  if (!res.ok) throw new Error("Error al obtener notificaciones");
  return res.json();
};