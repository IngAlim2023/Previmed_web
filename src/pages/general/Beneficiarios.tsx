// src/pages/beneficiarios/Beneficiarios.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { readBeneficiarios, createBeneficiario, deleteBeneficiario } from "../../services/beneficiariosService";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import BeneficiariosTable from "../../components/beneficiarios/BeneficiariosTable";
import ModalCrearBeneficiario from "../../components/beneficiarios/ModalCrearBeneficiario";
import BtnCerrar from "../../components/botones/BtnCerrar";
import { FaTrash } from "react-icons/fa6";

const Beneficiarios: React.FC = () => {
  const location = useLocation();
  const paciente = location.state

  const [data, setData] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState<number | null>(null);
  const [openRead, setOpenRead] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const [formCreate, setFormCreate] = useState({
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

  useEffect(() => {
    cargar();
  }, [paciente?.idPaciente]);

  const cargar = async () => {
    try {
      const res = await readBeneficiarios(paciente?.idPaciente);
      setData(res.data || res || []);
    } catch (e) {
      toast.error("Error al obtener los beneficiarios");
    }
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (res.message === "Error") return toast.error(res.error || "No se pudo crear");
      toast.success("Beneficiario creado correctamente");
      setOpenCreate(false);
      cargar();
    } catch (error) {
      toast.error("Error al crear beneficiario");
    }
  };

  const confirmDelete = async () => {
    if (!idDelete) return;
    try {
      const res = await deleteBeneficiario(idDelete);
      if (res.message === "Error") return toast.error(res.error || "No se puede eliminar");
      toast.success("Beneficiario eliminado");
      setOpenDelete(false);
      cargar();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-blue-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-white text-black">
          <h2 className="text-3xl font-bold">{paciente?.idPaciente ? "Beneficiarios del paciente" : "Todos los beneficiarios"}</h2>
          <p className="text-black mt-1">Gestiona los beneficiarios de forma segura</p>
        </div>

        <div className="p-6 border-b border-gray-200 flex gap-3">
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                       text-teal-700 border border-teal-300 bg-white hover:bg-teal-50
                       transition-all focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center">
              <FaPlus />
            </span>
            <span className="font-medium">Crear beneficiario</span>
          </button>
        </div>

        <div className="p-6">
          <BeneficiariosTable
            data={data}
            onDelete={(id) => {
              setIdDelete(id);
              setOpenDelete(true);
            }}
            onRead={(row) => {
              setSelectedRow(row);
              setOpenRead(true);
            }}
          />
        </div>
      </div>

      {openCreate && (
        <ModalCrearBeneficiario
          formData={formCreate}
          setFormData={setFormCreate}
          onCerrar={() => setOpenCreate(false)}
          onGuardar={submitCreate}
        />
      )}

      {openDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 relative">
            <button onClick={() => setOpenDelete(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaTrash className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Eliminar beneficiario</h2>
            </div>
            <p className="text-gray-600 mb-6 text-center">¿Estás seguro que deseas eliminarlo? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setOpenDelete(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {openRead && selectedRow && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/90 via-sky-50/90 to-indigo-100/90 backdrop-blur-[1px] flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-2xl p-6 relative ring-1 ring-slate-200">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-slate-800">Detalles del beneficiario</h3>
              <p className="text-slate-500 text-sm">Información básica del beneficiario seleccionado</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Nombre:</strong> {selectedRow.usuario?.nombre ?? "—"}</p>
              <p><strong>Apellido:</strong> {selectedRow.usuario?.apellido ?? "—"}</p>
              <p><strong>Segundo nombre:</strong> {selectedRow.usuario?.segundoNombre ?? "—"}</p>
              <p><strong>Segundo apellido:</strong> {selectedRow.usuario?.segundoApellido ?? "—"}</p>
              <p><strong>Documento:</strong> {selectedRow.usuario?.numeroDocumento ?? "—"}</p>
              <p><strong>Email:</strong> {selectedRow.usuario?.email ?? "—"}</p>
              <p><strong>Ocupación:</strong> {selectedRow.ocupacion ?? "—"}</p>
              <p><strong>Dirección cobro:</strong> {selectedRow.direccionCobro ?? "—"}</p>
              <p><strong>Estado:</strong> {selectedRow.activo ? "Activo" : "Inactivo"}</p>
            </div>
            <div className="flex justify-end pt-6">
              <div onClick={() => setOpenRead(false)}>
                <BtnCerrar verText text="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiarios;