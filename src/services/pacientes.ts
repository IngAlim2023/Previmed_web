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


export const getTitulares = async () => {
  try {
    const titulares = await fetch(`${URL_BACK}pacientes/titular`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!titulares.ok) throw new Error("Error al obtener los titulares");

    return titulares.json();
  } catch (e) {
    return { msj: "Error" };
  }
};

export const readBeneficiarios = async () => {
  try {
    const info = await fetch(`${import.meta.env.VITE_URL_BACK}pacientes`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!info.ok) {
      console.warn("⚠️ El servidor respondió con error:", info.status);
      return { data: [] };
    }

    const res = await info.json();
    const raw = Array.isArray(res) ? res : res.data || [];

    if (!raw.length) {
      console.warn("⚠️ No hay pacientes en la base de datos");
      return { data: [] };
    }

    // 🔹 Separar titulares y beneficiarios
    const titulares = raw.filter((t: any) => t.pacienteId === null);
    const beneficiarios = raw.filter((b: any) => b.pacienteId !== null);

    console.log("🧩 Titulares detectados:", titulares);
    console.log("🧩 Beneficiarios detectados:", beneficiarios);

    if (!beneficiarios.length) {
      console.warn("⚠️ No se encontraron beneficiarios en la base de datos.");
      return { data: [] };
    }

    // 🔹 Crear un mapa de titulares por ID
    const titularesMap = new Map(
      titulares.map((t: any) => [
        String(t.idPaciente),
        `${t.usuario?.nombre || ""} ${t.usuario?.apellido || ""}`.trim(),
      ])
    );

    // 🔹 Armar la lista de beneficiarios con su titular correspondiente
    const data = beneficiarios.map((b: any, index: number) => {
      const titularNombre = titularesMap.get(String(b.pacienteId));

      return {
        id: b.idPaciente || index,
        nombre: b.usuario?.nombre || "",
        apellido: b.usuario?.apellido || "",
        documento: b.usuario?.numeroDocumento || "",
        email: b.usuario?.email || "",
        titular: titularNombre || "Sin titular",
      };
    });

    console.log("✅ Resultado final normalizado:", data);
    return { data };
  } catch (e) {
    console.error("❌ Error en readBeneficiarios:", e);
    return { data: [] };
  }
};
export const createBeneficiario = async (data: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_URL_BACK}pacientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("❌ Error al crear beneficiario:", error);
    return { message: "Error" };
  }
};
