// src/services/visitasService.ts
import { Visita } from "../interfaces/visitas";

const BASE_URL = import.meta.env.VITE_URL_BACK;

export const historialVisitas = {
 async getByPacienteId(pacienteId: number): Promise<Visita[]> {
    try {
      const res = await fetch(`${BASE_URL}visitas/paciente/${pacienteId}`);
      if (!res.ok) throw new Error("No se encontraron visitas");
      
      const data = await res.json();
      const arr = Array.isArray(data?.msj)
        ? data.msj
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      
      return this._normalize(arr);
    } catch {
      return [];
    }
  },

  /**
   * Normaliza un array de visitas (maneja diferentes estructuras de respuesta)
   */
  _normalize(arr: any[]): Visita[] {
    return arr.map((v) => this._normalizeOne(v));
  },

  /**
   * Normaliza una visita individual
   */
  _normalizeOne(v: any): Visita {
    return {
      id_visita: v.id_visita ?? v.idVisita ?? v.id,
      fecha_visita: v.fecha_visita ?? v.fechaVisita ?? v.fecha,
      descripcion: v.descripcion ?? "",
      direccion: v.direccion ?? "",
      estado: Boolean(v.estado ?? v.activo ?? true),
      telefono: v.telefono ?? "",
      paciente_id: v.paciente_id ?? v.pacienteId,
      medico_id: v.medico_id ?? v.medicoId,
      barrio_id: v.barrio_id ?? v.barrioId,
    };
  },
};