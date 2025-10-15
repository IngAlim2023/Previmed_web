import React, { useEffect, useMemo, useState } from "react";
import {
  readBeneficiarios,
  deleteBeneficiario,
  createBeneficiario,
  getTitulares,
  asociarBeneficiario,
  desvincularBeneficiario,
  getUsuarioDeBeneficiario,
} from "../../services/pacientes";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaEdit, FaPlus, FaTrash, FaLink, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/* ===== Tipos ===== */
interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  titular: string;               // "Sin titular" cuando no tiene
  paciente_id?: number | null;   // si el backend lo incluyera
}

type Titular = {
  id_paciente: number;
  usuario?: {
    nombre?: string;
    apellido?: string;
    numero_documento?: string;
  };
  nombre?: string;
  apellido?: string;
  numero_documento?: string;
};

/* ===== Utils ===== */
const norm = (s: any) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const titularLabel = (t: Titular) =>
  `${t?.usuario?.nombre ?? t?.nombre ?? ""} ${t?.usuario?.apellido ?? t?.apellido ?? ""}`
    .trim()
    .replace(/\s+/g, " ");

const isPositiveInt = (v: any) => Number.isInteger(Number(v)) && Number(v) > 0;

/** Pequeño helper para reintentar una promesa */
async function withRetry<T>(fn: () => Promise<T>, tries = 2, delayMs = 400): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

