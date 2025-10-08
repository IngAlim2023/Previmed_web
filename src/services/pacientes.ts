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