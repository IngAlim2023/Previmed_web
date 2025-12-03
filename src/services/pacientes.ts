const URL_BACK = import.meta.env.VITE_URL_BACK;

const url = (path: string) =>
  `${URL_BACK}`.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");

/* ===== PACIENTES (CRUD básico) ===== */
export const readPacientes = async () => {
  try {
    const info = await fetch(url("/pacientes"), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!info.ok) throw new Error(`HTTP ${info.status}`);
    return await info.json();
  } catch (e) {
    console.error("Error en readPacientes:", e);
    return { data: [] };
  }
};

export const createPaciente = async (data: any) => {
  try {
    const info = await fetch(url("/pacientes"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const res = await info.json();
    if (!info.ok) return { message: "Error", error: res?.error || `HTTP ${info.status}` };
    return res;
  } catch (e: any) {
    return { message: "Error", error: e?.message || "Network error" };
  }
};

export const updatePaciente = async(data:any) => {
  try {
    const res = await fetch(url(`/pacientes/${data.id_paciente}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const resJson = await res.json()
    console.log(resJson)
    return {message:'Paciente actualizado corectamente', ok:true}
  } catch (error) {
    return {message:'Error al actualizar el paciente', ok:false}
  }
}

export const deletePaciente = async (id: number) => {
  try {
    const info = await fetch(url(`/pacientes/${id}`), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const res = await info.json();
    if (!info.ok) return { message: "Error", error: res?.error || `HTTP ${info.status}` };
    return res;
  } catch (e: any) {
    return { message: "Error", error: e?.message || "Network error" };
  }
};

/* ===== TITULARES (lista) =====
   Algunos despliegues exponen /titular (root) y otros /pacientes/titular.
   Hacemos fallback y filtramos a verdaderos titulares en el front. */
export const getTitulares = async () => {
  const hit = async (p: string) => {
    try {
      const r = await fetch(url(p), { headers: { "Content-Type": "application/json" } });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return null;
      return j;
    } catch {
      return null;
    }
  };

  // intenta /titular, si no /pacientes/titular
  const a = await hit("/titular");
  const b = a ?? (await hit("/pacientes/titular"));

  const arr = Array.isArray(b?.data) ? b.data : Array.isArray(b) ? b : [];
  // devolvemos tal cual (el front filtra beneficiario === false e id_paciente válido)
  return { data: arr };
};

/* ===== BENEFICIARIOS (root) ===== */
export const readBeneficiarios = async () => {
  try {
    const info = await fetch(url("/beneficiarios"), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const res = await info.json();
    if (!info.ok) {
      console.warn("readBeneficiarios:", res?.error || `HTTP ${info.status}`);
      return { data: [] };
    }
    if (Array.isArray(res)) return { data: res };
    if (Array.isArray(res?.data)) return { data: res.data };
    return { data: [] };
  } catch (e) {
    console.error("❌ Error en readBeneficiarios:", e);
    return { data: [] };
  }
};

export const createBeneficiario = async (data: any) => {
  try {
    const info = await fetch(url("/beneficiarios"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const res = await info.json();
    if (!info.ok) return { message: "Error", error: res?.error || `HTTP ${info.status}` };
    return res; // { message, data }
  } catch (e: any) {
    console.error("Error en createBeneficiario:", e);
    return { message: "Error", error: e?.message || "Network error" };
  }
};

export const deleteBeneficiario = async (id: number) => {
  try {
    const info = await fetch(url(`/beneficiarios/${id}`), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const res = await info.json();
    if (!info.ok) return { message: "Error", error: res?.error || `HTTP ${info.status}` };
    return res;
  } catch (e: any) {
    console.error("Error en deleteBeneficiario:", e);
    return { message: "Error", error: e?.message || "Network error" };
  }
};

export const desvincularBeneficiario = async (beneficiario_id: number, desactivar = true) => {
  try {
    const info = await fetch(url("/beneficiarios/desvincular"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beneficiario_id, desactivar }),
    });
    const res = await info.json();
    if (!info.ok) return { message: "Error", error: res?.error || `HTTP ${info.status}` };
    return res;
  } catch (e: any) {
    console.error("Error en desvincularBeneficiario:", e);
    return { message: "Error", error: e?.message || "Network error" };
  }
};

export const asociarBeneficiario = async (beneficiario_id: number, titular_id: number) => {
  try {
    const info = await fetch(url("/beneficiarios/asociar"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beneficiario_id, titular_id }),
    });
    const res = await info.json();
    if (!info.ok) return { message: "Error", error: res?.error || `HTTP ${info.status}` };
    return res;
  } catch (e: any) {
    console.error("Error en asociarBeneficiario:", e);
    return { message: "Error", error: e?.message || "Network error" };
  }
};

export const getUsuarioDeBeneficiario = async (id: number) => {
  try {
    const info = await fetch(url(`/beneficiarios/${id}/usuario`), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const res = await info.json();
    if (!info.ok) return { message: "Error", error: res?.error || `HTTP ${info.status}` };
    return res; // { data: { usuario_id, usuario }, message? }
  } catch (e: any) {
    console.error("Error en getUsuarioDeBeneficiario:", e);
    return { message: "Error", error: e?.message || "Network error" };
  }
};

export const registroCompletoTitular = async(data:any) => {
  try {
    const res = await fetch(url('/paciente/crear-titular'), {
      method: 'POST', 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    const resFinal = await res.json()
    // resFinal contiene data y message
    return resFinal
  } catch (error) {
    return('Error al crear el titular')
  }
}

// trae el titular y sus beneficiarios, los usuarios con ese id del context
export const getPacientesId = async(id: string) => {
  try {
    const res = await fetch(url('/usuarios/pacientes/'+id), {
      method:'GET',
      headers: { "Content-Type": "application/json" }
    })
    const data = res.json()
    return data
  } catch (error) {
    return 'Error al traer los usuarios'
  }
}

// registrar pacientes por medio del excel
export const importExcelPacientes = async (formData: FormData) => {
  try {
    const response = await fetch(url('/import/pacientes/excel'), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la importación');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// exportar csv con los pacientes
export const exportPacientes = async(filtro: string) => {
  try {
    const response = await fetch(url(`/export/pacientes/excel/${filtro}`), {
      method: 'GET',
      headers: { 'Accept': 'text/csv' },
    })

    if (!response.ok) {
      throw new Error('Error al descargar el archivo');
    }

    const blob = await response.blob();
    return blob;
    
  } catch (error) {
    throw new Error('Error al descargar el archivo');
  }
}