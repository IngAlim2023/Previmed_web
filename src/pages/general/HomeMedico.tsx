import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

import doctorHombre from "../../assets/doctor-hombre.jpeg";
import doctorMujer from "../../assets/doctor-mujer.jpeg";

interface Medico {
  id: number;
  nombre: string;
  disponible: boolean;
  estado: boolean;
  enVisita: boolean; // 🔹 nuevo campo lógico (solo frontend)
  pacientes: number;
  experiencia: string;
  imagenUrl: string;
  descripcion: string;
}

const HomeMedico: React.FC = () => {
  const { user } = useAuthContext();
  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_URL_BACK;

  const getProfileImage = (nombre: string, genero?: string): string => {
    if (genero) {
      const g = genero.toLowerCase();
      return g === "femenino" ? doctorMujer : doctorHombre;
    }
    const isFemenino = nombre.trim().toLowerCase().endsWith("a");
    return isFemenino ? doctorMujer : doctorHombre;
  };

  useEffect(() => {
    const fetchMedico = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/medicos`);
        if (!res.ok) throw new Error("Error al obtener lista de médicos");

        const data = await res.json();
        const medicoEncontrado = data.data.find(
          (m: any) => m.usuario_id === user.id
        );

        if (!medicoEncontrado) {
          toast.error("No se encontró el médico asociado a este usuario");
          return;
        }

        const nombreCompleto = `${medicoEncontrado.usuario.nombre} ${medicoEncontrado.usuario.apellido}`;

        setMedico({
          id: medicoEncontrado.id_medico,
          nombre: nombreCompleto,
          disponible: medicoEncontrado.disponibilidad,
          estado: medicoEncontrado.estado,
          enVisita: false, // 🔹 inicialmente no está en visita
          pacientes: 120,
          experiencia: "10 años",
          imagenUrl: getProfileImage(
            medicoEncontrado.usuario.nombre,
            medicoEncontrado.usuario.genero
          ),
          descripcion:
            "Recuerda que nuestros pacientes son muy importantes. Brinda siempre una atención de calidad.",
        });
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los datos del médico");
      } finally {
        setLoading(false);
      }
    };

    if (user.id) fetchMedico();
  }, [user.id, API_URL]);

  // 🔹 Simular inicio / fin de visita médica
  const toggleVisita = async () => {
    if (!medico) return;
    try {
      setUpdating(true);

      const nuevoEnVisita = !medico.enVisita;

      // 🔹 Lógica principal
      // Si está en visita -> disponible pero inactivo
      // Si no está en visita -> disponible y activo
      const nuevoEstado = nuevoEnVisita ? false : true;

      const body = {
        disponibilidad: medico.disponible,
        estado: nuevoEstado,
      };

      const res = await fetch(`${API_URL}/medicos/${medico.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al cambiar estado");

      setMedico({
        ...medico,
        enVisita: nuevoEnVisita,
        estado: nuevoEstado,
      });

      toast.success(
        nuevoEnVisita
          ? "El médico está en una visita (inactivo temporalmente)"
          : "El médico ha terminado la visita y está activo nuevamente"
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el estado del médico");
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 Cambiar disponibilidad (activo/inactivo general)
  const toggleDisponibilidad = async () => {
    if (!medico) return;
    try {
      setUpdating(true);

      const nuevaDisponibilidad = !medico.disponible;

      const body = {
        disponibilidad: nuevaDisponibilidad,
        estado: nuevaDisponibilidad ? true : false,
      };

      const res = await fetch(`${API_URL}/medicos/${medico.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al cambiar disponibilidad");

      setMedico({
        ...medico,
        disponible: nuevaDisponibilidad,
        estado: nuevaDisponibilidad ? true : false,
        enVisita: false,
      });

      toast.success(
        nuevaDisponibilidad
          ? "Ahora estás disponible y activo"
          : "Has pasado a no disponible (inactivo)"
      );
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar la disponibilidad");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Cargando datos del médico...</p>
      </div>
    );

  if (!medico)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">
          No se encontró información del médico.
        </p>
      </div>
    );

  // 🔹 Color dinámico según estado general
  const estadoColor = !medico.disponible
    ? "bg-red-500 hover:bg-red-600"
    : medico.enVisita
    ? "bg-yellow-500 hover:bg-yellow-600"
    : "bg-green-500 hover:bg-green-600";

  return (
    <div className="flex min-h-screen bg-blue-50 transition-colors duration-500">
      <div className="flex-1 p-6 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row items-center p-6 md:p-10 border border-blue-100">
          {/* Imagen */}
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
            <img
              src={medico.imagenUrl}
              alt={`Dr(a). ${medico.nombre}`}
              className="rounded-lg object-cover h-60 w-60 shadow-md"
            />
          </div>

          {/* Información */}
          <div className="md:w-2/3 md:pl-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{medico.nombre}</h2>
            <p className="text-gray-500 text-sm mt-1">Médico general</p>

            {/* Estado visual */}
            <div className="flex items-center justify-center md:justify-start mt-3">
              <span
                className={`h-3 w-3 rounded-full mr-2 ${
                  !medico.disponible
                    ? "bg-red-500"
                    : medico.enVisita
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
              />
              <span
                className={`font-semibold ${
                  !medico.disponible
                    ? "text-red-600"
                    : medico.enVisita
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {!medico.disponible
                  ? "Inactivo"
                  : medico.enVisita
                  ? "En visita médica"
                  : "Activo"}
              </span>
            </div>

            {/* Pacientes y experiencia */}
            <div className="flex justify-between md:justify-start gap-10 mt-4 text-center">
              <div>
                <p className="text-xl font-semibold">{medico.pacientes}</p>
                <p className="text-sm text-gray-500">Pacientes</p>
              </div>
              <div>
                <p className="text-xl font-semibold">{medico.experiencia}</p>
                <p className="text-sm text-gray-500">Experiencia</p>
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-700 mb-1">
                Acerca de:
              </h3>
              <p className="text-sm text-gray-600">{medico.descripcion}</p>
            </div>

            {/* Botones */}
            <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center md:justify-start">
              {/* Botón disponibilidad */}
              <button
                onClick={toggleDisponibilidad}
                disabled={updating}
                className={`text-white font-bold py-2 px-6 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 ${
                  medico.disponible
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {updating
                  ? "Actualizando..."
                  : medico.disponible
                  ? "DISPONIBLE"
                  : "NO DISPONIBLE"}
              </button>

              {/* Botón cambiar estado (visita médica) */}
              {medico.disponible && (
                <button
                  onClick={toggleVisita}
                  disabled={updating}
                  className={`text-white font-bold py-2 px-6 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 ${estadoColor}`}
                >
                  {updating
                    ? "Actualizando..."
                    : medico.enVisita
                    ? "FINALIZAR VISITA"
                    : "INICIAR VISITA"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMedico;