/* ========== Componente ========== */
const Beneficiarios: React.FC = () => {
  const [data, setData] = useState<Beneficiario[]>([]);
  const [accion, setAccion] = useState(false);
  const navigate = useNavigate();

  // eliminar
  const [idDelete, setIdDelete] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowMenuOpenId, setRowMenuOpenId] = useState<number | null>(null);

  // crear (sin exigir titular)
  const [openCreate, setOpenCreate] = useState(false);
  const [formCreate, setFormCreate] = useState<any>({
    nombre: "",
    segundo_nombre: "",
    apellido: "",
    segundo_apellido: "",
    numero_documento: "",
    email: "",
    genero: "",
    estado_civil: "",
    tipo_documento: "",
    fecha_nacimiento: "",
    direccion: "",
  });

  // asociar
  const [openAsociar, setOpenAsociar] = useState(false);
  const [benefTodos, setBenefTodos] = useState<Beneficiario[]>([]);
  const [titulares, setTitulares] = useState<Titular[]>([]);
  const [loadingTit, setLoadingTit] = useState(false);
  const [searchBen, setSearchBen] = useState("");
  const [searchTit, setSearchTit] = useState("");
  const [asociarForm, setAsociarForm] = useState<{ beneficiario_id: string; titular_id: string }>({
    beneficiario_id: "",
    titular_id: "",
  });

  const refresh = () => setAccion((x) => !x);

  /* ===== Tabla exterior: SOLO beneficiarios asociados (con titular) ===== */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await readBeneficiarios();
        const rows: Beneficiario[] = res.data || [];
        const asociados = rows.filter((r: any) =>
          typeof r.paciente_id !== "undefined"
            ? r.paciente_id !== null
            : (r.titular ?? "").toLowerCase() !== "sin titular"
        );
        setData(asociados);
      } catch {
        toast.error("Error al obtener los beneficiarios");
      }
    };
    load();
  }, [accion]);

  /* ===== Editar → /usuarios ===== */
  const handleEdit = async (row: Beneficiario) => {
    try {
      await getUsuarioDeBeneficiario(row.id).catch(() => null);
      navigate(`/usuarios`);
    } catch {
      navigate(`/usuarios`);
    }
  };

  /* ===== Eliminar / Desvincular ===== */
  const askDelete = (row: Beneficiario) => {
    setIdDelete(row.id);
    setOpenDelete(true);
    setRowMenuOpenId(null);
  };

  const deleteBen = async () => {
    try {
      const res = await deleteBeneficiario(idDelete);
      setOpenDelete(false);
      setIdDelete(0);
      if (res.message === "Error") return toast.error(res.error || "No se puede eliminar");
      toast.success("Beneficiario eliminado");
      refresh();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleDesvincular = async (row: Beneficiario) => {
    try {
      setRowMenuOpenId(null);
      const ok = window.confirm("¿Desvincular este beneficiario del titular?");
      if (!ok) return;
      const res = await desvincularBeneficiario(row.id, true);
      if (res.message === "Error") return toast.error(res.error || "No se pudo desvincular");
      toast.success("Desvinculado correctamente");
      refresh();
    } catch {
      toast.error("Error al desvincular");
    }
  };

  /* ===== Crear (SIN titular obligatorio) ===== */
  const openCreateModal = async () => setOpenCreate(true);

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nombre: formCreate.nombre,
      segundo_nombre: formCreate.segundo_nombre || "",
      apellido: formCreate.apellido,
      segundo_apellido: formCreate.segundo_apellido || "",
      numero_documento: formCreate.numero_documento,
      email: formCreate.email,
      genero: formCreate.genero || "Masculino",
      estado_civil: formCreate.estado_civil || "Soltero",
      tipo_documento: formCreate.tipo_documento || "Cédula de Ciudadanía",
      fecha_nacimiento: formCreate.fecha_nacimiento || "2000-01-01",
      direccion: formCreate.direccion || "Sin dirección",
      direccion_cobro: formCreate.direccion || "Sin dirección",
      ocupacion: "No especificada",
      // NO enviamos paciente_id → backend lo guardará con paciente_id = null
    };

    try {
      const res = await createBeneficiario(payload);
      if (res.message === "Error") return toast.error(res.error || "No se pudo crear");
      toast.success(res.message || "Beneficiario creado");
      setOpenCreate(false);
      setFormCreate({
        nombre: "",
        segundo_nombre: "",
        apellido: "",
        segundo_apellido: "",
        numero_documento: "",
        email: "",
        genero: "",
        estado_civil: "",
        tipo_documento: "",
        fecha_nacimiento: "",
        direccion: "",
      });
      refresh();
    } catch {
      toast.error("Error al crear beneficiario");
    }
  };

  /* ====== TITULARES: loader robusto ====== */
  const reloadTitulares = async () => {
    setLoadingTit(true);
    try {
      const tr = await withRetry(() => getTitulares(), 3, 500);

      // Extrae SIEMPRE un array de donde venga: {data:{data:[]}} | {data:[]} | []
      const arr: any[] =
        Array.isArray((tr as any)?.data?.data)
          ? (tr as any).data.data
          : Array.isArray((tr as any)?.data)
          ? (tr as any).data
          : Array.isArray(tr as any)
          ? (tr as any)
          : [];

      const list: Titular[] = (arr || [])
        .map((r: any) => ({
          id_paciente: Number(r?.id_paciente ?? r?.id ?? r?.paciente?.id ?? 0),
          usuario: r?.usuario,
          nombre: r?.usuario?.nombre ?? r?.nombre,
          apellido: r?.usuario?.apellido ?? r?.apellido,
          numero_documento: r?.usuario?.numero_documento ?? r?.numero_documento,
        }))
        .filter((t) => isPositiveInt(t.id_paciente));

      setTitulares(list);
    } catch {
      setTitulares([]);
    } finally {
      setLoadingTit(false);
    }
  };

  /* ===== Asociar ===== */
  const openAsociarModal = async () => {
    try {
      // Beneficiarios: TODOS (como pediste)
      const rb = await readBeneficiarios();
      setBenefTodos(Array.isArray(rb?.data) ? rb.data : []);
    } catch {
      setBenefTodos([]);
    }

    // Titulares: cargar con función robusta
    await reloadTitulares();

    setAsociarForm({ beneficiario_id: "", titular_id: "" });
    setSearchBen("");
    setSearchTit("");
    setOpenAsociar(true);
  };

  const benFiltrados = useMemo(() => {
    const q = norm(searchBen);
    if (!q) return benefTodos;
    return benefTodos.filter((b) =>
      norm(`${b.nombre} ${b.apellido} ${b.documento}`).includes(q)
    );
  }, [benefTodos, searchBen]);

  const titularesFiltrados = useMemo(() => {
    const q = norm(searchTit);
    if (!q) return titulares;
    return titulares.filter((t) => {
      const label = `${titularLabel(t)} ${t?.usuario?.numero_documento ?? t?.numero_documento ?? ""}`;
      return norm(label).includes(q);
    });
  }, [titulares, searchTit]);

  const submitAsociar = async (e: React.FormEvent) => {
    e.preventDefault();
    const benId = Number(asociarForm.beneficiario_id);
    const titId = Number(asociarForm.titular_id);
    if (!(isPositiveInt(benId) && isPositiveInt(titId))) {
      return toast.error("Selecciona beneficiario y titular válidos");
    }
    if (benId === titId) return toast.error("No puede asociarse a sí mismo");

    try {
      const res = await asociarBeneficiario(benId, titId);
      if (res.message === "Error") return toast.error(res.error || "No se pudo asociar");
      toast.success(res.message || "Beneficiario asociado");
      setOpenAsociar(false);
      refresh();
    } catch {
      toast.error("Error al asociar");
    }
  };

  /* ===== Columnas ===== */
  const columns: TableColumn<Beneficiario>[] = [
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Apellido", selector: (row) => row.apellido, sortable: true },
    { name: "Documento", selector: (row) => row.documento, sortable: true },
    { name: "Correo", selector: (row) => row.email, sortable: true },
    { name: "Titular", selector: (row) => row.titular, sortable: true },
    {
      name: "Opciones",
      cell: (row) => (
        <div className="relative flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition"
            title="Editar"
          >
            <FaEdit />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setRowMenuOpenId((prev) => (prev === row.id ? null : row.id));
            }}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition"
            title="Eliminar / Desvincular"
          >
            <FaTrash />
          </button>

          {rowMenuOpenId === row.id && (
            <div
              className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg w-44 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => askDelete(row)}
                className="w-full text-left px-3 py-2 hover:bg-red-50"
              >
                🗑️ Eliminar totalmente
              </button>
              <button
                onClick={() => handleDesvincular(row)}
                className="w-full text-left px-3 py-2 hover:bg-amber-50"
              >
                🔌 Desvincular
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  /* ===== Render ===== */
  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen" onClick={() => setRowMenuOpenId(null)}>
      <div className="bg-white shadow-lg rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex p-2 justify-between items-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">👥 Lista de Beneficiarios</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1 transition"
            >
              <FaPlus /> Crear
            </button>
            <button
              onClick={openAsociarModal}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md flex items-center gap-1 transition"
            >
              <FaLink /> Asociar
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          striped
          responsive
          noDataComponent="No hay beneficiarios registrados"
          customStyles={{
            headCells: { style: { fontWeight: "bold", fontSize: "14px", backgroundColor: "#f3f4f6" } },
            rows: { style: { fontSize: "14px", minHeight: "60px" } },
          }}
        />
      </div>

      {/* ===== Modal eliminar ===== */}
      {openDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Eliminar beneficiario</h2>
            <p className="text-gray-600 mb-6">¿Estás seguro que deseas eliminarlo?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setOpenDelete(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancelar</button>
              <button onClick={deleteBen} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal crear (SIN titular) ===== */}
      {openCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[520px] p-6 relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Crear beneficiario</h2>
            <form onSubmit={submitCreate} className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded col-span-1" placeholder="Nombre" required value={formCreate.nombre} onChange={(e) => setFormCreate({ ...formCreate, nombre: e.target.value })} />
              <input className="border p-2 rounded col-span-1" placeholder="Segundo nombre" value={formCreate.segundo_nombre} onChange={(e) => setFormCreate({ ...formCreate, segundo_nombre: e.target.value })} />
              <input className="border p-2 rounded col-span-1" placeholder="Apellido" required value={formCreate.apellido} onChange={(e) => setFormCreate({ ...formCreate, apellido: e.target.value })} />
              <input className="border p-2 rounded col-span-1" placeholder="Segundo apellido" value={formCreate.segundo_apellido} onChange={(e) => setFormCreate({ ...formCreate, segundo_apellido: e.target.value })} />
              <input className="border p-2 rounded col-span-2" placeholder="Documento" required value={formCreate.numero_documento} onChange={(e) => setFormCreate({ ...formCreate, numero_documento: e.target.value })} />
              <input type="email" className="border p-2 rounded col-span-2" placeholder="Correo (opcional)" value={formCreate.email} onChange={(e) => setFormCreate({ ...formCreate, email: e.target.value })} />
              <input className="border p-2 rounded col-span-2" placeholder="Dirección" required value={formCreate.direccion} onChange={(e) => setFormCreate({ ...formCreate, direccion: e.target.value })} />
              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setOpenCreate(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Modal asociar ===== */}
      {openAsociar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[560px] p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Asociar beneficiario</h2>

            <form onSubmit={submitAsociar} className="grid gap-4">
              {/* Beneficiario (TODOS) */}
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Beneficiario</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="border pl-9 pr-3 py-2 rounded w-full mb-2"
                    placeholder="Buscar por nombre, apellido o documento"
                    value={searchBen}
                    onChange={(e) => setSearchBen(e.target.value)}
                  />
                </div>
                <select
                  className="border p-2 rounded"
                  value={asociarForm.beneficiario_id}
                  onChange={(e) => setAsociarForm({ ...asociarForm, beneficiario_id: e.target.value })}
                  required
                >
                  <option value="">Seleccione beneficiario</option>
                  {benFiltrados.map((b) => (
                    <option key={`ben-${b.id}`} value={String(b.id)}>
                      {b.nombre} {b.apellido} — {b.documento}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">{benFiltrados.length} resultado(s)</span>
              </div>

              {/* Titular */}
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Titular</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="border pl-9 pr-3 py-2 rounded w-full mb-2"
                    placeholder="Buscar por nombre, apellido o documento"
                    value={searchTit}
                    onChange={(e) => setSearchTit(e.target.value)}
                  />
                </div>
                <select
                  className="border p-2 rounded"
                  value={asociarForm.titular_id}
                  onChange={(e) => setAsociarForm({ ...asociarForm, titular_id: e.target.value })}
                  required
                >
                  <option value="">Seleccione titular</option>
                  {titularesFiltrados.map((t) => {
                    const idp = t.id_paciente;
                    const label = titularLabel(t);
                    const doc = t?.usuario?.numero_documento ?? t?.numero_documento ?? "";
                    return (
                      <option key={`tit-${idp}`} value={String(idp)}>
                        {label} {doc ? `— ${doc}` : ""}
                      </option>
                    );
                  })}
                </select>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{titularesFiltrados.length} resultado(s)</span>
                  <button
                    type="button"
                    onClick={reloadTitulares}
                    className="text-xs text-gray-600 border rounded px-2 py-1 hover:bg-gray-50"
                    disabled={loadingTit}
                    title="Volver a cargar titulares"
                  >
                    {loadingTit ? "Cargando..." : "Reintentar"}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setOpenAsociar(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Asociar</button>
              </div>
            </form>

            <button onClick={() => setOpenAsociar(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiarios;
