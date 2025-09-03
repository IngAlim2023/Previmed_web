import { useEffect, useState } from "react";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { medicoService } from "../../services/medicoService";
import type { MedicoResponse } from "../../interfaces/medicoInterface";
import FormMedicos from "./FormMedicos";

export default function TableMedicos() {
  const [medicos, setMedicos] = useState<MedicoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [filterDisponibilidad, setFilterDisponibilidad] = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");

  const load = () =>
    medicoService
      .getAll()
      .then((res) => setMedicos(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const toggleDisponibilidad = async (id: number, actual: boolean) => {
    await medicoService.update(id, { disponibilidad: !actual });
    load();
  };

  const toggleEstado = async (id: number, actual: boolean) => {
    await medicoService.update(id, { estado: !actual });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este médico?")) return;
    await medicoService.remove(id);
    load();
  };

  if (loading) return <p className="text-center text-gray-600">Cargando…</p>;

  const filteredMedicos = medicos.filter((m) => {
    const matchesSearch = `${m.usuario.nombre} ${m.usuario.apellido}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDisponibilidad =
      filterDisponibilidad === "all"
        ? true
        : filterDisponibilidad === "true"
        ? m.disponibilidad
        : !m.disponibilidad;

    const matchesEstado =
      filterEstado === "all"
        ? true
        : filterEstado === "true"
        ? m.estado
        : !m.estado;

    return matchesSearch && matchesDisponibilidad && matchesEstado;
  });

  return (
    <div className="w-full p-4">
      {/* Título */}
      <h1 className="text-2xl font-bold text-teal-900 mb-6">Lista de Médicos</h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
        {/* Buscar */}
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />


        <select
          value={filterDisponibilidad}
          onChange={(e) => setFilterDisponibilidad(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">Todas las disponibilidades</option>
          <option value="true">Disponible</option>
          <option value="false">No disponible</option>
        </select>


        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">Todos los estados</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      {filteredMedicos.length ? (
        <div className="space-y-4">
          {filteredMedicos.map((m) => (
            <div
              key={m.id_medico}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-teal-800">
                  {m.usuario.nombre} {m.usuario.apellido}
                </p>
                <p className="text-sm text-gray-600">{m.usuario.email}</p>

                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded font-medium ${
                      m.disponibilidad
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Disponible: {m.disponibilidad ? "Sí" : "No"}
                  </span>

                  <span
                    className={`px-2 py-1 rounded font-medium ${
                      m.estado
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Estado: {m.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() =>
                      toggleDisponibilidad(m.id_medico, m.disponibilidad)
                    }
                    className="text-xs bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded transition"
                  >
                    Cambiar disponibilidad
                  </button>
                  <button
                    onClick={() => toggleEstado(m.id_medico, m.estado)}
                    className="text-xs bg-slate-500 hover:bg-slate-600 text-white px-3 py-1 rounded transition"
                  >
                    Cambiar estado
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleDelete(m.id_medico)}
                className="text-red-500 hover:text-red-700 transition"
                title="Eliminar"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No se encontraron médicos</p>
      )}

      {/* BOTÓN FLOTANTE AGREGAR MÉDICO */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition flex items-center justify-center"
        title="Agregar médico"
      >
        <FiPlus size={24} />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Nuevo médico
            </h2>
            <FormMedicos
              onSuccess={() => {
                setShowModal(false);
                load();
              }}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
