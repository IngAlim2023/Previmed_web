import { TelefonoEntity, CrearTelefonoDto } from "../interfaces/telefono";

const BASE_URL = import.meta.env.VITE_URL_BACK; // debe terminar en "/"

// Normaliza cualquier forma que venga del backend a TelefonoEntity bien tipado
function normalizeTelefono(input: any): TelefonoEntity {
  const rawId =
    input?.id_telefono ??
    input?.idTelefono ??
    input?.id ??
    input?.ID ??
    input?.Id;

  const idNum = Number(rawId);
  // si no es número, lo marcamos -1 para que no provoque NaN en el front
  const id_telefono = Number.isFinite(idNum) ? idNum : -1;

  const telefono =
    input?.telefono ??
    input?.phone ??
    input?.numero ??
    input?.numeroTelefono ??
    "";

  const usuario_id = String(
    input?.usuario_id ?? input?.usuarioId ?? input?.userId ?? input?.usuario ?? ""
  );

  return { id_telefono, telefono, usuario_id };
}

export const telefonosService = {
  async listByUsuario(usuarioId: string): Promise<TelefonoEntity[]> {
    const r = await fetch(
      `${BASE_URL}telefonos/usuario/${encodeURIComponent(usuarioId)}`
    );
    if (!r.ok) throw new Error("No se pudieron cargar los teléfonos");
    const data = await r.json();
    const arr = Array.isArray(data) ? data : [];
    return arr.map(normalizeTelefono);
  },

  async create(data: CrearTelefonoDto): Promise<TelefonoEntity> {
    const r = await fetch(`${BASE_URL}telefonos/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(await r.text());
    const json = await r.json();
    return normalizeTelefono(json);
  },

  // update con id en la URL (validado)
  async update(
    id: number,
    data: { telefono?: string; usuario_id?: string }
  ): Promise<TelefonoEntity> {
    if (!Number.isFinite(id)) throw new Error("ID inválido para actualizar teléfono");
    const r = await fetch(`${BASE_URL}telefonos/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error((await r.text()) || "Error al actualizar el teléfono");
    const json = await r.json();
    return normalizeTelefono(json);
  },

  async remove(id: number): Promise<void> {
    if (!Number.isFinite(id)) throw new Error("ID inválido para eliminar teléfono");
    const r = await fetch(`${BASE_URL}telefonos/delete/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error((await r.text()) || "Error al eliminar el teléfono");
  },
};
