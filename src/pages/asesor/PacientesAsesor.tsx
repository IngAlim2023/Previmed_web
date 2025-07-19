import { useState } from "react";
import { Eye, PlusCircle, Search } from "lucide-react";

interface Paciente {
  id: number;
  nombre: string;
  doctor: string;
  direccion: string;
  plan: string;
}

const pacientesMock: Paciente[] = [
  { id: 1, nombre: "Carlos López", doctor: "Dr. Rivera", direccion: "Calle 123", plan: "Básico" },
  { id: 2, nombre: "Ana Ruiz", doctor: "Dra. Gómez", direccion: "Av. Central", plan: "Avanzado" },
];

const PacientesAsesor: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesMock);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Pacientes</h1>

      {/* BUSCADOR */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* LISTA DE PACIENTES */}
      <div className="space-y-3">
        {pacientesFiltrados.map((paciente) => (
          <div key={paciente.id} className="border p-4 rounded-md shadow flex justify-between items-center">
            <div>
              <p><strong>Nombre:</strong> {paciente.nombre}</p>
              <p><strong>Doctor:</strong> {paciente.doctor}</p>
              <p><strong>Dirección:</strong> {paciente.direccion}</p>
              <p><strong>Plan:</strong> {paciente.plan}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              <Eye className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      {/* BOTÓN AGREGAR PACIENTE */}
      <div className="mt-6 text-right">
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Agregar Paciente
        </button>
      </div>

      {/* FORMULARIO REGISTRO */}
      {mostrarFormulario && (
        <div className="mt-6 border p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4">Registrar nuevo paciente</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1">Tipo:</label>
              <select className="w-full border rounded-md p-2">
                <option value="titular">Titular</option>
                <option value="beneficiario">Beneficiario</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Nombre completo:</label>
              <input type="text" className="w-full border rounded-md p-2" required />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Registrar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PacientesAsesor;
