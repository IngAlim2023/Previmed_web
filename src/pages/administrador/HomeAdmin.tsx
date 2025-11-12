import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  LineChart, Line,
  PieChart, Pie,
  LabelList,
  AreaChart, Area, 
} from "recharts";


const URL_BACK = (import.meta as any).env?.VITE_URL_BACK || "";
const apiUrl = (path: string) =>
  `${URL_BACK}`.replace(/\/+$/, "") + "/" + String(path || "").replace(/^\/+/, "");

async function getJSON<T>(path: string, timeoutMs = 12000): Promise<T> {
  const url = apiUrl(path);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}
async function getJSONSafe<T>(path: string, timeoutMs = 12000): Promise<T | null> {
  try { return await getJSON<T>(path, timeoutMs); } catch { return null; }
}
function asArray<T = any>(raw: any): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.msj)) return raw.msj;
  const maybe = raw && typeof raw === "object" ? Object.values(raw).find((v) => Array.isArray(v)) : null;
  return Array.isArray(maybe) ? (maybe as T[]) : [];
}

type BarDatum = { label: string; value: number };
const sumVals = (d: BarDatum[]) => d.reduce((a,b)=>a+(b.value||0),0);

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
const fmtMoneyShort = (n: number) => {
  const compact = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 }).format(n);
  return `$ ${compact}`;
};

