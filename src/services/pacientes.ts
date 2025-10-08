const URL_BACK = import.meta.env.VITE_URL_BACK;
export const readPacientes = async () => {
  try {
    const info = await fetch(`${URL_BACK}pacientes`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!info.ok) throw new Error("Error al leer pacientes");

    return await info.json();
  } catch (e) {
    console.error("Error en readPacientes:", e);
    return { data: [] };
  }
};


export const createPaciente = async (data:any) =>{
  try{
    const info = await fetch(`${URL_BACK}pacientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      const res = await info.json()
      return res
    } catch(e){
      return {msg: 'Error'}
  }
}

export const deletePaciente = async ( id:number) =>{
  try{
    const info = await fetch(`${URL_BACK}pacientes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const res = await info.json()
      return res
    } catch(e){
      return {msg: 'Error'}
  }
}

export const getTitulares = async() => {
  try {
    const titulares = await fetch(`${URL_BACK}pacientes/titular`,{
      method:"GET",
      headers: { "Content-Type": "application/json" }
    });

    if(!titulares.ok) throw new Error("Error al obtener los titulares");

    return titulares.json();
  } catch (e) {
    return {msj:'Error'}
  }
  
}
export const readBeneficiarios = async () => {
  try {
    const info = await fetch(`${URL_BACK}pacientes/beneficiarios`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // Si el servidor devuelve 500 o error vacío
    if (!info.ok) {
      console.warn("⚠️ El servidor respondió con error (", info.status, ")");
      return { data: [] };
    }

    const res = await info.json();

    // Si el backend devuelve {"message":"Error","error":""}
    if (res.message === "Error") {
      console.warn("⚠️ Backend devolvió mensaje de error vacío");
      return { data: [] };
    }

    // Si no hay datos válidos
    if (!Array.isArray(res) && !Array.isArray(res.data)) {
      console.warn("⚠️ No hay datos válidos en la respuesta");
      return { data: [] };
    }

    // Si viene res.data (estructura común)
    return { data: Array.isArray(res) ? res : res.data };
  } catch (e) {
    console.error("❌ Error en readBeneficiarios:", e);
    return { data: [] };
  }
};
