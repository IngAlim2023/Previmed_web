const RAW = String(import.meta.env.VITE_URL_BACK || "");
const BASE = RAW.replace(/\/+$/, "");
const url = (path: string) => `${BASE}/${String(path).replace(/^\/+/, "")}`;

export const getPagos = async () => {
  const response = await fetch(url("/registros-pago"), {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) throw new Error("Error al obtener los pagos");
  return response.json();
};

export const createPago = async (pago: any) => {
  const formData = new FormData();
  if (pago.foto && pago.foto[0]) formData.append("foto", pago.foto[0]);
  formData.append("fecha_pago", String(pago.fecha_pago));
  formData.append("fecha_inicio", String(pago.fecha_inicio));
  formData.append("fecha_fin", String(pago.fecha_fin));
  formData.append("monto", String(pago.monto));

  const membresiaId = typeof pago.membresia_id === "number" ? pago.membresia_id : pago.membresia_id?.value;
  const formaPagoId = typeof pago.forma_pago_id === "number" ? pago.forma_pago_id : pago.forma_pago_id?.value;

  formData.append("membresia_id", String(membresiaId));
  formData.append("forma_pago_id", String(formaPagoId));

  formData.append("cobrador_id", String(pago.cobrador_id)); 
  formData.append("numero_recibo", String(pago.numero_recibo)); 
  formData.append("estado", String(pago.estado)); 


  const response = await fetch(url("/registro-pago"), {
    method: "POST",
    body: formData
  });
  if (!response.ok) throw new Error("Error al crear el pago");
  return response.json();
};

export const updatePago = async (pago: any, id: number) => {
  const formData = new FormData();
  if (pago.foto && pago.foto[0]) formData.append("foto", pago.foto[0]);
  const membresiaId = typeof pago.membresia_id === "number" ? pago.membresia_id : pago.membresia_id?.value;
  const formaPagoId = typeof pago.forma_pago_id === "number" ? pago.forma_pago_id : pago.forma_pago_id?.value;
  formData.append("fecha_pago", String(pago.fecha_pago));
  formData.append("fecha_inicio", String(pago.fecha_inicio));
  formData.append("fecha_fin", String(pago.fecha_fin));
  formData.append("monto", String(pago.monto));
  formData.append("membresia_id", String(membresiaId));
  formData.append("forma_pago_id", String(formaPagoId));
  formData.append("cobrador_id", String(pago.cobrador_id)); 
  formData.append("numero_recibo", String(pago.numero_recibo)); 
  formData.append("estado", String(pago.estado)); 


  const response = await fetch(url(`/registro-pago/${id}`), {
    method: "PUT",
    body: formData
  });
  if (!response.ok) throw new Error("Error al actualizar el pago");
  return response.json();
};

export const deletePago = async (id: number) => {
  const response = await fetch(url(`/registro-pago/${id}`), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) throw new Error("Error al eliminar el pago");
  return response.json();
};

export const getFormasPago = async () => {
  const response = await fetch(url("/formas_pago/read"), {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) throw new Error("Error al obtener formas de pago");
  return response.json();
};

export const getPagosMembresia = async(id:number) => {
  const res = await fetch(url(`/registros-pago/membresia/${id}`), {
    method: 'GET',
    headers: { 'Content-Type' : 'application/json' }
  })
  const data = res.json()
  return data;
}

