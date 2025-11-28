const RAW = String(import.meta.env.VITE_URL_BACK || "");
const BASE = RAW.replace(/\/+$/, "");
const url = (path: string) => `${BASE}/${String(path).replace(/^\/+/, "")}`;

const OCR_URL = import.meta.env.VITE_MICRO_OCR_URL;

// Redimensiona y baja calidad
const comprimirImagen = (file: File): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const tmp = URL.createObjectURL(file);
    img.src = tmp;
    img.onload = () => {
      const MAX = 1200;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(tmp);
          blob ? resolve(blob) : reject("Error al comprimir");
        },
        "image/jpeg",
        0.75
      );
    };
    img.onerror = () => reject("Error al cargar imagen");
  });

//CACHE PARA NO REPETIR OCR 
const ocrCache = new Map<string, any>();

//LLAMADA OCR + MAPEO
export const procesarImagenOCR = async (file: File) => {
  // Si ya lo hizo devolve de una
  if (ocrCache.has(file.name)) return ocrCache.get(file.name);

  const lite = await comprimirImagen(file);
  const fd = new FormData();
  fd.append("archivo", lite, file.name);

  // Petición
  const res = await fetch(`${OCR_URL}/procesar/`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("OCR falló");
  const raw = await res.json();

  // Normalizar campos
  const monto = Number(String(raw.campos?.valor || "0")
    .replace(/\./g, "")
    .replace(/,/g, ""));

  const map: Record<string, number> = {
    nequi: 4,
    daviplata: 4,
    bancolombia: 13,
    davivienda: 3,
  };

  const out = {
    fecha_pago: raw.campos?.fecha || "",
    monto,
    numero_recibo: raw.campos?.referencia || "",
    forma_pago_id: map[raw.tipo_comprobante],
  };

  ocrCache.set(file.name, out);
  return out;
};


export const getPagos = async () => {
  const res = await fetch(url("/registros-pago"), { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Error al obtener pagos");
  return res.json();
};

export const createPago = async (p: any) => {
  const fd = new FormData();
  if (p.foto?.[0]) fd.append("foto", p.foto[0]);
  fd.append("fecha_pago", String(p.fecha_pago));
  fd.append("fecha_inicio", String(p.fecha_inicio));
  fd.append("fecha_fin", String(p.fecha_fin));
  fd.append("monto", String(p.monto));
  fd.append("membresia_id", String(p.membresia_id));
  fd.append("forma_pago_id", String(p.forma_pago_id));
  fd.append("cobrador_id", String(p.cobrador_id));
  fd.append("numero_recibo", String(p.numero_recibo));
  fd.append("estado", String(p.estado));
  const res = await fetch(url("/registro-pago"), { method: "POST", body: fd });
  if (!res.ok) throw new Error("Error al crear pago");
  return res.json();
};

export const updatePago = async (p: any, id: number) => {
  const fd = new FormData();
  if (p.foto?.[0]) fd.append("foto", p.foto[0]);
  fd.append("fecha_pago", String(p.fecha_pago));
  fd.append("fecha_inicio", String(p.fecha_inicio));
  fd.append("fecha_fin", String(p.fecha_fin));
  fd.append("monto", String(p.monto));
  fd.append("membresia_id", String(p.membresia_id));
  fd.append("forma_pago_id", String(p.forma_pago_id));
  fd.append("cobrador_id", String(p.cobrador_id));
  fd.append("numero_recibo", String(p.numero_recibo));
  fd.append("estado", String(p.estado));
  const res = await fetch(url(`/registro-pago/${id}`), { method: "PUT", body: fd });
  if (!res.ok) throw new Error("Error al actualizar pago");
  return res.json();
};

export const deletePago = async (id: number) => {
  const res = await fetch(url(`/registro-pago/${id}`), { method: "DELETE", headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Error al eliminar pago");
  return res.json();
};

export const getFormasPago = async () => {
  const res = await fetch(url("/formas_pago/read"), { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Error al obtener formas de pago");
  return res.json();
};

export const getPagosMembresia = async (id: number) => {
  const res = await fetch(url(`/registros-pago/membresia/${id}`), { headers: { "Content-Type": "application/json" } });
  return res.json();
};

export const getPagosAsignados = async (id_usuario: string) => {
  try {
    const res = await fetch(url(`registros-pago/asignados/${id_usuario}`));
    return res.json();
  } catch {
    return { data: [], message: "Error al cargar pagos asignados" };
  }
};

export const setEstadoPago = async (estado: string, id_pago: number) => {
  try {
    await fetch(url(`registros-pago/set/estado/${estado}/${id_pago}`), { method: "PATCH", headers: { "Content-Type": "application/json" } });
    return "Estado actualizado";
  } catch {
    return "Error al cambiar estado";
  }
};

export const subirEvidenciaPago = async (file: File, id_pago: number | string) => {
  const fd = new FormData();
  fd.append("evidencia", file);
  const res = await fetch(url(`/registros-pago/subir/evidencia/${id_pago}`), { method: "PATCH", body: fd });
  return res.json();
};