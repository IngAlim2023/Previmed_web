import { Eps, CreateEpsDto, UpdateEpsDto } from "../interfaces/eps";

const BASE_URL = import.meta.env.VITE_URL_BACK;

export const epsService = {
  async getAll(): Promise<Eps[]> {
    const res = await fetch(`${BASE_URL}eps/read`);
    if (!res.ok) throw new Error("Error al obtener las EPS");
    return res.json();
  },

  async getById(id: number): Promise<Eps> {
    const res = await fetch(`${BASE_URL}eps/read/${id}`);
    if (!res.ok) throw new Error("Error al obtener la EPS");
    return res.json();
  },

  async create(data: CreateEpsDto): Promise<Eps> {
    const res = await fetch(`${BASE_URL}eps/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text() || "Error al registrar la EPS");
    return res.json();
  },

  async update(data: UpdateEpsDto): Promise<Eps> {
    const res = await fetch(`${BASE_URL}eps/update/${data.idEps}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_eps: data.nombre_eps,
        estado: data.estado,
      }),
    });
    if (!res.ok) throw new Error(await res.text() || "Error al actualizar la EPS");
    return res.json();
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}eps/delete/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text() || "Error al eliminar la EPS");
  },
};
