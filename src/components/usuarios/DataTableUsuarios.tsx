import React, { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import toast from "react-hot-toast"

import { DataUsuario } from "../../interfaces/usuario"
import { getUsuarios, deleteUsuario } from "../../services/usuarios"

import BtnAgregar from "../../components/botones/BtnAgregar"
import BtnLeer from "../../components/botones/BtnLeer"
import BtnEditar from "../../components/botones/BtnEditar"
import BtnEliminar from "../../components/botones/BtnEliminar"
import BtnCambiar from "../../components/botones/BtnCambiar"

const DataTableUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<DataUsuario[]>([])
  const [search, setSearch] = useState("")
  const [modalDetalles, setModalDetalles] = useState<DataUsuario | null>(null)

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      toast.error("Error al cargar usuarios")
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return
    try {
      await deleteUsuario(id)
      toast.success("Usuario eliminado correctamente")
      fetchUsuarios()
    } catch (error) {
      console.error(error)
      toast.error("Error al eliminar usuario")
    }
  }

  // 🔹 Solo campos importantes en la tabla
  const columns = [
    { 
      name: "Nombre", 
      selector: (row: DataUsuario) => `${row.nombre ?? ""} ${row.apellido ?? ""}`, 
      sortable: true 
    },
    { 
      name: "Documento", 
      selector: (row: DataUsuario) => row.numeroDocumento || "-", 
      sortable: true 
    },
    { 
      name: "Email", 
      selector: (row: DataUsuario) => row.email || "-", 
      sortable: true 
    },
    { 
      name: "Rol", 
      selector: (row: DataUsuario) => row.rolId ?? "-", 
      sortable: true 
    },
    { 
      name: "Habilitado", 
      selector: (row: DataUsuario) => (row.habilitar ? "Sí" : "No"), 
      sortable: true 
    },
    {
      name: "Acciones",
      cell: (row: DataUsuario) => (
        <div className="flex gap-2 justify-center">
          <div onClick={() => setModalDetalles(row)}>
            <BtnLeer />
          </div>
          <div onClick={() => console.log("Editar usuario", row)}>
            <BtnEditar />
          </div>
          <div onClick={() => handleDelete(row.idUsuario!)}>
            <BtnEliminar />
          </div>
          <div onClick={() => console.log("Cambiar estado usuario", row)}>
            <BtnCambiar />
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]

  const filteredData = usuarios.filter((u) => {
    const nombreCompleto = `${u.nombre} ${u.segundoNombre} ${u.apellido} ${u.segundoApellido}`.toLowerCase()
    const documento = u.numeroDocumento?.toLowerCase() || ""
    const email = u.email?.toLowerCase() || ""
    const searchTerm = search.toLowerCase()

    return (
      nombreCompleto.includes(searchTerm) ||
      documento.includes(searchTerm) ||
      email.includes(searchTerm)
    )
  })

  const cerrarModal = () => setModalDetalles(null)

  return (
    <div>
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre, documento o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />

      {/* Botón agregar */}
      <div className="mb-4 flex justify-end">
        <div onClick={() => console.log("Agregar usuario")}>
          <BtnAgregar />
        </div>
      </div>

      {/* Tabla */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        noDataComponent="No hay usuarios disponibles"
      />

      {/* Modal Detalles */}
      {modalDetalles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Detalles del Usuario</h2>

            <div className="mb-4">
              <p><strong>Nombre:</strong> {modalDetalles.nombre} {modalDetalles.segundoNombre}</p>
              <p><strong>Apellidos:</strong> {modalDetalles.apellido} {modalDetalles.segundoApellido}</p>
              <p><strong>Documento:</strong> {modalDetalles.numeroDocumento}</p>
              <p><strong>Tipo Documento:</strong> {modalDetalles.tipoDocumento}</p>
              <p><strong>Email:</strong> {modalDetalles.email}</p>
              <p><strong>Dirección:</strong> {modalDetalles.direccion}</p>
              <p><strong>Fecha Nacimiento:</strong> {modalDetalles.fechaNacimiento}</p>
              <p><strong>Estado Civil:</strong> {modalDetalles.estadoCivil}</p>
              <p><strong>Número Hijos:</strong> {modalDetalles.numeroHijos}</p>
              <p><strong>Estrato:</strong> {modalDetalles.estrato}</p>
              <p><strong>Género:</strong> {modalDetalles.genero}</p>
              <p><strong>EPS:</strong> {modalDetalles.epsId}</p>
              <p><strong>Rol:</strong> {modalDetalles.rolId}</p>
              <p><strong>Autorización Datos:</strong> {modalDetalles.autorizacionDatos ? "Sí" : "No"}</p>
              <p><strong>Habilitado:</strong> {modalDetalles.habilitar ? "Sí" : "No"}</p>
            </div>

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

export default DataTableUsuarios
