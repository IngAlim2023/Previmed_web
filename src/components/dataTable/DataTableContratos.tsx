import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

// Importar las interfaces desde el archivo central
// Ajusta esta ruta si tu archivo 'interfaces.ts' está en otra ubicación relativa
import { Membresia,Paciente,Plan,NuevoContratoForm } from "../../interfaces/interfaces";

// Importar los componentes de botones
// ¡Estas son las líneas que faltaban y causaban el error!
// Ajusta estas rutas si tus botones están en otra ubicación relativa a DataTableContratos.tsx
import BtnAgregar from "../botones/BtnAgregar";
import BtnLeer from "../botones/BtnLeer";


const DataTableContratos: React.FC = () => {
  // Usar las interfaces importadas para el estado
  const [contratos, setContratos] = useState<Membresia[]>([]);
  const [form, setForm] = useState<boolean>(false);
  const [planes, setPlanes] = useState<Plan[]>([]); 
  const [pacientes, setPacientes] = useState<Paciente[]>([]); 

  // Estado del formulario tipado con la interfaz NuevoContratoForm
  const [nuevoContrato, setNuevoContrato] = useState<NuevoContratoForm>({
    firma: "",
    formaPago: "Efectivo",
    numeroContrato: "",
    fechaInicio: "",
    fechaFin: "",
    planId: "", 
    pacienteId: "", 
  });

  // Cargar datos
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resContratos, resPlanes, resPacientes] = await Promise.all([
          fetch("http://localhost:3334/membresias"),
          fetch("http://localhost:3334/planes"), 
          fetch("http://localhost:3334/pacientes"),
        ]);

        const contratosData: Membresia[] = await resContratos.json();
        const planesData: Plan[] = await resPlanes.json();
        const pacientesData: Paciente[] = await resPacientes.json();
        
        setContratos(contratosData);
        setPlanes(planesData);
        setPacientes(pacientesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar datos");
      }
    };
    fetchDatos();
  }, []);

  const handleCrear = async () => {
    // La validación se mantiene igual
    if (
      !nuevoContrato.firma ||
      !nuevoContrato.numeroContrato ||
      !nuevoContrato.fechaInicio ||
      !nuevoContrato.fechaFin ||
      !nuevoContrato.planId ||
      !nuevoContrato.pacienteId
    ) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("http://localhost:3334/membresias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firma: nuevoContrato.firma,
          forma_pago: nuevoContrato.formaPago,
          numero_contrato: nuevoContrato.numeroContrato,
          fecha_inicio: nuevoContrato.fechaInicio,
          fecha_fin: nuevoContrato.fechaFin,
          plan_id: Number(nuevoContrato.planId), 
          paciente_id: Number(nuevoContrato.pacienteId), 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al crear contrato");
      }

      // Volver a cargar todos los contratos para reflejar el nuevo cambio
      const updatedRes = await fetch("http://localhost:3334/membresias");
      const updatedData: Membresia[] = await updatedRes.json();
      setContratos(updatedData);

      toast.success("Contrato creado exitosamente");
      setForm(false);
      setNuevoContrato({
        firma: "",
        formaPago: "Efectivo",
        numeroContrato: "",
        fechaInicio: "",
        fechaFin: "",
        planId: "",
        pacienteId: "",
      });
    } catch (error: any) {
      console.error("Error al crear contrato:", error);
      toast.error(error.message || "Error al crear contrato");
    }
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row: Membresia) =>
        row.membresiaPaciente[0]?.paciente?.usuario?.nombre || "-",
      sortable: true,
    },
    {
      name: "Documento",
      selector: (row: Membresia) =>
        row.membresiaPaciente[0]?.paciente?.usuario?.numeroDocumento || "-", // Usando numero_documento como el nombre más probable en snake_case
      sortable: true,
    },
    {
      name: "Acción",
      cell: (row: Membresia) => (
        <div className="flex gap-2">
          <div onClick={() => toast(JSON.stringify(row, null, 2))}>
            <BtnLeer/>
          </div>
        </div>
      )
    }
]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full px-4 py-8 bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Contratos</h2>
          <div onClick={() => setForm(true)}>
            <BtnAgregar verText={true} />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={contratos}
          pagination
          highlightOnHover
          striped
          noDataComponent="No hay contratos"
        />
      </div>

      {form && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Crear Contrato</h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Firma"
                value={nuevoContrato.firma}
                onChange={(e) => setNuevoContrato({ ...nuevoContrato, firma: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Número de contrato"
                value={nuevoContrato.numeroContrato}
                onChange={(e) => setNuevoContrato({ ...nuevoContrato, numeroContrato: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="date"
                placeholder="Fecha de inicio"
                value={nuevoContrato.fechaInicio}
                onChange={(e) => setNuevoContrato({ ...nuevoContrato, fechaInicio: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="date"
                placeholder="Fecha de fin"
                value={nuevoContrato.fechaFin}
                onChange={(e) => setNuevoContrato({ ...nuevoContrato, fechaFin: e.target.value })}
                className="border px-3 py-2 rounded"
              />

              {/* Campo de texto para ID del Plan */}
              <input
                type="text"
                placeholder="ID del Plan"
                value={nuevoContrato.planId}
                onChange={(e) => setNuevoContrato({ ...nuevoContrato, planId: e.target.value })}
                className="border px-3 py-2 rounded"
              />

              
              <input
                type="text"
                placeholder="ID del Paciente"
                value={nuevoContrato.pacienteId}
                onChange={(e) => setNuevoContrato({ ...nuevoContrato, pacienteId: e.target.value })}
                className="border px-3 py-2 rounded"
              />

              <select
                value={nuevoContrato.formaPago}
                onChange={(e) => setNuevoContrato({ ...nuevoContrato, formaPago: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Nequi">Nequi</option>
                <option value="Daviplata">Daviplata</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrear}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTableContratos;
