import React, { useEffect, useMemo, useState } from "react";
import { DataUsuario } from "../../interfaces/Usuario";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../api/usuarios";
import DataTableUsuarios, {
  TableColumn,
} from "../../components/dataTable/DataTableUsuarios";
import UsuarioForm from "../../components/usuarios/UsuarioForm";

// Importamos los botones reutilizables
import BtnAgregar from "../../components/botones/BtnAgregar";
import BtnEditar from "../../components/botones/BtnEditar";
import BtnEliminar from "../../components/botones/BtnEliminar";

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<DataUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DataUsuario | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCreate = async (usuario: Partial<DataUsuario>) => {
    try {
      setLoading(true);
      setError(null);
      await createUsuario(usuario);
      setShowForm(false);
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? "Error creando usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (usuario: Partial<DataUsuario>) => {
    if (!editing?.idUsuario) return;
    try {
      setLoading(true);
      setError(null);
      await updateUsuario(editing.idUsuario, usuario);
      setEditing(null);
      setShowForm(false);
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? "Error actualizando usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      setLoading(true);
      setError(null);
      await deleteUsuario(id);
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? "Error eliminando usuario");
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<DataUsuario>[] = useMemo(
    () => [
      { header: "ID", accessor: "idUsuario" },
      { header: "Nombre", accessor: "nombre" },
      { header: "Segundo nombre", accessor: "segundoNombre" },
      { header: "Apellido", accessor: "apellido" },
      { header: "Segundo apellido", accessor: "segundoApellido" },
      { header: "Correo", accessor: "email" },
      { header: "Dirección", accessor: "direccion" },
      { header: "Documento", accessor: "numeroDocumento" },
      { header: "Tipo Documento", accessor: "tipoDocumento" },
      { header: "Fecha Nacimiento", accessor: "fechaNacimiento" },
      { header: "Número de hijos", accessor: "numeroHijos" },
      { header: "Estrato", accessor: "estrato" },
      {
        header: "Autorización datos",
        accessor: "autorizacionDatos",
        render: (u) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              u.autorizacionDatos
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {u.autorizacionDatos ? "Sí" : "No"}
          </span>
        ),
      },
      {
        header: "Habilitado",
        accessor: "habilitar",
        render: (u) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              u.habilitar
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {u.habilitar ? "Sí" : "No"}
          </span>
        ),
      },
      { header: "Género", accessor: "genero" },
      { header: "Estado civil", accessor: "estadoCivil" },
      { header: "EPS", accessor: "epsId" },
      { header: "Rol", accessor: "rolId" },
      {
        header: "Acciones",
        accessor: "idUsuario",
        render: (u) => (
          <div className="flex gap-2">
            <div
              onClick={() => {
                setEditing(u);
                setShowForm(true);
              }}
            >
              <BtnEditar verText={true} text="px-3 py-1" />
            </div>
            <div onClick={() => handleDelete(u.idUsuario!)}>
              <BtnEliminar verText={true} text="px-3 py-1" />
            </div>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          👥 Gestión de Usuarios
        </h1>
        <div
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <BtnAgregar verText={true} text="px-4 py-2" />
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-800">
          {error}
        </div>
      )}

      {showForm && (
        <UsuarioForm
          initialData={editing || undefined}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
        />
      )}

      {loading ? (
        <div className="text-gray-600">Cargando...</div>
      ) : (
        <DataTableUsuarios<DataUsuario>
          data={usuarios}
          columns={columns}
          emptyText="No hay usuarios registrados"
        />
      )}
    </div>
  );
};

export default Usuarios;
