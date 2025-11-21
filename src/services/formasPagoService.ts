import { FormaPago, CreateFormaPagoDto, UpdateFormaPagoDto } from "../interfaces/formaPago";

const RAW_BASE = import.meta.env.VITE_URL_BACK || "";
const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : `${RAW_BASE}/`;
const RESOURCE = "formas_pago";

// ---- Normalizador de un item cualquiera a FormaPago
function normalizeFormaPago(item: any): FormaPago {
  const id =
    item?.id_forma_pago ??
    item?.idFormaPago ??
    item?.id_forma ??
    item?.id ??
    item?.ID ??
    0;

  const tipo =
    item?.tipo_pago ??
    item?.tipoPago ??
    item?.tipo ??
    item?.nombre ??
    item?.nombre_tipo ??
    "";

  const est =
    typeof item?.estado === "boolean"
      ? item.estado
      : typeof item?.activo === "boolean"
      ? item.activo
      : typeof item?.is_active === "boolean"
      ? item.is_active
      : true;

  return {
    id_forma_pago: Number(id),
    tipo_pago: String(tipo),
    estado: Boolean(est),
  };
}

// ---- Extrae la LISTA desde cualquier forma común de respuesta
function extractList(data: any): any[] {
  // candidatos típicos
  const candidates = [
    data,
    data?.data,
    data?.rows,
    data?.result,
    data?.items,
    data?.lista,
    data?.list,
    data?.formas_pagos,
    data?.formasPagos,
    data?.FormasPagos,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }

  // como último recurso: toma el primer valor que sea array
  if (data && typeof data === "object") {
    const firstArray = Object.values(data).find((v) => Array.isArray(v));
    if (Array.isArray(firstArray)) return firstArray;
  }

  // si nada cuadra, devuelve []
  return [];
}

export const formasPagoService = {
  async getAll(): Promise<FormaPago[]> {
    const url = `${BASE}${RESOURCE}/read`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener las formas de pago");

    const payload = await res.json();

    // DEBUG: mira cómo viene tu backend (borra esto cuando verifiques)
    // eslint-disable-next-line no-console
    console.log("[formas_pago/read] payload:", payload);

    const list = extractList(payload);
    return list.map(normalizeFormaPago);
  },

  async getById(id: number): Promise<FormaPago> {
    const res = await fetch(`${BASE}${RESOURCE}/read/${id}`);
    if (!res.ok) throw new Error("Error al obtener la forma de pago");
    const payload = await res.json();
    const item = Array.isArray(payload) ? payload[0] : payload?.data ?? payload;
    return normalizeFormaPago(item);
  },

  async create(data: CreateFormaPagoDto): Promise<FormaPago> {
    const res = await fetch(`${BASE}${RESOURCE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al registrar la forma de pago");
    const created = await res.json();
    return normalizeFormaPago(created?.data ?? created);
  },

  async update(data: UpdateFormaPagoDto): Promise<FormaPago> {
  const res = await fetch(`${BASE}${RESOURCE}/update/${data.id_forma_pago}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo_pago: data.tipo_pago,
      estado: data.estado,
    }),
  });

  if (!res.ok) throw new Error("Error al actualizar la forma de pago");
  const updated = await res.json();
  return normalizeFormaPago(updated?.data ?? updated);
}
  ,

  async remove(id: number): Promise<void> {
    const res = await fetch(`${BASE}${RESOURCE}/delete/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar la forma de pago");
  },
};
