import React, { useEffect, useState } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import toast from "react-hot-toast"
import { HiOutlineDocumentText } from "react-icons/hi"

import { Membresia, Plan } from "../../interfaces/interfaces"
import { getContratos, deleteContrato, getPlanes } from "../../services/contratos"

import BtnAgregar from "../botones/BtnAgregar"
import BtnEditar from "../botones/BtnEditar"
import BtnEliminar from "../botones/BtnEliminar"
import BtnCerrar from "../botones/BtnCerrar"
import BtnLeer from "../botones/BtnLeer"
import BtnCancelar from "../botones/BtnCancelar"

import FormContrato from "./FormContrato"
import DetallesContrato from "./DetallesContrato"

const DataTableContratos: React.FC = () => {
  const [contratos, setContratos] = useState<
    (Membresia & { planNombre?: string; titularNombre?: string })[]
  >([])
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Membresia | null>(null)
  const [closingModal, setClosingModal] = useState(false)
  const [search, setSearch] = useState("")
  const [showDetalles, setShowDetalles] = useState(false)
  const [contratoSeleccionado, setContratoSeleccionado] = useState<Membresia | null>(null)

  // 🔄 Cargar contratos y planes (con titulares)
  const fetchData = async () => {
    try {
      setLoading(true)
      const [c, pl] = await Promise.all([getContratos(), getPlanes()])
      setPlanes(pl)

      // Detectar titulares en membresías
      const titularesDetectados = c.flatMap((m: any) =>
        m.membresiaPaciente
          .filter((mp: any) => mp.paciente?.pacienteId === null)
          .map((mp: any) => ({
            idUsuario: mp.paciente?.usuario?.idUsuario,
            nombreCompleto: `${mp.paciente?.usuario?.nombre ?? ""} ${
              mp.paciente?.usuario?.apellido ?? ""
            }`.trim(),
            idMembresia: m.idMembresia,
          }))
      )

      const contratosConPlanYTitular = c.map((m: any) => {
        const planRelacionado = pl.find((p) => Number(p.idPlan) === Number(m.planId))
        const titular = titularesDetectados.find((t) => t.idMembresia === m.idMembresia)
        return {
          ...m,
          planNombre: planRelacionado ? planRelacionado.tipoPlan : "Sin plan",
          titularNombre: titular ? titular.nombreCompleto : "Sin titular",
        }
      })

      setContratos(contratosConPlanYTitular)
    } catch (error) {
      console.error("❌ Error cargando contratos:", error)
      toast.dismiss()
      toast.error("Error al cargar contratos", { duration: 1000 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 🗑️ Eliminar contrato
  const handleEliminar = async (id: number) => {
    toast.dismiss()
    toast(
      (t) => (
        <div className="text-center px-2">
          <p className="font-semibold text-gray-800 mb-3">
            ¿Deseas eliminar este contrato?
          </p>

          <div className="flex justify-center gap-3 mt-2">
            <div
              onClick={async () => {
                toast.dismiss(t.id)
                try {
                  await deleteContrato(id)
                  setContratos((prev) => prev.filter((c) => c.idMembresia !== id))
                  toast.success("Contrato eliminado correctamente ", { duration: 1000 })
                } catch (error: any) {
                  console.error("❌ Error al eliminar:", error)
                  toast.error("Error al eliminar contrato ", { duration: 1000 })
                }
              }}
            >
              <BtnEliminar />
            </div>

            <div onClick={() => toast.dismiss(t.id)}>
              <BtnCancelar />
            </div>
          </div>
        </div>
      ),
      { duration: 4000 }
    )
  }

  // ➕ Nuevo contrato
  const handleNuevo = () => {
    setEditing(null)
    setShowForm(true)
  }

  // ✅ Guardar o actualizar (refrescando data completa)
  const handleOnSuccess = async (saved?: Membresia) => {
    if (!saved) return
    toast.dismiss()
    toast.loading("Actualizando lista...", { id: "refresh" })
    await fetchData()
    toast.dismiss("refresh")
    toast.success(
      saved.idMembresia
        ? "Contrato actualizado correctamente ✅"
        : "Contrato creado con éxito 🎉",
      { duration: 1000 }
    )
  }

  // ✨ Cierre modal
  const closeModal = () => {
    setClosingModal(true)
    setTimeout(() => {
      setShowForm(false)
      setClosingModal(false)
      setEditing(null)
    }, 250)
  }

  // 🔍 Filtro búsqueda
  const filteredContratos = contratos.filter((c) => {
    const term = search.toLowerCase()
    return (
      c.numeroContrato.toLowerCase().includes(term) ||
      (c.planNombre?.toLowerCase().includes(term) ?? false) ||
      (c.titularNombre?.toLowerCase().includes(term) ?? false)
    )
  })

  // 📋 Columnas
  const columns: TableColumn<
    Membresia & { planNombre?: string; titularNombre?: string }
  >[] = [
    { name: "ID", selector: (row) => row.idMembresia, sortable: true, width: "80px" },
    { name: "N° Contrato", selector: (row) => row.numeroContrato, sortable: true },
    {
      name: "Titular",
      selector: (row) => row.titularNombre || "Sin titular",
      sortable: true,
      grow: 2,
    },
    {
      name: "Plan",
      selector: (row) => row.planNombre || "Sin plan",
      sortable: true,
      grow: 2,
    },
    {
      name: "Estado",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            row.estado
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {row.estado ? "Activo" : "Inactivo"}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2 p-2">
          <div onClick={() => { setContratoSeleccionado(row); setShowDetalles(true) }}>
            <BtnLeer />
          </div>
          <div onClick={() => { setEditing(row); setShowForm(true) }}>
            <BtnEditar />
          </div>
          <div onClick={() => handleEliminar(row.idMembresia)}>
            <BtnEliminar />
          </div>
        </div>
      ),
      button: true,
      minWidth: "180px",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center w-full px-4 py-8 bg-blue-50">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl p-4 overflow-x-auto">
        {/* 🔹 Encabezado con ícono y botón igual que en “Visitas” */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-600 flex items-center">
            <HiOutlineDocumentText className="w-10 h-auto text-blue-600 mr-4" />
            Contratos
          </h2>

          <input
            type="text"
            placeholder="Buscar contrato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl focus:outline-none"
          />

          <div onClick={handleNuevo}>
            {/* 👇 igual que en Visitas */}
            <BtnAgregar verText={true} />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredContratos}
          pagination
          highlightOnHover
          striped
          progressPending={loading}
          noDataComponent="No hay contratos registrados"
        />
      </div>

      {showForm && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 ${
            closingModal
              ? "opacity-0 bg-gray-900/0"
              : "opacity-100 bg-gray-900/60 backdrop-blur-sm"
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-[600px] max-w-[95%] p-6 relative border border-gray-200 transform transition-all duration-300 ${
              closingModal ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="absolute top-3 right-3" onClick={closeModal}>
              <BtnCerrar />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center border-b pb-2">
              {editing ? "Editar Contrato" : "Nuevo Contrato"}
            </h2>

            <FormContrato
              contrato={editing}
              setShowForm={setShowForm}
              onSuccess={async (saved) => {
                await handleOnSuccess(saved)
                closeModal()
              }}
              planes={planes}
            />
          </div>
        </div>
      )}

      {showDetalles && (
        <DetallesContrato
          contrato={contratoSeleccionado}
          setShowDetalles={setShowDetalles}
        />
      )}
    </div>
  )
}

export default DataTableContratos
