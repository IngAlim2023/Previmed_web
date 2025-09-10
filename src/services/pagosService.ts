import { PostPagoInterface } from "../interfaces/Pagos";

const URL_BACK = import.meta.env.VITE_URL_BACK;
// tendras que poner primero la VITE_URL_BACK en el .env, de lo contrario no te funcionará

export const getPagos = async() => {
  try {
    const response = await fetch(`${URL_BACK}registros-pago`,{
      method:"GET",
      headers:{"Content-Type":"application/json"}
    });
    
    if(!response.ok)throw new Error("Error al obtener los pagos");

    return response.json();
  } catch (error) {
    throw new Error("Error al obtener los pagos : " + error);
  }
}

export const createPago = async (pago: PostPagoInterface) => {
  try {
    const formData = new FormData();
    if (pago.foto && (pago.foto as any)[0]) {
      formData.append("foto", (pago.foto as any)[0]);
    }

    formData.append("fecha_pago", String(pago.fecha_pago));
    formData.append("fecha_inicio", String(pago.fecha_inicio));
    formData.append("fecha_fin", String(pago.fecha_fin));
    formData.append("monto", String(pago.monto));
    formData.append("membresia_id", String(pago.membresia_id?.value));
    formData.append("forma_pago_id", String(pago.forma_pago_id?.value));

    const response = await fetch(`${URL_BACK}registro-pago`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Error al crear el pago");

    return await response.json();
  } catch (error) {
    throw new Error("Error al registrar el pago: " + error);
  }
};

export const updatePago = async (pago: PostPagoInterface, id: number) => {
  try {
    const formData = new FormData();
    if (pago.foto && (pago.foto as any)[0]) {
      formData.append("foto", (pago.foto as any)[0]);
    }

  const membresiaId = typeof pago.membresia_id === "number"
    ? pago.membresia_id
    : pago.membresia_id?.value;

  const formaPagoId = typeof pago.forma_pago_id === "number"
    ? pago.forma_pago_id
    : pago.forma_pago_id?.value;

    formData.append("fecha_pago", String(pago.fecha_pago));
    formData.append("fecha_inicio", String(pago.fecha_inicio));
    formData.append("fecha_fin", String(pago.fecha_fin));
    formData.append("monto", String(pago.monto));
    formData.append("membresia_id", String(membresiaId));
    formData.append("forma_pago_id", String(formaPagoId));

    const response = await fetch(`${URL_BACK}registro-pago/${id}`, {
      method: "PUT",
      body: formData
    });

    if (!response.ok) throw new Error("Error al actualizar el pago");

    return await response.json();
  } catch (error) {
    throw new Error("Error al actualizar el pago: " + error);
  }
};

export const deletePago = async(id:number) => {
  try {
    const response = await fetch(`${URL_BACK}registro-pago/${id}`,{
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if(!response.ok)throw new Error("Error al eliminar el pago");
    
    return response.json();
  } catch (error) {
    throw new Error("Error al eliminar el registro de pago : " + error);
  }
}
