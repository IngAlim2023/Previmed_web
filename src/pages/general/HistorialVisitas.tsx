import { useState, useEffect } from "react"

// Interfaz para la info del historial
interface InfoHistorial {
  nombre: string;
  segundo_nombre: string;
  apellido: string;
  segundo_apellido: string;
  fecha: Date;
  hora: string;
}

// Objeto temporal con datos de ejemplo
const pacientesTemporales: InfoHistorial[] = [
  {
    nombre: "Juan",
    segundo_nombre: "Carlos",
    apellido: "Pérez",
    segundo_apellido: "Gómez",
    fecha: new Date("2025-07-10"),
    hora: "09:30",
  },
  {
    nombre: "Ana",
    segundo_nombre: "Lucía",
    apellido: "Martínez",
    segundo_apellido: "Rodríguez",
    fecha: new Date("2025-07-12"),
    hora: "14:15",
  },
];

const HistorialVisitas: React.FC = () => {
  const [pacientes, setPacientes] = useState<InfoHistorial[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Simula la carga de datos
  useEffect(() => {
    setTimeout(() => {
      setPacientes(pacientesTemporales);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Contenido principal */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-teal-800 mb-6">Historial de Visitas</h1>
        {loading ? (
          <div className="text-center text-teal-600">Cargando...</div>
        ) : (
          <div className="grid gap-6">
            {pacientes.map((p, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md border border-gray-200 transition-all"
              >
                <button
                  className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                >
                  <span className="font-semibold text-teal-700">
                    {p.nombre} {p.segundo_nombre} {p.apellido} {p.segundo_apellido}
                  </span>
                  <span className="text-gray-500">
                    {p.fecha.toLocaleDateString()}
                  </span>
                </button>
                {expanded === idx && (
                  <div className="px-6 pb-4 text-gray-700 animate-fade-in">
                    <div>
                      <span className="font-medium">Fecha:</span>{" "}
                      {p.fecha.toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Hora:</span> {p.hora}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistorialVisitas
