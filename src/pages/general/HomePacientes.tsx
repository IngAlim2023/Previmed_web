import React, { useEffect, useState } from "react";
import { FaUserFriends, FaClock, FaSpinner, FaListUl, FaCalendarAlt } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import DetallesPlan from "../../components/planes/DetallesPlan";
import { getPlanBeneficioById } from "../../services/planxbeneficios";
import { getBeneficios } from "../../services/beneficios";
import { getVisitas } from "../../services/visitasService";
import FloatingChatButton from "../../components/botones/FloatingChatButton";

const HomePacientes: React.FC = () => {
  const API_URL = import.meta.env.VITE_URL_BACK;
  const { user } = useAuthContext();

  const [nombre, setNombre] = useState<string | null>(null);
  const [plan, setPlan] = useState<any>(null);
  const [beneficiarios, setBeneficiarios] = useState<any[]>([]);
  const [visitas, setVisitas] = useState<any[]>([]);
  const [mostrarBeneficiarios, setMostrarBeneficiarios] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetalles, setShowDetalles] = useState<any>(null);

  const hora = new Date().getHours();
  const saludo =
    hora >= 5 && hora < 12
      ? "Buenos días"
      : hora >= 12 && hora < 18
        ? "Buenas tardes"
        : "Buenas noches";

  useEffect(() => {
    const fetchPaciente = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // 1️ Obtener paciente
        const resPaciente = await fetch(`${API_URL}pacientes/por-usuario/${user.id}`);
        if (!resPaciente.ok) throw new Error("No se encontró paciente");
        const pacienteData = await resPaciente.json();

        const pacienteInfo = pacienteData.data;
        setNombre(user?.nombre ?? "");

        // 2️ Buscar membresía del paciente (del JSON que mostraste)
        const resMembresias = await fetch(`${API_URL}membresiasxpacientes/read`);
        if (!resMembresias.ok) throw new Error("No se pudieron obtener membresías");
        const membresiasRaw = await resMembresias.json();
        const membresiasArr = Array.isArray(membresiasRaw?.data)
          ? membresiasRaw.data
          : Array.isArray(membresiasRaw)
            ? membresiasRaw
            : [];

        // buscar el registro que coincide con este paciente
        const miembro = membresiasArr.find(
          (m: any) => Number(m.pacienteId ?? m.paciente_id) === Number(pacienteInfo.idPaciente)
        );

        if (miembro) {

          // Intentar resolver planId directamente del registro, si existe
          let resolvedPlanId = miembro.planId ?? miembro.plan_id ?? null;

          // Si no existe, consultar la membresía para obtener el planId
          if (!resolvedPlanId && miembro.membresiaId) {
            try {
              const resM = await fetch(`${API_URL}membresias/${miembro.membresiaId}`);
              if (resM.ok) {
                const mData = await resM.json();
                const m = mData?.data ?? mData?.msj ?? mData?.msg ?? mData;
                resolvedPlanId = m?.planId ?? m?.plan_id ?? null;
              }
            } catch { }
          }

          if (!resolvedPlanId) {
            console.warn("⚠️ No se pudo resolver el planId de la membresía.");
          } else {
            // 3️ Obtener el plan con el planId correcto
            const resPlan = await fetch(`${API_URL}planes/${resolvedPlanId}`);
            if (resPlan.ok) {
              const planData = await resPlan.json();
              const parsedPlan = planData?.data ?? planData?.msj ?? planData?.msg ?? planData;
              // Solo establecer si hay campos esperados
              if (parsedPlan && (parsedPlan.tipoPlan || parsedPlan.tipo_plan)) {
                // Enriquecer beneficios: relaciones + catálogo con nombres
                let relaciones: any[] = [];
                try {
                  relaciones = await getPlanBeneficioById(Number(resolvedPlanId));
                } catch { }

                let catalogo: any[] = [];
                try {
                  catalogo = await getBeneficios();
                } catch { }

                const mapBeneficios = new Map(
                  (catalogo || []).map((b: any) => [
                    Number(b.id_beneficio ?? b.idBeneficio),
                    {
                      idBeneficio: Number(b.id_beneficio ?? b.idBeneficio),
                      tipoBeneficio: b.tipo_beneficio ?? b.tipoBeneficio,
                    },
                  ])
                );

                const planXBeneficios = (relaciones || []).map((r: any, i: number) => {
                  const bid = Number(r.beneficio_id ?? r.beneficioId);
                  return {
                    ...r,
                    id: r.id ?? r.idPlanXBeneficios ?? i + 1,
                    beneficio: mapBeneficios.get(bid) || undefined,
                  };
                });

                setPlan({
                  idPlan: parsedPlan.idPlan ?? parsedPlan.id_plan ?? resolvedPlanId,
                  tipoPlan: parsedPlan.tipoPlan ?? parsedPlan.tipo_plan ?? "",
                  descripcion: parsedPlan.descripcion ?? "",
                  precio: String(parsedPlan.precio ?? ""),
                  estado: Boolean(parsedPlan.estado ?? true),
                  cantidadBeneficiarios:
                    Number(
                      parsedPlan.cantidadBeneficiarios ?? parsedPlan.cantidad_beneficiarios ?? 0
                    ),
                  planXBeneficios,
                });
              } else {
                console.warn("⚠️ El backend no devolvió datos válidos del plan.");
              }
            } else {
              console.warn("⚠️ No se encontró el plan asociado.");
            }
          }
        } else {
          console.warn("⚠️ Paciente sin membresía registrada.");
        }

        // 4️ Obtener beneficiarios del titular
        const resBenef = await fetch(
          `${API_URL}pacientes/beneficiarios/${pacienteInfo.idPaciente}`
        );
        if (resBenef.ok) {
          const benefData = await resBenef.json();
          setBeneficiarios(benefData.data || []);
        }

        // 5️ Obtener visitas del paciente (endpoint directo o fallback a listado general)
        try {
          const urlDir = `${API_URL}visitas/paciente/${pacienteInfo.idPaciente}`;
          const resVisDir = await fetch(urlDir);
          if (resVisDir.ok) {
            const j = await resVisDir.json();
            const arr = Array.isArray(j?.msj)
              ? j.msj
              : Array.isArray(j?.data)
                ? j.data
                : Array.isArray(j)
                  ? j
                  : [];
            const norm = arr.map((v: any) => ({
              id_visita: v.id_visita ?? v.idVisita ?? v.id,
              fecha_visita: v.fecha_visita ?? v.fechaVisita ?? v.fecha,
              descripcion: v.descripcion ?? "",
              direccion: v.direccion ?? "",
              estado: Boolean(v.estado ?? v.activo ?? true),
              telefono: v.telefono ?? "",
              paciente_id: v.paciente_id ?? v.pacienteId,
              medico_id: v.medico_id ?? v.medicoId,
              barrio_id: v.barrio_id ?? v.barrioId,
            }));
            setVisitas(norm);
          } else {
            // Fallback: obtener todas y filtrar por paciente
            const todas = await getVisitas();
            setVisitas((todas || []).filter((v: any) => Number(v.paciente_id) === Number(pacienteInfo.idPaciente)));
          }
        } catch {
          // Último fallback silencioso
          const todas = await getVisitas().catch(() => [] as any[]);
          setVisitas((todas || []).filter((v: any) => Number(v.paciente_id) === Number(pacienteInfo.idPaciente)));
        }
      } catch (error: any) {
        console.error("💥 Error al obtener datos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [API_URL, user]);

  const handleVerBeneficiarios = () => setMostrarBeneficiarios(!mostrarBeneficiarios);

  const getDocumento = (u: any) =>
    u?.documento ??
    u?.numeroDocumento ??
    u?.numDocumento ??
    u?.cedula ??
    u?.dni ??
    u?.identificacion ??
    "—";

  const cap = (s: any) =>
    typeof s === "string" && s.length
      ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
      : "";

  const nombreCompleto = (u: any) =>
    [u?.nombre, u?.segundoNombre, u?.apellido, u?.segundoApellido]
      .filter(Boolean)
      .map(cap)
      .join(" ");

  const formatFecha = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-start justify-center p-6 relative">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* 🕒 Reloj */}
        <div className="flex justify-end items-center text-sm text-gray-500 mb-4">
          <FaClock className="mr-2" />
          <span>
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* 👋 Saludo */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-1">
          ¡{saludo}, {nombre || "Paciente"}!
        </h2>
        <p className="text-emerald-700/90 font-medium mb-8 flex items-center">
          Te encuentras activo
          <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full ml-2 animate-pulse" />
        </p>

        {/* ⏳ Cargando */}
        {loading && (
          <div className="flex justify-center my-4">
            <FaSpinner className="animate-spin text-blue-600 text-2xl" />
          </div>
        )}

        {/* 🧾 Plan del paciente */}
        {plan ? (
          <div className="rounded-2xl p-5 shadow-sm bg-gradient-to-br from-blue-50 to-white border border-blue-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-blue-700 flex items-center gap-2">
                <FaListUl />
                Tu plan
              </h3>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                {plan.tipoPlan}
              </span>
            </div>

            <button
              onClick={() => setShowDetalles(plan)}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-medium shadow hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaListUl />
              Ver detalles del plan
            </button>
          </div>
        ) : (
          !loading && (
            <div className="rounded-2xl p-5 bg-white border border-gray-100 text-center text-gray-500">
              No se encontró un plan asociado a tu cuenta.
            </div>
          )
        )}

        {/* 👨‍👩 Beneficiarios */}
        <button
          onClick={handleVerBeneficiarios}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-medium shadow hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FaUserFriends />
          {mostrarBeneficiarios ? "OCULTAR BENEFICIARIOS" : "MIS BENEFICIARIOS"}
        </button>

        {mostrarBeneficiarios && (
          <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Beneficiarios</h3>
            {beneficiarios.length === 0 ? (
              <p className="text-sm text-gray-500">No tienes beneficiarios registrados.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {beneficiarios.map((b: any, i: number) => (
                  <li
                    key={i}
                    className="py-2 text-sm text-gray-700 flex items-center justify-between"
                  >
                    <span>
                      CC {getDocumento(b.usuario)} — {nombreCompleto(b.usuario)}
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showDetalles && (
          <DetallesPlan plan={showDetalles} setShowDetalles={setShowDetalles} />
        )}

        {/* 📅 Visitas del paciente */}
        <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" /> Visitas recientes
          </h3>
          {visitas.length === 0 ? (
            <p className="text-sm text-gray-500">No tienes visitas registradas.</p>
          ) : (
            <ul className="space-y-2">
              {[...visitas]
                .sort(
                  (a: any, b: any) =>
                    new Date(b.fecha_visita).getTime() - new Date(a.fecha_visita).getTime()
                )
                .slice(0, 5)
                .map((v: any) => (
                  <li
                    key={v.id_visita}
                    className="border border-gray-100 rounded-xl p-4 bg-gradient-to-b from-slate-50 to-white flex flex-col gap-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{formatFecha(v.fecha_visita)}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v.estado
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {v.estado ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                    <div className="text-gray-800 text-sm">
                      {v.descripcion || "Sin descripción"}
                    </div>
                    {v.direccion && (
                      <div className="text-xs text-gray-500">{v.direccion}</div>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* 💬 Botón flotante del chat */}
      <FloatingChatButton />
    </div>
  );
}

export default HomePacientes;
