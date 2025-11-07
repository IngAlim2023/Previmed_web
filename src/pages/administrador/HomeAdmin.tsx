import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList,
  PieChart, Pie, Cell, Label,
} from "recharts";

/* ============================ FETCH ============================ */
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
  } finally { clearTimeout(t); }
}
async function getJSONSafe<T>(path: string): Promise<T | null> {
  try { return await getJSON<T>(path); } catch { return null; }
}
async function fetchFirst(paths: string[]): Promise<any | null> {
  for (const p of paths) {
    try {
      const res = await getJSONSafe<any>(p);
      if (res != null) return res;
    } catch {}
  }
  return null;
}

/* ============================ HELPERS ============================ */
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
const s = (v: any) => String(v ?? "").toLowerCase().trim();
const isTrueish = (v: any) =>
  v === true || v === 1 || v === "1" || s(v) === "true" || s(v) === "si" || s(v) === "sí";

type BarDatum = { label: string; value: number };
const sumVals = (d: BarDatum[]) => d.reduce((a,b)=>a+(b.value||0),0);

/* ============================ LÓGICA MÉDICOS (para KPIs) ============================ */
const medicoDisponible = (m: any): boolean | null => {
  if (m?.disponible !== undefined) return isTrueish(m.disponible);
  const dispLike = m?.disponibilidad ?? m?.estado_disponibilidad ?? m?.estadoAtencion ?? m?.estado_atencion;
  if (dispLike !== undefined) {
    if (typeof dispLike === "number") return dispLike > 0;
    const t = s(dispLike);
    if (!t) return null;
    if (t.includes("no disp") || t.includes("ocup") || t.includes("indisp") || t.includes("inac")) return false;
    if (t.includes("disp") || t.includes("libre") || t.includes("habil") || t.includes("activo")) return true;
  }
  const est = s(m?.estado ?? m?.status ?? m?.estatus);
  if (est) {
    if (est.includes("no disp") || est.includes("ocup") || est.includes("inac")) return false;
    if (isTrueish(m?.estado) || est.includes("disp") || est.includes("habil") || est.includes("activo")) return true;
  }
  return null;
};
const contarDisponibles = (arr: any[]) => {
  let seenAny = false, count = 0;
  for (const m of arr) {
    const d = medicoDisponible(m);
    if (d !== null) { seenAny = true; if (d) count++; }
  }
  if (!seenAny) {
    const activos = arr.filter(m => isTrueish(m?.estado) || s(m?.estado).includes("activo")).length;
    return activos > 0 ? activos : arr.length;
  }
  return count;
};

/* ============================ TAMAÑOS ============================ */
const CARD_H = 360;    // altura mínima de la tarjeta
const CHART_H = 300;   // altura del gráfico (dejamos espacio para el pie de texto)

/* ============================ UI ============================ */
const Empty: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="h-full flex items-center justify-center text-sm text-gray-500">{msg}</div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div
    className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-3 flex flex-col overflow-hidden"
    style={{ minHeight: CARD_H }}
  >
    <div className="text-sm font-semibold text-gray-700 mb-1">{title}</div>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);

/* ============================ CHARTS (RECHARTS) ============================ */
const COLORS = ["#2563eb","#f59e0b","#10b981","#a855f7","#e11d48","#06b6d4","#84cc16"];

