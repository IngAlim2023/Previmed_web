import React, { useEffect, useState } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import toast from "react-hot-toast"
import { HiOutlineHeart } from "react-icons/hi"

import BtnAgregar from "../botones/BtnAgregar"
import BtnEditar from "../botones/BtnEditar"
import BtnEliminar from "../botones/BtnEliminar"
import BtnLeer from "../botones/BtnLeer"
import BtnCerrar from "../botones/BtnCerrar"
import BtnCancelar from "../botones/BtnCancelar"

import FormBeneficio from "./FormBeneficios"
import DetallesBeneficio from "./DetallesBeneficio"
import { getBeneficios, deleteBeneficio } from "../../services/beneficios"
import { Beneficio } from "../../interfaces/beneficios"

const DataTableBeneficios: React.FC = () => {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Beneficio | null>(null)
  const [closingModal, setClosingModal] = useState(false)
  const [search, setSearch] = useState("")
  const [showDetalles, setShowDetalles] = useState(false)
  const [beneficioSeleccionado, setBeneficioSeleccionado] = useState<Beneficio | null>(null)

  // 🔄 Cargar beneficios
  const fetchBeneficios = async () => {
    try {
      setLoading(true)
      const data = await getBeneficios()
      setBeneficios(data)
    } catch (error) {
      console.error("❌ Error al cargar beneficios:", error)
      toast.error("Error al cargar beneficios", { duration: 1200 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBeneficios()
  }, [])

  // 🗑️ Eliminar beneficio
  const handleEliminar = async (id: number) => {
    toast.dismiss()
    toast(
      (t) => (
        <div className="text-center px-2">
          <p className="font-semibold text-gray-800 mb-3">
            ¿Deseas eliminar este beneficio?
          </p>
          <div className="flex justify-center gap-3 mt-2">
            <div
              onClick={async () => {
                toast.dismiss(t.id)
                try {
                  await deleteBeneficio(id)
                  setBeneficios((prev) => prev.filter((b) => b.id_beneficio !== id))
                  toast.success("Beneficio eliminado correctamente", { duration: 1000 })
                } catch (error: any) {
                  console.error("❌ Error al eliminar:", error)
                  toast.error("Error al eliminar beneficio", { duration: 1000 })
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

  // ➕ Nuevo beneficio
  const handleNuevo = () => {
    setEditing(null)
    setShowForm(true)
  }

  // ✅ Actualizar tabla tras guardar/editar
  const handleOnSuccess = async (saved?: Beneficio) => {
    // 🚫 No hacer nada si no hay datos guardados
    if (!saved || typeof saved !== "object") return

    const normalized = {
      id_beneficio: saved.id_beneficio ?? saved.idBeneficio,
      tipo_beneficio: saved.tipo_beneficio ?? saved.tipoBeneficio,
    }

    setBeneficios((prev) => {
      const existe = prev.find((b) => b.id_beneficio === normalized.id_beneficio)
      return existe
        ? prev.map((b) => (b.id_beneficio === normalized.id_beneficio ? normalized : b))
        : [...prev, normalized]
    })

    // ✅ Mostrar toast solo cuando realmente se guardó
    toast.dismiss()
    toast.success(
      editing ? "Beneficio actualizado correctamente ✅" : "Beneficio creado exitosamente 🎉",
      { duration: 1200 }
    )
  }

  // ✨ Cerrar modal con animación y limpiar edición
  const closeModal = () => {
    setEditing(null) // 👈 limpiar ANTES de cerrar para evitar toasts falsos
    setClosingModal(true)
    setTimeout(() => {
      setShowForm(false)
      setClosingModal(false)
    }, 250)
  }

  // 🔍 Filtro búsqueda
  const filteredBeneficios = (beneficios || []).filter((b) =>
    (b.tipo_beneficio ?? "").toLowerCase().includes(search.toLowerCase())
  )

  // 📋 Columnas
  const columns: TableColumn<Beneficio>[] = [
    { name: "ID", selector: (row) => row.id_beneficio ?? 0, sortable: true, width: "90px" },
    {
      name: "Tipo de Beneficio",
      selector: (row) => row.tipo_beneficio || "—",
      sortable: true,
      grow: 2,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <div onClick={() => { setEditing(row); setShowForm(true) }}>
            <BtnEditar />
          </div>
          <div onClick={() => handleEliminar(row.id_beneficio!)}>
            <BtnEliminar />
          </div>
          <div onClick={() => { setBeneficioSeleccionado(row); setShowDetalles(true) }}>
            <BtnLeer />
          </div>
        </div>
      ),
      width: "200px",
    },
  ]

  return (
    <div className="bg-blue-50 min-h-screen p-6 flex justify-center">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-6xl">
        {/* 🔹 Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <div className="flex items-center gap-2">
            <HiOutlineHeart className="text-blue-600 text-3xl" />
            <h2 className="text-2xl font-bold text-gray-700">Beneficios</h2>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar beneficio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div onClick={handleNuevo}>
              {/* @ts-expect-error */}
              <BtnAgregar>Agregar</BtnAgregar>
            </div>
          </div>
        </div>

        {/* 📋 Tabla principal */}
        <DataTable
          columns={columns}
          data={filteredBeneficios}
          progressPending={loading}
          pagination
          highlightOnHover
          pointerOnHover
          striped
          responsive
          noDataComponent="No hay beneficios registrados."
        />
      </div>

      {/* 🧩 Modal Formulario */}
      {showForm && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 ${
            closingModal
              ? "opacity-0 bg-gray-900/0"
              : "opacity-100 bg-gray-900/60 backdrop-blur-sm"
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-[500px] max-w-[95%] p-6 relative border border-gray-200 transform transition-all duration-300 ${
              closingModal ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="absolute top-3 right-3" onClick={closeModal}>
              <BtnCerrar />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center border-b pb-2">
              {editing ? "Editar Beneficio" : "Nuevo Beneficio"}
            </h2>

            <FormBeneficio
              beneficio={editing}
              setShowForm={setShowForm}
              onSuccess={async (saved) => {
                await handleOnSuccess(saved)
                closeModal()
              }}
            />
          </div>
        </div>
      )}

      {/* 🧾 Modal Detalles */}
      {showDetalles && (
        <DetallesBeneficio
          beneficio={beneficioSeleccionado}
          setShowDetalles={setShowDetalles}
        />
      )}
    </div>
  )
}

export default DataTableBeneficios
