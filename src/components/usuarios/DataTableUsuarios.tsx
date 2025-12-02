import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

import { DataUsuario } from "../../interfaces/usuario";
import { getUsuarios, updateUsuario } from "../../services/usuarios";
import UsuarioForm from "../../components/usuarios/UsuarioForm";

import BtnAgregar from "../../components/botones/BtnAgregar";
import BtnLeer from "../../components/botones/BtnLeer";
import BtnEditar from "../../components/botones/BtnEditar";
import BtnCambiar from "../../components/botones/BtnCambiar";

const DataTableUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<DataUsuario[]>([]);
  const [search, setSearch] = useState("");
  const [modalDetalles, setModalDetalles] = useState<DataUsuario | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<DataUsuario | null>(null);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDeshabilitar = async (id: string) => {
    if (!confirm("¿Seguro que quieres deshabilitar este usuario?")) return;

    try {
      await updateUsuario(id, { habilitar: false });
      toast.success("Usuario deshabilitado correctamente");

      // Actualiza el estado local sin recargar
      setUsuarios((prev) =>
        prev.map((u) => (u.idUsuario === id ? { ...u, habilitar: false } : u))
      );
    } catch (error) {
      toast.error("No se pudo deshabilitar el usuario");
    }
  };

  const handleUpdate = async (data: Partial<DataUsuario>) => {
    if (!editing) return;
    try {
      await updateUsuario(editing.idUsuario!, data);
      toast.success("Usuario actualizado");
      setShowModal(false);
      setEditing(null);
      fetchUsuarios();
    } catch (e) {
      toast.error("Error al actualizar");
    }
  };

  const columns = [
    {
      name: "Nombre",
      selector: (r: DataUsuario) => `${r.nombre} ${r.apellido}`,
      sortable: true,
    },
    {
      name: "Documento",
      selector: (r: DataUsuario) => r.numeroDocumento || "-",
      sortable: true,
    },
    {
      name: "Email",
      selector: (r: DataUsuario) => r.email || "-",
      sortable: true,
    },
    {
      name: "Rol",
      selector: (r: DataUsuario) => r.rol?.nombreRol ?? "-",
      sortable: true,
    },
    {
      name: "Habilitado",
      selector: (r: DataUsuario) => (r.habilitar ? "Sí" : "No"),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: DataUsuario) => (
        <div className="flex gap-2 justify-center">
          <div onClick={() => setModalDetalles(row)}>
            <BtnLeer />
          </div>
          <div
            onClick={() => {
              setEditing(row);
              setShowModal(true);
            }}
          >
            <BtnEditar />
          </div>
          <div onClick={() => handleDeshabilitar(row.idUsuario!)}>
            <BtnCambiar />
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredData = usuarios.filter((u) => {
    const full =
      `${u.nombre} ${u.segundoNombre} ${u.apellido} ${u.segundoApellido}`.toLowerCase();
    return (
      full.includes(search.toLowerCase()) ||
      u.numeroDocumento?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por nombre, documento o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />
      <div className="mb-4 flex justify-end">
        <div onClick={() => console.log("Agregar usuario")}>
          <BtnAgregar />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        noDataComponent="No hay usuarios disponibles"
      />

      {modalDetalles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Detalles del Usuario</h2>
            <div className="mb-4 space-y-1 text-sm">
              <p>
                <strong>Nombre:</strong> {modalDetalles.nombre}{" "}
                {modalDetalles.segundoNombre}
              </p>
              <p>
                <strong>Apellidos:</strong> {modalDetalles.apellido}{" "}
                {modalDetalles.segundoApellido}
              </p>
              <p>
                <strong>Documento:</strong> {modalDetalles.tipoDocumento}{" "}
                {modalDetalles.numeroDocumento}
              </p>
              <p>
                <strong>Email:</strong> {modalDetalles.email}
              </p>
              <p>
                <strong>Dirección:</strong> {modalDetalles.direccion}
              </p>
              <p>
                <strong>Fecha Nacimiento:</strong>{" "}
                {new Date(modalDetalles.fechaNacimiento).toISOString().split('T')[0]}
              </p>
              <p>
                <strong>Estado Civil:</strong> {modalDetalles.estadoCivil}
              </p>
              <p>
                <strong>Número Hijos:</strong> {modalDetalles.numeroHijos}
              </p>
              <p>
                <strong>Estrato:</strong> {modalDetalles.estrato}
              </p>
              <p>
                <strong>Género:</strong> {modalDetalles.genero}
              </p>
              <p>
                <strong>EPS:</strong> {modalDetalles.eps.nombreEps}
              </p>
              <p>
                <strong>Rol:</strong> {modalDetalles.rol.nombreRol}
              </p>
              <p>
                <strong>Autorización Datos:</strong>{" "}
                {modalDetalles.autorizacionDatos ? "Sí" : "No"}
              </p>
              <p>
                <strong>Habilitado:</strong>{" "}
                {modalDetalles.habilitar ? "Sí" : "No"}
              </p>
            </div>
            <div className="text-right">
              <button
                onClick={() => setModalDetalles(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Editar Usuario
            </h2>
            <UsuarioForm
              initialData={editing}
              onSubmit={handleUpdate}
              onCancel={() => {
                setShowModal(false);
                setEditing(null);
              }}
              isEditing={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTableUsuarios;