const BarBlock: React.FC<{ data: BarDatum[]; height: number; colors?: string[] }> = ({ data, height, colors }) => {
  const palette = colors?.length ? colors : COLORS;
  const hasData = data && data.length > 0 && sumVals(data) > 0;
  if (!hasData) return <Empty msg="Sin datos para mostrar." />;

  return (
    <div className="h-full flex flex-col">
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Total" radius={[8, 8, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DonutBlock: React.FC<{ data: BarDatum[]; height: number; colors?: string[] }> = ({ data, height, colors }) => {
  const palette = colors?.length ? colors : ["#22c55e","#6366f1","#ef4444","#0ea5e9","#a855f7","#10b981","#f59e0b"];
  const total = sumVals(data || []);
  if (!data || data.length === 0 || total === 0) return <Empty msg="Sin datos para mostrar." />;

  return (
    <div className="h-full flex flex-col">
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
              <Label position="center" content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                const { cx, cy } = viewBox as any;
                return (
                  <>
                    <text x={cx} y={cy - 4} textAnchor="middle" fontSize={22} fill="#111827" fontWeight={800}>
                      {total}
                    </text>
                    <text x={cx} y={cy + 16} textAnchor="middle" fontSize={12} fill="#6b7280">
                      Total
                    </text>
                  </>
                );
              }} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/** Barra apilada 100% (horizontal) con pie de texto dentro de la card */
const PercentBarBlock: React.FC<{ data: BarDatum[]; height: number; colors?: string[] }> = ({ data, height, colors }) => {
  const total = sumVals(data || []);
  const palette = colors?.length ? colors : ["#3b82f6", "#ec4899", "#10b981", "#f59e0b"];
  if (!data || data.length < 2 || total === 0) return <Empty msg="Sin datos para mostrar." />;

  const row: any = { name: "Proporción" };
  data.forEach(d => { row[d.label] = d.value; });
  const ds = [row];

  const CAPTION_H = 26; // espacio para pie dentro de la card
  const chartH = Math.max(120, height - CAPTION_H);

  return (
    <div className="h-full flex flex-col">
      <div style={{ width: "100%", height: chartH }}>
        <ResponsiveContainer>
          <BarChart
            data={ds}
            layout="vertical"
            stackOffset="expand"
            margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              formatter={(v: any, name: string) => {
                const raw = data.find(d => d.label === name)?.value ?? 0;
                const pct = total ? (raw / total) * 100 : 0;
                return [`${pct.toFixed(1)}% (${raw})`, name];
              }}
            />
            <Legend />
            {data.map((d, i) => (
              <Bar key={d.label} dataKey={d.label} stackId="a" fill={palette[i % palette.length]}>
                <LabelList
                  content={(props: any) => {
                    const { x, y, width, height, value } = props;
                    const pct = total ? (value / total) * 100 : 0;
                    if (pct < 7) return null;
                    return (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#ffffff"
                        fontSize={12}
                        fontWeight={700}
                      >
                        {`${Math.round(pct)}%`}
                      </text>
                    );
                  }}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie de texto dentro de la card, con ellipsis */}
      <div className="px-2 mt-1 text-[11px] text-gray-500 text-center whitespace-nowrap overflow-hidden text-ellipsis">
        {data.map((d, i) => (
          <span key={i} className="mr-3">{d.label}: <b>{d.value}</b></span>
        ))}
        <span>Total: <b>{total}</b></span>
      </div>
    </div>
  );
};

/** Gauge semicircular mejorado, con gradiente y pie interno (no se sale) */
const GaugeBlock: React.FC<{ activos: number; inactivos: number; height: number; color?: string }> = ({ activos, inactivos, height, color = "#06b6d4" }) => {
  const total = (activos || 0) + (inactivos || 0);
  if (!total) return <Empty msg="No hay planes registrados." />;
  const pct = total ? activos / total : 0;

  const data = [
    { name: "Activos", value: activos },
    { name: "Resto", value: Math.max(0, total - activos) },
  ];

  const CAPTION_H = 26;
  const chartH = Math.max(120, height - CAPTION_H);

  return (
    <div className="h-full flex flex-col">
      <div style={{ width: "100%", height: chartH }}>
        <ResponsiveContainer>
          <PieChart>
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius="70%"
              outerRadius="100%"
              stroke="none"
            >
              <Cell fill="url(#gaugeGrad)" />
              <Cell fill="#e5e7eb" />
              <Label
                position="center"
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                  const { cx, cy } = viewBox as any;
                  return (
                    <>
                      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={24} fill="#111827" fontWeight={800}>
                        {Math.round(pct * 100)}%
                      </text>
                      <text x={cx} y={cy + 18} textAnchor="middle" fontSize={12} fill="#6b7280">
                        Activos
                      </text>
                    </>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Pie dentro de la card */}
      <div className="px-2 mt-1 text-[11px] text-gray-500 text-center whitespace-nowrap overflow-hidden text-ellipsis">
        Activos: <b>{activos}</b> — Inactivos: <b>{inactivos}</b> — Total: <b>{total}</b>
      </div>
    </div>
  );
};

/* ============================ TIPOS ============================ */
type KPI = {
  pacientes_total: number;
  visitas_total: number;
  medicos_total: number;
  medicos_disponibles: number;
  solicitudes_total: number;
};

/* ============================ COMPONENTE ============================ */
const HomeAdmin: React.FC = () => {
  // KPIs
  const [kpi, setKpi] = useState<KPI>({
    pacientes_total: 0,
    visitas_total: 0,
    medicos_total: 0,
    medicos_disponibles: 0,
    solicitudes_total: 0,
  });

  // Datasets
  const [medicos, setMedicos] = useState<any[]>([]);
  const [barriosList, setBarriosList] = useState<any[]>([]);
  const [epsList, setEpsList] = useState<any[]>([]);
  const [planesList, setPlanesList] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [rawPacientes, rawVisitas] = await Promise.all([
        getJSONSafe<any>("/pacientes").then(async (res) => {
          if (res) return res;
          const alt1 = await getJSONSafe<any>("/pacientes/titular");
          const alt2 = await getJSONSafe<any>("/pacientes/beneficiarios");
          return { data: [...asArray(alt1), ...asArray(alt2)] };
        }),
        getJSONSafe<any>("/visitas"),
      ]);
      const [rawMedicos, rawBarrios, rawEPS, rawPlanes, rawSolicitudes] = await Promise.all([
        fetchFirst(["/medicos","/medicos/read","/usuarios/medicos","/doctores","/doctores/read"]),
        fetchFirst(["/barrios", "/barrios/read", "/ubicaciones/barrios"]),
        fetchFirst(["/aseguradoras", "/aseguradoras/read", "/eps", "/eps/read"]),
        fetchFirst(["/planes", "/planes/read", "/membresias/planes"]),
        fetchFirst(["/solicitudes", "/solicitudes/read", "/afiliaciones/solicitudes"]),
      ]);
      if (!alive) return;

      const medicosArr = asArray(rawMedicos);
      const disponibles = contarDisponibles(medicosArr);

      setKpi({
        pacientes_total: asArray(rawPacientes).length,
        visitas_total: asArray(rawVisitas).length,
        medicos_total: medicosArr.length || 0,
        medicos_disponibles: disponibles || 0,
        solicitudes_total: asArray(rawSolicitudes).length || 0,
      });

      setMedicos(medicosArr);
      setBarriosList(asArray(rawBarrios));
      setEpsList(asArray(rawEPS));
      setPlanesList(asArray(rawPlanes));
      setSolicitudes(asArray(rawSolicitudes));
    })();
    return () => { alive = false; };
  }, []);

  /* ======= Gráficas ======= */
  // Planes: activo vs inactivo
  const planesAct = useMemo(
    () => planesList.filter(p =>
      isTrueish(p?.estado) || isTrueish(p?.activo) || isTrueish(p?.vigente) || s(p?.estado).includes("act")
    ).length,
    [planesList]
  );
  const totalPlanes = asArray(planesList).length;
  const chartPlanes: BarDatum[] = useMemo(() => ([
    { label: "Activos", value: planesAct },
    { label: "Inactivos", value: Math.max(0, totalPlanes - planesAct) },
  ]), [planesAct, totalPlanes]);

  // Barrios (apilada 100%)
  const barriosAct = useMemo(
    () => barriosList.filter(b => isTrueish(b?.estado) || s(b?.estado).includes("act")).length,
    [barriosList]
  );
  const chartBarrios: BarDatum[] = useMemo(() => ([
    { label: "Activos", value: barriosAct },
    { label: "Inactivos", value: Math.max(0, asArray(barriosList).length - barriosAct) },
  ]), [barriosAct, barriosList]);

  // EPS
  const epsAct = useMemo(
    () => epsList.filter(e => isTrueish(e?.estado) || isTrueish(e?.activo) || s(e?.estado).includes("act")).length,
    [epsList]
  );
  const chartEPS: BarDatum[] = useMemo(() => ([
    { label: "Activas", value: epsAct },
    { label: "Inactivas", value: Math.max(0, asArray(epsList).length - epsAct) },
  ]), [epsAct, epsList]);

  // Solicitudes
  const pieSolicitudes: BarDatum[] = useMemo(() => {
    let p = 0, a = 0, r = 0;
    for (const it of solicitudes) {
      const txt = s(it?.estado ?? it?.status ?? it?.situacion ?? it?.resultado);
      if (txt.includes("rech") || txt.includes("deneg") || isTrueish(it?.rechazado)) r++;
      else if (txt.includes("apro") || txt.includes("acept") || isTrueish(it?.aprobado) || isTrueish(it?.aprobada)) a++;
      else p++;
    }
    return [
      { label: "Aprobadas", value: a },
      { label: "Pendientes", value: p },
      { label: "Rechazadas", value: r },
    ];
  }, [solicitudes]);

  return (
    <>
      <style>{`body{background-color:#eff6ff}`}</style>
      <div className="min-h-screen bg-blue-50">
        <main className="min-h-screen">
          <div className="pl-2 pr-4 pt-3 pb-6">
            <div className="mb-2">
              <h1 className="text-xl font-semibold text-gray-800">Panel de control</h1>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4">
                <div className="text-sm text-gray-600">Pacientes</div>
                <div className="text-3xl font-semibold mt-0.5">{kpi.pacientes_total.toLocaleString("es-ES")}</div>
              </div>
              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4">
                <div className="text-sm text-gray-600">Visitas</div>
                <div className="text-3xl font-semibold mt-0.5">{kpi.visitas_total.toLocaleString("es-ES")}</div>
              </div>
              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4">
                <div className="text-sm text-gray-600">
                  Médicos <span className="text-gray-400">(disp. {kpi.medicos_disponibles.toLocaleString("es-ES")})</span>
                </div>
                <div className="text-3xl font-semibold mt-0.5">{kpi.medicos_total.toLocaleString("es-ES")}</div>
              </div>
              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4">
                <div className="text-sm text-gray-600">Solicitudes</div>
                <div className="text-3xl font-semibold mt-0.5">{kpi.solicitudes_total.toLocaleString("es-ES")}</div>
              </div>
            </div>

            {/* GRÁFICAS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3">
              {/* Planes: gauge mejorado, con pie dentro */}
              <ChartCard title="Planes — % Activos (Gauge)">
                <GaugeBlock
                  activos={planesAct}
                  inactivos={Math.max(0, totalPlanes - planesAct)}
                  height={CHART_H}
                  color="#06b6d4"
                />
              </ChartCard>

              {/* Barrios: apilada 100%, con pie dentro */}
              <ChartCard title="Barrios — Proporción Activos / Inactivos (100%)">
                {(chartBarrios[0].value + chartBarrios[1].value === 0)
                  ? <Empty msg="No hay barrios registrados." />
                  : <PercentBarBlock data={chartBarrios} height={CHART_H} colors={["#3b82f6","#ec4899"]} />}
              </ChartCard>

              {/* EPS: barras */}
              <ChartCard title="EPS (Aseguradoras) — Activas vs. Inactivas">
                {(chartEPS[0].value + chartEPS[1].value === 0)
                  ? <Empty msg="No hay EPS/Aseguradoras registradas." />
                  : <BarBlock data={chartEPS} height={CHART_H} colors={["#8b5cf6","#334155"]} />}
              </ChartCard>

              {/* Solicitudes: dona */}
              <ChartCard title="Solicitudes — Aprobadas / Pendientes / Rechazadas">
                {(sumVals(pieSolicitudes) === 0)
                  ? <Empty msg="No hay solicitudes registradas." />
                  : <DonutBlock data={pieSolicitudes} height={CHART_H} colors={["#22c55e","#f59e0b","#ef4444"]} />}
              </ChartCard>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomeAdmin;
