import React, { useEffect, useMemo, useState } from "react";

const URL_BACK = (import.meta as any).env?.VITE_URL_BACK || "";
const apiUrl = (path: string) =>
  `${URL_BACK}`.replace(/\/+$/, "") + "/" + String(path || "").replace(/^\/+/, "");

async function getJSON<T>(path: string, timeoutMs = 12000): Promise<T> {
  const url = apiUrl(path);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: ctrl.signal });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} en ${url} — ${txt.slice(0, 140)}`);
    }
    if (!ct.includes("application/json")) {
      const txt = await res.text().catch(() => "");
      throw new Error(`No JSON en ${url} — ${txt.slice(0, 140)}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}
async function getJSONSafe<T>(path: string): Promise<T | null> {
  try { return await getJSON<T>(path); }
  catch { return null; }
}
function asArray<T = any>(raw: any): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as T[];
  if (Array.isArray(raw?.data)) return raw.data as T[];
  if (Array.isArray(raw?.msj)) return raw.msj as T[];
  if (raw && typeof raw === "object") {
    const maybe = Object.values(raw).find((v) => Array.isArray(v));
    if (Array.isArray(maybe)) return maybe as T[];
  }
  return [];
}
function toISOString(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return new Date(val).toISOString();
  if (val?.toISOString) return val.toISOString();
  try { return new Date(val).toISOString(); } catch { return ""; }
}

type KPI = { pacientes_total: number; visitas_total: number; medicos_total: number };
type Visita = { id_visita: number; fecha_visita: string; descripcion: string; telefono: string; estado: boolean; };
type FormaPago = { id_forma_pago: number; tipo_pago: string; estado: boolean };
type BarDatum = { label: string; value: number };

