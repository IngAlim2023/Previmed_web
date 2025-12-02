import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import {
  readBeneficiarios,
  createBeneficiario,
  getTitulares,
  asociarBeneficiario,
  desvincularBeneficiario,
} from "../../services/beneficiariosService";
import {
  BeneficiarioCompleto,
  Beneficiario,
} from "../../interfaces/Beneficiarios";
import { FaPlus, FaTrash } from "react-icons/fa6";
import toast from "react-hot-toast";
import BeneficiariosTable from "../../components/beneficiarios/BeneficiariosTable";
import ModalCrearBeneficiario from "../../components/beneficiarios/ModalCrearBeneficiario";

interface BeneficiarioOption {
  value: string;
  label: string;
  idPaciente: number;
  razon?: string;
}

interface PacienteState {
  idPaciente: number;
}

interface FormData {
  nombre: string;
  segundo_nombre: string;
  apellido: string;
  segundo_apellido: string;
  numero_documento: string;
  email: string;
  password: string;
  direccion: string;
  fecha_nacimiento: string;
  numero_hijos: string;
  estrato: string;
  genero: string;
  estado_civil: string;
}

const Beneficiarios: React.FC = () => {
  const location = useLocation();
  const paciente = location.state as PacienteState | null;

  const [data, setData] = useState<Beneficiario[]>([]);
  const [beneficiariosFiltrados, setBeneficiariosFiltrados] = useState<
    BeneficiarioOption[]
  >([]);
  const [selectedBeneficiarios, setSelectedBeneficiarios] = useState<
    BeneficiarioOption[]
  >([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState<number | null>(null);
  const [openRead, setOpenRead] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Beneficiario | null>(null);
  const [loading, setLoading] = useState(false);
  const [limiteBeneficiarios, setLimiteBeneficiarios] = useState<number | null>(
    null
  );

  const [formCreate, setFormCreate] = useState<FormData>({
    nombre: "",
    segundo_nombre: "",
    apellido: "",
    segundo_apellido: "",
    numero_documento: "",
    email: "",
    password: "",
    direccion: "",
    fecha_nacimiento: "",
    numero_hijos: "",
    estrato: "",
    genero: "Masculino",
    estado_civil: "Soltero",
  });

  // ------------------ CARGAR DATOS ------------------
  useEffect(() => {
    cargar();
  }, [paciente?.idPaciente]);

  const cargar = async () => {
    try {
      setLoading(true);

      if (!paciente?.idPaciente) {
        toast.error("Paciente no válido");
        return;
      }

      // Leer beneficiarios
      const response = await readBeneficiarios(paciente.idPaciente);
      const beneficiarios: Beneficiario[] =
        response.data?.map((b: BeneficiarioCompleto) => ({
          ...b,
          usuario: {
            ...b.usuario,
            segundoNombre: b.usuario.segundoNombre ?? "", // null => ""
            segundoApellido: b.usuario.segundoApellido ?? "",
          },
        })) || [];

      setData(beneficiarios);

      // Limite de beneficiarios
      const membresia = response.titular?.membresiaPaciente?.[0]?.membresia;
      setLimiteBeneficiarios(membresia?.plan?.cantidadBeneficiarios ?? null);

      // Titulares para el select
      const resTitulares = await getTitulares();
      const titulares: BeneficiarioCompleto[] = resTitulares.data || [];
      filtrarTitulares(titulares);
    } catch (error) {
      toast.error("Error cargando beneficiarios");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ FILTRAR TITULARES ------------------
  const filtrarTitulares = (titulares: BeneficiarioCompleto[]) => {
    const filtrados: BeneficiarioOption[] = [];

    titulares.forEach((t) => {
      const tieneActiva =
        t.membresiaPaciente?.some((m) => m.membresia?.estado) ?? false;
      if (!tieneActiva) {
        filtrados.push({
          value: t.usuarioId,
          label: `${t.usuario?.nombre} ${t.usuario?.apellido} (${t.usuario?.numeroDocumento})`,
          idPaciente: t.idPaciente,
          razon: "📋 Membresía inactiva",
        });
        return;
      }

      if (t.pacienteId === null) {
        filtrados.push({
          value: t.usuarioId,
          label: `${t.usuario?.nombre} ${t.usuario?.apellido} (${t.usuario?.numeroDocumento})`,
          idPaciente: t.idPaciente,
          razon: "👤 Titular sin beneficiarios",
        });
      }
    });

    setBeneficiariosFiltrados(filtrados);
  };

  // ------------------ VALIDACIÓN LÍMITE ------------------
  const validarLimite = (cantidadAAgregar: number): boolean => {
    if (limiteBeneficiarios === null) return true;
    return data.length + cantidadAAgregar <= limiteBeneficiarios;
  };

  // ------------------ CREAR BENEFICIARIO ------------------
  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarLimite(1) || !paciente?.idPaciente) return;

    const payload = {
      ...formCreate,
      paciente_id: paciente.idPaciente,
      rol_id: 4,
      eps_id: null,
      ocupacion: "No especificada",
      activo: true,
      beneficiario: true,
      direccion_cobro: formCreate.direccion,
      password: formCreate.numero_documento,
      autorizacion_datos: true,
    };

    try {
      const res = await createBeneficiario(payload);
      if (res.message === "Error") {
        toast.error(res.error || "No se pudo crear");
        return;
      }
      toast.success("Beneficiario creado correctamente");
      setOpenCreate(false);
      await cargar();
    } catch {
      toast.error("Error al crear beneficiario");
    }
  };

  // ------------------ DESVINCULAR BENEFICIARIO ------------------
  const confirmDelete = async () => {
    if (!idDelete) return;

    try {
      const res = await desvincularBeneficiario(idDelete);
      if (res.message === "Error") {
        toast.error(res.error || "No se puede desvincular");
        return;
      }
      toast.success("Beneficiario desvinculado");
      setOpenDelete(false);
      setIdDelete(null);
      await cargar();
    } catch {
      toast.error("Error al desvincular");
    }
  };

  // ------------------ ASOCIAR BENEFICIARIOS ------------------
  const asociarBeneficiarios = async () => {
    if (!paciente?.idPaciente || selectedBeneficiarios.length === 0) return;

    setLoading(true);
    try {
      const resActuales = await readBeneficiarios(paciente.idPaciente);
      const actuales = resActuales.data || [];
      const posibles = actuales.length + selectedBeneficiarios.length;

      if (limiteBeneficiarios !== null && posibles > limiteBeneficiarios) {
        const disponibles = limiteBeneficiarios - actuales.length;
        toast.error(`Solo puedes agregar ${disponibles} más.`);
        setLoading(false);
        return;
      }

      await Promise.all(
        selectedBeneficiarios.map((titular) =>
          asociarBeneficiario(titular.idPaciente, paciente.idPaciente)
        )
      );

      toast.success("Beneficiarios asociados");
      setSelectedBeneficiarios([]);
      await cargar();
    } catch {
      toast.error("Error al asociar beneficiarios");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "0.75rem",
      borderColor: "#e5e7eb",
      boxShadow: "none",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#0d9488"
        : state.isFocused
        ? "#f0fdfa"
        : "white",
      color: state.isSelected ? "white" : "#1f2937",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#ccfbf1",
      borderRadius: "0.5rem",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#0d9488",
      fontWeight: "500",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#0d9488",
      "&:hover": { backgroundColor: "#99f6e0", color: "#0f766e" },
    }),
  };

  const opcionesMemo = useMemo(
    () => beneficiariosFiltrados,
    [beneficiariosFiltrados]
  );
  return (
    <div className="p-6 md:p-10 bg-blue-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-6 bg-white">
          <h2 className="text-3xl font-bold text-black">
            Beneficiarios del paciente
          </h2>
          <p className="text-gray-600 mt-1">
            Gestiona los beneficiarios de forma segura
          </p>
        </div>

        {/* INDICADOR DE LÍMITE */}
        {limiteBeneficiarios !== null && (
          <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  📊 Límite de beneficiarios del plan
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Beneficiarios registrados:{" "}
                  <span className="font-bold">{data.length}</span> de{" "}
                  <span className="font-bold">{limiteBeneficiarios}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {data.length}/{limiteBeneficiarios}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    {limiteBeneficiarios - data.length} disponibles
                  </div>
                </div>
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    data.length >= limiteBeneficiarios
                      ? "bg-red-100 border-2 border-red-300"
                      : "bg-green-100 border-2 border-green-300"
                  }`}
                >
                  <span className="text-2xl">
                    {data.length >= limiteBeneficiarios ? "🚫" : "✅"}
                  </span>
                </div>
              </div>
            </div>
            {data.length >= limiteBeneficiarios && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 font-medium">
                  ⚠️ Has alcanzado el límite máximo de beneficiarios permitidos
                  por tu plan
                </p>
              </div>
            )}
            {data.length < limiteBeneficiarios && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(data.length / limiteBeneficiarios) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOTÓN CREAR */}
        <div className="p-6 border-b border-gray-200 flex gap-3">
          <button
            onClick={() => setOpenCreate(true)}
            disabled={
              limiteBeneficiarios !== null && data.length >= limiteBeneficiarios
            }
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl
                       transition-all focus:outline-none focus:ring-2 focus:ring-teal-300
                       ${
                         limiteBeneficiarios !== null &&
                         data.length >= limiteBeneficiarios
                           ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                           : "text-teal-700 border border-teal-300 bg-white hover:bg-teal-50"
                       }`}
          >
            <FaPlus size={16} />
            <span className="font-medium">
              {limiteBeneficiarios !== null &&
              data.length >= limiteBeneficiarios
                ? "Límite alcanzado"
                : "Crear beneficiario"}
            </span>
          </button>
        </div>

        {/* SELECT TITULARES */}
        <div className="p-6 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seleccionar titulares
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Titulares con membresía inactiva o sin beneficiarios
          </p>

          {loading ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600">Cargando titulares...</p>
            </div>
          ) : (
            <>
              <Select
                isMulti
                options={opcionesMemo}
                value={selectedBeneficiarios}
                onChange={(selected) =>
                  setSelectedBeneficiarios(Array.from(selected || []))
                }
                placeholder="Busca y selecciona titulares..."
                styles={customStyles}
                noOptionsMessage={() => "No hay titulares disponibles"}
                isDisabled={
                  limiteBeneficiarios !== null &&
                  data.length >= limiteBeneficiarios
                }
                formatOptionLabel={(option) => (
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-gray-600 italic">
                      {option.razon}
                    </span>
                  </div>
                )}
              />

              {selectedBeneficiarios.length > 0 && (
                <div className="mt-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-sm font-semibold text-teal-800 mb-2">
                    ✓ {selectedBeneficiarios.length} titular(es) seleccionado(s)
                  </p>
                  <div className="text-xs text-teal-700 space-y-1 mb-3">
                    {selectedBeneficiarios.map((b) => (
                      <div key={b.value} className="flex justify-between">
                        <span>{b.label}</span>
                        <span className="text-teal-600">{b.razon}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={asociarBeneficiarios}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg 
                               hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                               transition font-medium"
                  >
                    {loading ? "Asociando..." : "Asociar como beneficiarios"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* TABLA */}
        <div className="p-6">
          <BeneficiariosTable
            data={data}
            onDelete={(id) => {
              setIdDelete(id);
              setOpenDelete(true);
            }}
            onRead={(row) => {
              setSelectedRow(row as BeneficiarioCompleto);
              setOpenRead(true);
            }}
          />
        </div>
      </div>

      {/* MODAL CREAR */}
      {openCreate && (
        <ModalCrearBeneficiario
          formData={formCreate}
          setFormData={setFormCreate}
          onCerrar={() => {
            setOpenCreate(false);
            setFormCreate({
              nombre: "",
              segundo_nombre: "",
              apellido: "",
              segundo_apellido: "",
              numero_documento: "",
              email: "",
              password: "",
              direccion: "",
              fecha_nacimiento: "",
              numero_hijos: "",
              estrato: "",
              genero: "Masculino",
              estado_civil: "Soltero",
            });
          }}
          onGuardar={submitCreate}
        />
      )}

      {/* MODAL DESVINCULAR */}
      {openDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 relative">
            <button
              onClick={() => {
                setOpenDelete(false);
                setIdDelete(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaTrash className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Desvincular beneficiario
              </h2>
            </div>

            <p className="text-gray-600 mb-6 text-center">
              ¿Estás seguro que deseas desvincularlo? El beneficiario no será
              eliminado.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpenDelete(false);
                  setIdDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Desvincular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LEER */}
      {openRead && selectedRow && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/90 via-sky-50/90 to-indigo-100/90 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-2xl p-6 relative ring-1 ring-slate-200">
            <button
              onClick={() => {
                setOpenRead(false);
                setSelectedRow(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-slate-800">
                Detalles del beneficiario
              </h3>
              <p className="text-slate-500 text-sm">
                Información básica del beneficiario seleccionado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Nombre:</strong> {selectedRow.usuario?.nombre ?? "—"}
              </p>
              <p>
                <strong>Apellido:</strong>{" "}
                {selectedRow.usuario?.apellido ?? "—"}
              </p>
              <p>
                <strong>Segundo nombre:</strong>{" "}
                {selectedRow.usuario?.segundoNombre ?? "—"}
              </p>
              <p>
                <strong>Segundo apellido:</strong>{" "}
                {selectedRow.usuario?.segundoApellido ?? "—"}
              </p>
              <p>
                <strong>Documento:</strong>{" "}
                {selectedRow.usuario?.numeroDocumento ?? "—"}
              </p>
              <p>
                <strong>Email:</strong> {selectedRow.usuario?.email ?? "—"}
              </p>
              <p>
                <strong>Ocupación:</strong> {selectedRow.ocupacion ?? "—"}
              </p>
              <p>
                <strong>Dirección cobro:</strong>{" "}
                {selectedRow.direccionCobro ?? "—"}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {selectedRow.activo ? "Activo" : "Inactivo"}
              </p>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={() => {
                  setOpenRead(false);
                  setSelectedRow(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiarios;
