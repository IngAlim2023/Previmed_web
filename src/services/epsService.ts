// src/services/epsService.ts
import { Eps, CreateEpsDto, UpdateEpsDto } from "../interfaces/eps";

const BASE_URL = import.meta.env.VITE_URL_BACK;

export const epsService = {
  async getAll(): Promise<Eps[]> {
    const res = await fetch(`${BASE_URL}eps/read`);
    if (!res.ok) throw new Error("Error al obtener las EPS");
    return res.json(); // ← ya vienen en camelCase
  },

  async getById(id: number): Promise<Eps> {
    const res = await fetch(`${BASE_URL}eps/read/${id}`);
    if (!res.ok) throw new Error("Error al obtener la EPS");
    return res.json();
  },

  async create(dto: CreateEpsDto): Promise<Eps> {
    const res = await fetch(`${BASE_URL}eps/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(await res.text() || "Error al registrar");
    return res.json();
  },

  async update(dto: UpdateEpsDto): Promise<Eps> {
    const res = await fetch(`${BASE_URL}eps/update/${dto.idEps}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(await res.text() || "Error al actualizar");
    return res.json();
  },

  async remove(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}eps/delete/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    if (text.includes("violates foreign key constraint")) {
      throw new Error("No se puede eliminar: la EPS tiene usuarios asociados");
    }
    throw new Error(text || "Error al eliminar");
  }
}
};