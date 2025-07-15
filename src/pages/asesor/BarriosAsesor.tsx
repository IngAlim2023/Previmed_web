import React, { useState, useMemo } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

/* ─────────  Datos de prueba  ────────── */
interface Barrio {
  id: number;
  nombre: string;
  ciudad: string;
}

const BARRIOS: Barrio[] = [
  { id: 1, nombre: 'El Cadillal', ciudad: 'Popayán' },
  { id: 2, nombre: 'El Pajonal', ciudad: 'Popayán' },
  { id: 3, nombre: 'Bella Vista', ciudad: 'Popayán' },
  { id: 4, nombre: 'Esmeralda', ciudad: 'Popayán' },
  { id: 5, nombre: 'Las Américas', ciudad: 'Popayán' },
  { id: 6, nombre: 'San Eduardo', ciudad: 'Popayán' },
  { id: 7, nombre: 'La Paz', ciudad: 'Popayán' },
  { id: 8, nombre: 'La Ladera', ciudad: 'Popayán' },
];

/* ─────────  Componente  ────────── */
const BarriosAsesor: React.FC = () => {
  const [query, setQuery] = useState('');

  const barriosFiltrados = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q === ''
      ? BARRIOS
      : BARRIOS.filter((b) => b.nombre.toLowerCase().includes(q));
  }, [query]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#d6ecff] via-white to-[#f0f9ff]">
      {/* Padding top para que no lo tape el NavBar */}
      <div className="pt-24 px-4 pb-10 flex flex-col items-center">
        {/* Título y buscador centrados */}
        <div className="mb-8 w-full max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-[#003366] mb-4">Barrios</h1>

          <div className="relative w-full max-w-xs mx-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar barrio…"
              className="w-full rounded-full border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
            <IoSearchOutline className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Lista de barrios */}
        <section className="w-full max-w-3xl space-y-4 overflow-y-auto">
          {barriosFiltrados.length === 0 ? (
            <p className="text-center text-slate-500">Sin resultados…</p>
          ) : (
            barriosFiltrados.map((b) => (
              <article
                key={b.id}
                className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-sky-800">
                  {b.nombre}
                </h2>
                <span className="text-sm text-slate-500">{b.ciudad}</span>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
};

export default BarriosAsesor;
