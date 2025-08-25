import { PostPagoInterface } from "../interfaces/Pagos";

const URL_BACK = import.meta.env.VITE_URL_BACK;
const cloude_name = import.meta.env.VITE_CLOUDE_NAME;
const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
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

export const subirImgCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", upload_preset); // configurado en cloudinary
  // upload_preset y cloude_name los encuentras en cloudinary con la cuenta del proyecto
  // inicia sesion y ponlos en el archivo .env, si no lo tienes crealo.
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloude_name}/image/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error("Error al subir la imagen");

  const data = await res.json();
  return data.secure_url; // retorna la url de la imagen
};


export const createPago = async(pago : PostPagoInterface) => {
  try {
    const pagoCorregido = {
      foto: pago.foto ?? null,
      fecha_pago: pago.fecha_pago,
      fecha_inicio: pago.fecha_inicio,
      fecha_fin: pago.fecha_fin,
      monto: pago.monto,
      membresia_id: pago.membresia_id?.value,
      forma_pago_id: pago.forma_pago_id?.value,
    }
    const response = await fetch(`${URL_BACK}registro-pago`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pagoCorregido)
    });
    if(!response.ok)throw new Error("Error al crear el pago");

    return response.json();
  } catch (error) {
    throw new Error("Error al registrar el pago : " + error);
  }
}

export const updatePago = async(pago:PostPagoInterface, id:number) => {
  try {
    const pagoCorregido = {
      foto: pago.foto ?? null,
      fecha_pago: pago.fecha_pago,
      fecha_inicio: pago.fecha_inicio,
      fecha_fin: pago.fecha_fin,
      monto: pago.monto,
      membresia_id: pago.membresia_id?.value,
      forma_pago_id: pago.forma_pago_id?.value,
    }
    const response = await fetch(`${URL_BACK}registro-pago/${id}`,{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(pagoCorregido)
    });

    if(!response.ok)throw new Error("Error al editar el pago");

    return response.json();
  } catch (error) {
    throw new Error("Error al editar el registro de pago : " + error);
  }
}

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
