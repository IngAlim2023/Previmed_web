import { Rol } from "../interfaces/roles";

const URL_BACK = import.meta.env.VITE_URL_BACK;
const API_URL = `${URL_BACK}roles`;

export const getRoles = async (): Promise<Rol[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener roles");
  const json = await res.json();

  return json.msj.map((r: any) => ({
    id_rol: r.idRol,
    nombre_rol: r.nombreRol,
    estado: r.estado,
  }));
};

export const createRol = async (rol: Rol): Promise<Rol> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rol),
  });
  if (!res.ok) throw new Error("Error al crear rol");
  return res.json();
};

export const updateRol = async (id: number, rol: Rol): Promise<Rol> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rol),
  });
  if (!res.ok) throw new Error("Error al actualizar rol");
  return res.json();
};

export const deleteRol = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar rol");
};
