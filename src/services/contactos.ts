const BASE_URL = import.meta.env.VITE_URL_BACK;

export const getContacto = async () => {
  const res = await fetch(`${BASE_URL}contactos/read`);
  if (!res.ok) throw new Error("Error al obtener notificaciones");
  return res.json();
};

export const updateContactoInfo = async (
  noti:any
):Promise<any> => {
  const res = await fetch(`${BASE_URL}contactos/update/1`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noti),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Error al actualizar el contacto");
  return res.json();
};