const MiniBarChart: React.FC<{ data: BarDatum[]; title?: string; height?: number }> = ({
  data, title, height = 180
}) => {
  const W = 1000;
  // Más aire para evitar solapes con labels
  const pad = { top: 26, right: 24, bottom: 24, left: 60 };
  const innerW = W - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxV = Math.max(1, ...data.map(d => d.value));
  const barW = data.length ? innerW / data.length : innerW;
  const palette = ["#34d399","#f59e0b","#60a5fa","#a78bfa","#10b981","#f472b6","#ef4444"];

  const labelY = height - pad.bottom + 8; // etiquetas bajo la barra

  return (
    <div className="w-full">
      {title && <div className="mb-1 text-sm font-semibold text-gray-700">{title}</div>}
      <div style={{ fontSize: 0, lineHeight: 0 }}>
        <svg
          viewBox={`0 0 ${W} ${height}`}
          width="100%"
          height={height}
          style={{ display: "block", verticalAlign: "top" }}
        >
          <rect x="0" y="0" width={W} height={height} rx="10" ry="10" fill="white" stroke="#bfdbfe" />
          <line x1={pad.left} x2={pad.left} y1={pad.top} y2={height - pad.bottom} stroke="#e5e7eb" />
          {[0.33, 0.66].map((p, i) => {
            const y = pad.top + innerH * p;
            return <line key={i} x1={pad.left} x2={W - pad.right} y1={y} y2={y} stroke="#f3f4f6" />;
          })}
          {data.map((d, i) => {
            const x = pad.left + i * barW + barW * 0.18;
            const w = barW * 0.64;
            const h = (d.value / maxV) * innerH;
            const y = height - pad.bottom - h;
            const color = palette[i % palette.length];
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={Math.max(1, h)} fill={color} rx="6" ry="6" />
                {/* valor encima */}
                <text x={x + w / 2} y={y - 6} fontSize="13" textAnchor="middle" fill="#374151">
                  {d.value}
                </text>
                {/* etiqueta abajo */}
                <text x={x + w / 2} y={labelY} fontSize="12" textAnchor="middle" dominantBaseline="hanging" fill="#6b7280">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const AdminHome: React.FC = () => {
  const [kpi, setKpi] = useState<KPI>({ pacientes_total: 0, visitas_total: 0, medicos_total: 0 });
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [search, setSearch] = useState("");
  const [formasPago, setFormasPago] = useState<FormaPago[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      const rawVisitas = await getJSONSafe<any>("/visitas");
      const visitasArr: Visita[] = asArray(rawVisitas).map((v: any) => ({
        id_visita: Number(v.id_visita ?? v.idVisita ?? 0),
        fecha_visita: toISOString(v.fecha_visita ?? v.fechaVisita ?? v.fecha),
        descripcion: String(v.descripcion ?? "-"),
        telefono: String(v.telefono ?? "-"),
        estado: Boolean(v.estado ?? true),
      }));

      const rawFormas = await getJSONSafe<any>("/formas_pago/read");
      const formasArr: FormaPago[] = asArray(rawFormas).map((f: any) => ({
        id_forma_pago: Number(f.id_forma_pago ?? f.id ?? 0),
        tipo_pago: String(f.tipo_pago ?? f.nombre ?? f.descripcion ?? "-"),
        estado: Boolean(f.estado ?? true),
      }));

      const [rawPacientes, rawMedicos] = await Promise.all([
        getJSONSafe<any>("/pacientes").then(async (res) => {
          if (res) return res;
          const alt1 = await getJSONSafe<any>("/pacientes/titular");
          const alt2 = await getJSONSafe<any>("/pacientes/beneficiarios");
          return { data: [...asArray(alt1), ...asArray(alt2)] };
        }),
        getJSONSafe<any>("/medicos"),
      ]);

      if (!alive) return;

      setVisitas(visitasArr);
      setFormasPago(formasArr);
      setKpi({
        pacientes_total: asArray(rawPacientes).length,
        visitas_total: visitasArr.length,
        // TOTAL de médicos (no filtrado por estado)
        medicos_total: (() => {
          const ml = asArray(rawMedicos);
          return ml.length || 0;
        })(),
      });
      setLoading(false);
    })();

    return () => { alive = false; };
  }, []);

  const formasPagoEstado: BarDatum[] = useMemo(() => {
    const total = formasPago.length;
    const activas = formasPago.filter(f => f.estado === true).length;
    const inactivas = total - activas;
    return [
      { label: "Activas", value: activas },
      { label: "Inactivas", value: inactivas },
    ];
  }, [formasPago]);

  const visitasFiltradas = useMemo(
    () => visitas.filter((v) => (v.descripcion || "").toLowerCase().includes(search.trim().toLowerCase())),
    [visitas, search]
  );

  return (
    <>
      <style>{`body{background-color:#eff6ff}`}</style>

      <div className="min-h-screen bg-blue-50">
        <main className="min-h-screen">
          <div className="pl-2 pr-4 pt-3 pb-6">
            <div className="ml-0">
              <div className="mb-2">
                <h1 className="text-xl font-semibold text-gray-800">Panel de control</h1>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-3">
                  <div className="text-sm text-gray-600">Pacientes</div>
                  <div className="text-3xl font-semibold mt-0.5">
                    {loading ? "…" : kpi.pacientes_total.toLocaleString("es-ES")}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-3">
                  <div className="text-sm text-gray-600">Visitas</div>
                  <div className="text-3xl font-semibold mt-0.5">
                    {loading ? "…" : kpi.visitas_total.toLocaleString("es-ES")}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-3">
                  <div className="text-sm text-gray-600">Médicos</div>
                  <div className="text-3xl font-semibold mt-0.5">
                    {loading ? "…" : kpi.medicos_total.toLocaleString("es-ES")}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-3 mt-2">
                {loading ? (
                  <div className="h-36 rounded-xl bg-gray-100 animate-pulse" />
                ) : formasPago.length === 0 ? (
                  <div className="text-sm text-gray-500 p-2 text-center">No hay formas de pago registradas.</div>
                ) : (
                  <MiniBarChart
                    data={formasPagoEstado}
                    title="Formas de pago — Activas vs. Inactivas"
                    height={180}
                  />
                )}
              </div>

              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4 mt-2">
                {/* Header de Visitas sin aplastarse */}
                <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-blue-600 min-w-0">
                    <div className="h-8 w-8 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M3 10.5 12 3l9 7.5v8A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-8Zm2 .7V18h14v-6.8L12 5.7 5 11.2Zm5 7.3v-5h4v5h-4Z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 leading-none">Visitas</h2>
                  </div>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por descripción..."
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white w-full sm:w-72"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="px-4 py-2 font-medium">ID</th>
                        <th className="px-4 py-2 font-medium">Fecha</th>
                        <th className="px-4 py-2 font-medium">Descripción</th>
                        <th className="px-4 py-2 font-medium">Teléfono</th>
                        <th className="px-4 py-2 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <tr key={`v-skel-${i}`}>
                            <td className="px-4 py-3"><div className="h-4 w-8 bg-gray-100 rounded animate-pulse" /></td>
                            <td className="px-4 py-3"><div className="h-4 w-28 bg-gray-100 rounded animate-pulse" /></td>
                            <td className="px-4 py-3"><div className="h-4 w-64 bg-gray-100 rounded animate-pulse" /></td>
                            <td className="px-4 py-3"><div className="h-4 w-28 bg-gray-100 rounded animate-pulse" /></td>
                            <td className="px-4 py-3"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" /></td>
                          </tr>
                        ))
                      ) : visitasFiltradas.length === 0 ? (
                        <tr><td className="px-4 py-5 text-gray-500" colSpan={5}>No hay visitas.</td></tr>
                      ) : (
                        visitasFiltradas.map((v, i) => (
                          <tr key={`v-${v.id_visita ?? 'nil'}-${v.fecha_visita ?? 'nil'}-${i}`} className="bg-white shadow-sm">
                            <td className="px-4 py-3 rounded-l-xl text-gray-700">{v.id_visita || "-"}</td>
                            <td className="px-4 py-3 text-gray-700">
                              {v.fecha_visita ? new Date(v.fecha_visita).toLocaleDateString("es-CO") : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="truncate max-w-[28rem]">{v.descripcion}</div>
                            </td>
                            <td className="px-4 py-3">{v.telefono}</td>
                            <td className="px-4 py-3 rounded-r-xl">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                v.estado ? "bg-green-100 text-green-700 border border-green-200"
                                        : "bg-rose-100 text-rose-700 border border-rose-200"
                              }`}>
                                {v.estado ? "Activo" : "Inactivo"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminHome;
