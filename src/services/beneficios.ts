const URL_BACK = import.meta.env.VITE_URL_BACK

// 🔹 Obtener todos los beneficios
export const getBeneficios = async () => {
  try {
    const res = await fetch(`${URL_BACK}beneficios/read`)
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)

    const data = await res.json()
    const beneficios = Array.isArray(data)
      ? data.map((b) => ({
          id_beneficio: b.idBeneficio ?? b.id_beneficio,
          tipo_beneficio: b.tipoBeneficio ?? b.tipo_beneficio,
        }))
      : []

    console.log("📦 Beneficios recibidos:", beneficios)
    return beneficios
  } catch (e) {
    console.error("Error al obtener beneficios:", e)
    return []
  }
}

// 🔹 Crear beneficio
export const createBeneficio = async (data: any) => {
  try {
    console.log("📤 Enviando al backend:", data)

    const res = await fetch(`${URL_BACK}beneficios/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ el backend espera tipo_beneficio, no tipoBeneficio
      body: JSON.stringify({ tipo_beneficio: data.tipo_beneficio }),
    })

    console.log("📩 Status respuesta:", res.status)

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)

    const created = await res.json()
    console.log("📦 Respuesta del backend:", created)

    return {
      id_beneficio: created.idBeneficio ?? created.id_beneficio,
      tipo_beneficio: created.tipoBeneficio ?? created.tipo_beneficio,
    }
  } catch (error) {
    console.error("❌ Error al crear beneficio:", error)
    throw error
  }
}



// 🔹 Actualizar beneficio
export const updateBeneficio = async (id: number, data: any) => {
  try {
    const res = await fetch(`${URL_BACK}beneficios/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)

    const updated = await res.json()
    return {
      id_beneficio: updated.idBeneficio ?? id,
      tipo_beneficio: updated.tipoBeneficio ?? data.tipo_beneficio,
    }
  } catch (error) {
    console.error("❌ Error al actualizar beneficio:", error)
    throw error
  }
}

// 🔹 Eliminar beneficio
export const deleteBeneficio = async (id: number) => {
  try {
    const res = await fetch(`${URL_BACK}beneficios/delete/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
  } catch (error) {
    console.error("❌ Error al eliminar beneficio:", error)
    throw error
  }
}
