import React, { useEffect, useState } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import toast from "react-hot-toast"

import { Membresia, Plan } from "../../interfaces/interfaces"
import { getContratos, deleteContrato, getPlanes } from "../../services/contratos"

// 🧩 Botones personalizados
import BtnAgregar from "../botones/BtnAgregar"
import BtnEditar from "../botones/BtnEditar"
import BtnEliminar from "../botones/BtnEliminar"
import BtnCerrar from "../botones/BtnCerrar"

// 🧩 Modal formulario
import FormContrato from "./FormContrato"

const DataTableContratos: React.FC = () => {
  const [contratos, setContratos] = useState<(Membresia & { planNombre?: string })[]>([])
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Membresia | null>(null)
  const [closingModal, setClosingModal] = useState(false)
  const [search, setSearch] = useState("") // 🔍 Estado para la búsqueda

  // 🔄 Cargar contratos y planes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [c, pl] = await Promise.all([getContratos(), getPlanes()])
        setPlanes(pl)

        const contratosConPlanNombre = c.map((m) => {
          const planRelacionado = pl.find((p) => Number(p.idPlan) === Number(m.planId))
          return {
            ...m,
            planNombre: planRelacionado ? planRelacionado.tipoPlan : "Sin plan",
          }
        })

        setContratos(contratosConPlanNombre)
      } catch (error) {
        console.error("❌ Error cargando contratos:", error)
        toast.error("Error al cargar contratos", { duration: 1500 })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 🧾 Columnas
  const columns: TableColumn<Membresia & { planNombre?: string }>[] = [
    { name: "ID", selector: (row) => row.idMembresia, sortable: true },
    { name: "Firma", selector: (row) => row.firma, sortable: true },
    { name: "Forma de Pago", selector: (row) => row.formaPago, sortable: true },
    { name: "Número Contrato", selector: (row) => row.numeroContrato, sortable: true },
    { name: "Fecha Inicio", selector: (row) => row.fechaInicio.split("T")[0], sortable: true },
    { name: "Fecha Fin", selector: (row) => row.fechaFin.split("T")[0], sortable: true },
    {
      name: "Plan",
      selector: (row) => row.planNombre || "Sin plan",
      sortable: true,
      grow: 2,
    },
    {
      name: "Estado",
      selector: (row) => (row.estado ? "Activo" : "Inactivo"),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <div onClick={() => { setEditing(row); setShowForm(true) }}>
            <BtnEditar />
          </div>
          <div onClick={() => handleEliminar(row.idMembresia)}>
            <BtnEliminar />
          </div>
        </div>
      ),
    },
  ]

  // 🗑️ Eliminar contrato
  const handleEliminar = async (id: number) => {
    toast((t) => (
      <div className="text-center">
        <p className="font-semibold text-gray-800 mb-2">
          ¿Deseas eliminar este contrato?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              try {
                await deleteContrato(id)
                setContratos((prev) => prev.filter((c) => c.idMembresia !== id))
                toast.success("Contrato eliminado correctamente", { duration: 1500 })
              } catch (error: any) {
                console.error("❌ Error al eliminar:", error)
                toast.error("Error al eliminar contrato", { duration: 1500 })
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 3000 })
  }

  // ➕ Nuevo contrato
  const handleNuevo = () => {
    setEditing(null)
    setShowForm(true)
  }

  // ✅ Guardar o actualizar
  const handleOnSuccess = (saved?: Membresia) => {
    if (!saved) return
    const planRelacionado = planes.find((p) => Number(p.idPlan) === Number(saved.planId))
    const savedWithPlanNombre = {
      ...saved,
      planNombre: planRelacionado ? planRelacionado.tipoPlan : "Sin plan",
    }

    setContratos((prev) => {
      const exists = prev.find((p) => p.idMembresia === saved.idMembresia)
      if (exists) {
        return prev.map((p) =>
          p.idMembresia === saved.idMembresia ? savedWithPlanNombre : p
        )
      }
      return [savedWithPlanNombre, ...prev]
    })
  }

  // ✨ Cierre con animación
  const closeModal = () => {
    setClosingModal(true)
    setTimeout(() => {
      setShowForm(false)
      setClosingModal(false)
      setEditing(null)
    }, 250)
  }

  // 🔍 Filtrar contratos según la búsqueda
  const filteredContratos = contratos.filter((c) => {
    const term = search.toLowerCase()
    return (
      c.firma.toLowerCase().includes(term) ||
      c.formaPago.toLowerCase().includes(term) ||
      c.numeroContrato.toLowerCase().includes(term) ||
      (c.planNombre?.toLowerCase().includes(term) ?? false)
    )
  })

  return (
    <div className="p-6">
      {/* Barra superior con búsqueda y botón agregar */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-3">
        {/* 🔍 Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar contrato..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* ➕ Botón agregar */}
        <div onClick={handleNuevo}>
          {/* @ts-expect-error forzar children sin modificar el componente */}
          <BtnAgregar>Nuevo contrato</BtnAgregar>
        </div>
      </div>

      {/* Modal elegante con fade */}
      {showForm && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 ${
            closingModal ? "opacity-0 bg-gray-900/0" : "opacity-100 bg-gray-900/60 backdrop-blur-sm"
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-[600px] max-w-[95%] p-6 relative border border-gray-200 transform transition-all duration-300 ${
              closingModal ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            {/* 🧩 Botón personalizado para cerrar */}
            <div className="absolute top-3 right-3" onClick={closeModal}>
              <BtnCerrar />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center border-b pb-2">
              {editing ? "Editar Contrato" : "Nuevo Contrato"}
            </h2>

            <FormContrato
              contrato={editing}
              setShowForm={setShowForm}
              onSuccess={(c) => {
                handleOnSuccess(c)
                closeModal()
              }}
              planes={planes}
            />
          </div>
        </div>
      )}

      {/* Tabla principal */}
      <DataTable
        title="Gestión de Contratos"
        columns={columns}
        data={filteredContratos}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
        noDataComponent="No hay contratos registrados."
      />
    </div>
  )
}

export default DataTableContratos
