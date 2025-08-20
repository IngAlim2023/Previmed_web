import React, { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import toast from "react-hot-toast"
import { Membresia } from "../../interfaces/interfaces"
import BtnLeer from "../botones/BtnLeer"
import { generarPDF } from "./ContratoPDF"

const DataTableContratos: React.FC = () => {
      const [contratos, setContratos] = useState<any[]>([]) // Cambiado a any[] por la estructura
  const [search, setSearch] = useState("")
  const [modalDetalles, setModalDetalles] = useState<any | null>(null) // Cambiado a any

  const fetchContratos = async () => {
    try {
      const res = await fetch("http://localhost:3334/membresias")
      const raw = await res.json()

      //  backend devuelve directamente el array
      const data = Array.isArray(raw) ? raw : []
      setContratos(data)
    } catch (error) {
      console.error("Error al cargar contratos:", error)
      toast.error("Error al cargar contratos")
    }
  }

  useEffect(() => {
    fetchContratos()
  }, [])

  // Funciones auxiliares actualizadas para tu estructura camelCase
  const getNombre = (mp: any) => {
    const usuario = mp?.paciente?.usuario
    if (!usuario) return "Sin nombre"
    
    // Concatenar nombres y apellidos
    const nombres = [
      usuario.nombre,
      usuario.segundoNombre,
      usuario.apellido,
      usuario.segundoApellido
    ].filter(Boolean).join(" ")
    
    return nombres || "Sin nombre"
  }

  const getDocumento = (mp: any) => {
    return mp?.paciente?.usuario?.numeroDocumento || "Sin documento"
  }

  const columns = [
    {
      name: "Nombre(s)",
      selector: (row: any) => {
        if (!row.membresiaPaciente?.length) return "Sin pacientes"
        return row.membresiaPaciente.map(getNombre).join(", ")
      },
      sortable: true,
    },
    {
      name: "Documento(s)",
      selector: (row: any) => {
        if (!row.membresiaPaciente?.length) return "Sin pacientes"
        return row.membresiaPaciente.map(getDocumento).join(", ")
      },
      sortable: true,
    },
    {
      name: "Número Contrato",
      selector: (row: any) => row.numeroContrato || "-",
      sortable: true,
    },
    
    {
      name: "Acción",
      cell: (row: any) => (
        <div className="flex gap-2">
          <div onClick={() => setModalDetalles(row)}>
            <BtnLeer />
          </div>
        </div>
      ),
    },
  ]

  const filteredData = contratos.filter((item) => {
    if (!item.membresiaPaciente?.length) return false

    const nombres = item.membresiaPaciente
      .map((mp:any) => getNombre(mp).toLowerCase())
      .join(" ")
    
    const documentos = item.membresiaPaciente
      .map((mp:any) => getDocumento(mp).toLowerCase())
      .join(" ")
    
    const searchTerm = search.toLowerCase()

    return (
      nombres.includes(searchTerm) ||
      documentos.includes(searchTerm) ||
      (item.numeroContrato && item.numeroContrato.toLowerCase().includes(searchTerm)) ||
      (item.formaPago && item.formaPago.toLowerCase().includes(searchTerm))
     
    )
  })

  const cerrarModal = () => setModalDetalles(null)

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por nombre, documento o número de contrato..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        noDataComponent="No hay contratos disponibles"
      />

      {modalDetalles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Contrato de afiliación</h2>

            <div className="mb-4">
              <p><strong>Número de Contrato:</strong> {modalDetalles.numeroContrato}</p>
              <p><strong>Forma de Pago:</strong> {modalDetalles.formaPago}</p>
              <p><strong>Fecha Inicio:</strong> {new Date(modalDetalles.fechaInicio).toLocaleDateString()}</p>
              <p><strong>Fecha Fin:</strong> {new Date(modalDetalles.fechaFin).toLocaleDateString()}</p>
              <p><strong>Firma:</strong> {modalDetalles.firma}</p>
              <p><strong>Estado:</strong> {modalDetalles.estado ? "Activo" : "Inactivo"}</p>
            </div>

            <h3 className="text-lg font-semibold mb-3">Pacientes asociados:</h3>
            
            {modalDetalles.membresiaPaciente?.map((mp:any, index:any) => {
              const usuario = mp.paciente?.usuario
              if (!usuario) return null

              return (
                <div key={index} className="mb-4 border-b pb-4">
                  <p><strong>Nombre:</strong> {getNombre(mp)}</p>
                  <p><strong>Documento:</strong> {usuario.numeroDocumento}</p>
                  <p><strong>Email:</strong> {usuario.email}</p>
                  <p><strong>Ocupación:</strong> {mp.paciente?.ocupacion}</p>

                  <button
                    onClick={() =>
                      generarPDF({
                        nombre: getNombre(mp),
                        numeroDocumento: usuario.numeroDocumento,
                      })
                    }
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    📄 Descargar PDF
                  </button>
                </div>
              )
            })}

            <div className="text-right">
              <button
                onClick={cerrarModal}
                className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTableContratos