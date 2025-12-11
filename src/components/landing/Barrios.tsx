import { useEffect, useState } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { DataBarrio } from "../../interfaces/Barrio";
import { getBarrios } from "../../services/barrios";

const Barrios: React.FC = () => {
  const [barrios, setBarrios] = useState<DataBarrio[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBarrios, setFilteredBarrios] = useState<DataBarrio[]>([]);

  useEffect(() => {
    const getdata = async () => {
      const res = await getBarrios();
      setBarrios(res);
      setFilteredBarrios(res.filter((b) => b.habilitar));
    };
    getdata();
  }, []);

  useEffect(() => {
    const filtered = barrios
      .filter((b) => b.habilitar)
      .filter((barrio) =>
        barrio.nombreBarrio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredBarrios(filtered);
  }, [searchTerm, barrios]);

  return (
    <section id="barrios" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div
        className="max-w-3xl mx-auto text-center mb-12 px-4"
        data-aos="fade-up"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Zonas de Cobertura
        </h2>
        <p className="text-lg text-gray-600">
          Descubre si MediHome está disponible en tu barrio
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

          <div className="w-full lg:w-3/5">
            <div className="rounded-2xl shadow-2xl overflow-hidden">
              <img
                src="https://res.cloudinary.com/dudqqzt1k/image/upload/v1765465027/medico_map_qdbjbm.png"
                alt="Mapa de cobertura MediHome"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/3" data-aos="fade-left">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Buscador */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar barrio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {filteredBarrios.length} {filteredBarrios.length === 1 ? 'barrio disponible' : 'barrios disponibles'}
                </p>
              </div>

              <div className="overflow-y-auto max-h-[420px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                {filteredBarrios.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredBarrios.map((zona, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-3 hover:bg-blue-50 transition-colors duration-150 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <FiMapPin className="w-4 h-4 text-blue-600 group-hover:text-blue-700 flex-shrink-0" />
                          <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                            {zona.nombreBarrio}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <FiSearch className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-center">
                      No se encontraron barrios con "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Nota informativa */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">¿No ves tu barrio?</span> Contáctanos 
                para conocer futuras expansiones de cobertura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Barrios;