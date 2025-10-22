// src/pages/beneficiarios/Beneficiarios.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { readBeneficiarios, createBeneficiario, deleteBeneficiario } from "../../services/beneficiariosService";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import BeneficiariosTable from "../../components/beneficiarios/BeneficiariosTable";
import ModalCrearBeneficiario from "../../components/beneficiarios/ModalCrearBeneficiario";
import { FaTrash } from "react-icons/fa6";

const Beneficiarios: React.FC = () => {
  const location = useLocation();
  const paciente = location.state?.row;

  const [data, setData] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState<number | null>(null);

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
      setData(res.data || []);
    } catch (e) {
      console.error("Error al cargar beneficiarios:", e);
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
      console.error("Error al crear beneficiario:", error);
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
    <div className="p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h2 className="text-3xl font-bold">{paciente?.idPaciente ? "Beneficiarios del paciente" : "Todos los beneficiarios"}</h2>
          <p className="text-blue-100 mt-1">Gestiona los beneficiarios de forma segura</p>
        </div>

        <div className="p-6 border-b border-gray-200 flex gap-3">
          <button onClick={() => setOpenCreate(true)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaPlus /> Crear beneficiario
          </button>
        </div>

        <div className="p-6">
          <BeneficiariosTable data={data} onDelete={(id) => {
            setIdDelete(id);
            setOpenDelete(true);
          }} />
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
    </div>
  );
};

export default Beneficiarios;