function monthsLastN(n = 12) {
  const base = new Date();
  base.setDate(1);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    out.push(`${d.getFullYear()}-${m}`);
  }
  return out;
}
function parseDateAny(rec: any): Date | null {
  if (!rec || typeof rec !== "object") return null;
  const candidates = [
    "fecha","fecha_visita","fechaVisita","created_at","createdAt","fecha_creacion","fechaCreacion","fecha_registro","fechaRegistro"
  ];
  for (const k of candidates) {
    const v = rec?.[k];
    if (!v) continue;
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

const CARD_H = 400;
const CHART_H = 300;
const COLORS = ["#2563eb","#f59e0b","#10b981","#a855f7","#e11d48","#06b6d4","#84cc16"];

const Empty: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="h-full flex items-center justify-center text-sm text-gray-500">{msg}</div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode; height?: number; className?: string }> = ({
  title, children, height = CARD_H, className = "",
}) => (
  <div className={`bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-3 flex flex-col overflow-hidden ${className}`}
       style={{ height, minHeight: height }}>
    <div className="text-sm font-semibold text-gray-700 mb-1">{title}</div>
    <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">{children}</div>
  </div>
);

const BarBlock: React.FC<{ data: BarDatum[]; height?: number; colors?: string[]; horizontal?: boolean }> = ({ data, height = 280, colors, horizontal }) => {
  const palette = colors?.length ? colors : COLORS;
  const hasData = data && data.length > 0 && sumVals(data) > 0;
  if (!hasData) return <Empty msg="Sin datos para mostrar." />;
  return (
    <div style={{ width: "100%", height: "100%", minWidth: 0, minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {horizontal ? (
            <>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="label" width={160} tick={{ fontSize: 11 }} />
            </>
          ) : (
            <>
              <XAxis dataKey="label" interval={0} angle={-12} height={50} textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            </>
          )}
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="value" name="Total" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => (<Cell key={i} fill={palette[i % palette.length]} />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LineBlock: React.FC<{ data: BarDatum[]; height?: number }> = ({ data, height = 280 }) => {
  const has = data && data.length > 0 && sumVals(data) > 0;
  if (!has) return <Empty msg="No hay pagos registrados." />;
  return (
    <div style={{ width: "100%", height: "100%", minWidth: 0, minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 20, bottom: 12, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v)=>fmtMoneyShort(Number(v))} tick={{ fontSize: 11 }} domain={[0, "auto"]} width={70} />
          <Tooltip formatter={(v)=>fmtMoney(Number(v))} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="value" name="Ingresos" dot={{ r: 3 }} activeDot={{ r: 5 }} strokeWidth={2} stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const PieBlock: React.FC<{ data: BarDatum[]; height?: number; colors?: string[] }> = ({ data, height = 280, colors }) => {
  const palette = colors?.length ? colors : COLORS;
  const total = sumVals(data);
  const hasData = data && data.length > 0 && total > 0;
  if (!hasData) return <Empty msg="No hay solicitudes para mostrar." />;
  return (
    <div style={{ width: "100%", height: "100%", minWidth: 0, minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={70} outerRadius={110} paddingAngle={2}
               label={({ value }) => `${Math.round((Number(value) * 100) / total)}%`}>
            {data.map((_, i) => (<Cell key={i} fill={palette[i % palette.length]} />))}
          </Pie>
          <Tooltip formatter={(v, _n, p: any) => [`${v}`, String(p?.payload?.label ?? "")]} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const trim = (s: string, n = 20) => (s?.length > n ? s.slice(0, n) + "…" : s);

const ValueLabel: React.FC<any> = ({ x = 0, y = 0, width = 0, height = 0, value }) => (
  <text x={x + width + 6} y={y + height / 2 + 4} fill="#334155" fontSize={12} textAnchor="start">{value}</text>
);

const TopDoctorsBlock: React.FC<{ data: BarDatum[]; height?: number }> = ({ data, height = 380 }) => {
  const has = data && data.length > 0 && sumVals(data) > 0;
  if (!has) return <Empty msg="No hay datos suficientes para el Top." />;
  return (
    <div style={{ width: "100%", height: "100%", minWidth: 0, minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 16, bottom: 10, left: 8 }} barCategoryGap="10%" barGap={2}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} domain={[0, "dataMax"]} />
          <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 12 }} tickFormatter={(v) => trim(String(v))} />
          <Tooltip />
          <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={34}>
            <LabelList dataKey="value" content={<ValueLabel />} />
            {data.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const AreaBlock: React.FC<{ data: BarDatum[]; height?: number; color?: string }> = ({ data, height = 280, color = "#06b6d4" }) => {
  const has = data && data.length > 0 && sumVals(data) > 0;
  if (!has) return <Empty msg="No hay visitas con fecha para graficar." />;
  return (
    <div style={{ width: "100%", height: "100%", minWidth: 0, minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 20, bottom: 12, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="value" name="Visitas" stroke={color} fill={color} fillOpacity={0.25} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

type KPI = { pacientes_total: number; visitas_total: number; medicos_total: number; solicitudes_total: number; };

const HomeAdmin: React.FC = () => {
  const [kpi, setKpi] = useState<KPI>({ pacientes_total: 0, visitas_total: 0, medicos_total: 0, solicitudes_total: 0 });
  const [visitasPorMedico, setVisitasPorMedico] = useState<BarDatum[]>([]);
  const [ingresosMensual, setIngresosMensual] = useState<BarDatum[]>([]);
  const [solicitudesPorEstado, setSolicitudesPorEstado] = useState<BarDatum[]>([]);
  const [visitasMensual, setVisitasMensual] = useState<BarDatum[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [rawPacientes, rawVisitas, rawMedicos, rawSolicitudes] = await Promise.all([
        getJSONSafe<any>("/pacientes"), getJSONSafe<any>("/visitas"),
        getJSONSafe<any>("/medicos"),   getJSONSafe<any>("/solicitudes"),
      ]);
      if (!alive) return;
      setKpi({
        pacientes_total: asArray(rawPacientes).length,
        visitas_total: asArray(rawVisitas).length,
        medicos_total: asArray(rawMedicos).length,
        solicitudes_total: asArray(rawSolicitudes).length,
      });
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const resp = await getJSONSafe<any>("/medicos/visitas/pormedico");
      if (!alive) return;
      const arr = asArray<any>(resp).map((it) => {
        const u = it?.usuario ?? it?.medico?.usuario ?? {};
        const nombre = [u?.nombre, u?.apellido].filter(Boolean).join(" ");
        const label = it?.label || nombre || `Médico ${it?.medico_id ?? ""}`;
        const value = Number(it?.total ?? it?.total_visitas ?? it?.visitas ?? it?.count ?? 0);
        return { label, value };
      });
      setVisitasPorMedico(arr);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const year = new Date().getFullYear();
      try {
        const resp = await getJSON<any>(`/registros-pago/ingresos/mensual?year=${year}`, 25000);
        const serie = Array.isArray(resp?.data)
          ? resp.data.map((d: any) => ({ label: String(d?.label ?? ""), value: Number(d?.value ?? 0) }))
          : [];
        if (!alive) return;
        setIngresosMensual(serie);
      } catch {
        if (alive) setIngresosMensual([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  const topMedicos = useMemo(() => [...visitasPorMedico].sort((a,b)=>b.value-a.value).slice(0,10), [visitasPorMedico]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const raw = await getJSONSafe<any>("/solicitudes");
      if (!alive) return;
      const arr = asArray<any>(raw);
      const counts = new Map<string, number>();
      for (const it of arr) {
        let estado = it?.estado ?? it?.status ?? it?.estado_solicitud ?? it?.estadoSolicitud ?? "";
        if (!estado) estado = "Sin estado";
        estado = String(estado).replace(/_/g," ").replace(/\s+/g," ").trim();
        counts.set(estado, (counts.get(estado) ?? 0) + 1);
      }
      setSolicitudesPorEstado(Array.from(counts.entries()).map(([label, value]) => ({ label, value })));
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const raw = await getJSONSafe<any>("/visitas");
      if (!alive) return;
      const arr = asArray<any>(raw);
      const months = monthsLastN(12);
      const counts = new Map(months.map((m) => [m, 0]));
      let anyDate = false;

      for (const it of arr) {
        const d = parseDateAny(it);
        if (!d) continue;
        anyDate = true;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
      }

      setVisitasMensual(
        anyDate ? months.map((m) => ({ label: m, value: counts.get(m) ?? 0 })) : []
      );
    })();
    return () => { alive = false; };
  }, []);

  return (
    <>
      <style>{`body{background-color:#eff6ff}`}</style>
      <div className="min-h-screen bg-blue-50">
        <main className="min-h-screen">
          <div className="pl-2 pr-4 pt-3 pb-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Panel de control</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4">
                <div className="text-sm text-gray-600">Pacientes</div>
                <div className="text-3xl font-semibold mt-0.5">{kpi.pacientes_total.toLocaleString("es-ES")}</div>
              </div>
              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4">
                <div className="text-sm text-gray-600">Visitas</div>
                <div className="text-3xl font-semibold mt-0.5">{kpi.visitas_total.toLocaleString("es-ES")}</div>
              </div>
              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4">
                <div className="text-sm text-gray-600">Médicos</div>
                <div className="text-3xl font-semibold mt-0.5">{kpi.medicos_total.toLocaleString("es-ES")}</div>
              </div>
              <div className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4">
                <div className="text-sm text-gray-600">Solicitudes</div>
                <div className="text-3xl font-semibold mt-0.5">{kpi.solicitudes_total.toLocaleString("es-ES")}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3 min-h-[420px]">
              <ChartCard title="Médicos — visitas totales">
                {visitasPorMedico.length === 0
                  ? <Empty msg="No hay datos en /medicos/visitas/pormedico." />
                  : <BarBlock data={visitasPorMedico} height={CHART_H} />}
              </ChartCard>

              <ChartCard title="Ingresos — tendencia mensual">
                {ingresosMensual.length === 0
                  ? <Empty msg="No hay pagos registrados." />
                  : <LineBlock data={ingresosMensual} height={CHART_H} />}
              </ChartCard>

              <div className="xl:col-span-2">
                <ChartCard title="Top 10 médicos por visitas" height={460}>
                  {topMedicos.length === 0
                    ? <Empty msg="No hay datos suficientes para el Top." />
                    : <TopDoctorsBlock data={topMedicos} height={380} />}
                </ChartCard>
              </div>

              <ChartCard title="Distribución por estado de solicitud">
                {solicitudesPorEstado.length === 0
                  ? <Empty msg="No hay solicitudes para mostrar." />
                  : <PieBlock data={solicitudesPorEstado} height={CHART_H} />}
              </ChartCard>

              <ChartCard title="Visitas — últimos 12 meses">
                {visitasMensual.length === 0
                  ? <Empty msg="No hay visitas con fecha para graficar." />
                  : <AreaBlock data={visitasMensual} height={CHART_H} />}
              </ChartCard>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomeAdmin;
