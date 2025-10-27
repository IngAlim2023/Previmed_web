import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { DataUsuario } from "../../interfaces/usuario";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
} from "../../services/usuarios";
import UsuarioForm from "../../components/usuarios/UsuarioForm";

import BtnAgregar from "../../components/botones/BtnAgregar";
import BtnLeer from "../../components/botones/BtnLeer";
import BtnEditar from "../../components/botones/BtnEditar";
import toast from "react-hot-toast";
import BtnEstado from "../../components/botones/BtnEstado";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<DataUsuario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DataUsuario | null>(null);
  const [viewing, setViewing] = useState<DataUsuario | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {}
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleSubmit = async (usuario: Partial<DataUsuario>) => {
    try {
      if (editing) {
        await updateUsuario(editing.idUsuario!, usuario);
      } else {
        await createUsuario(usuario);
      }
      setShowForm(false);
      setEditing(null);
      await loadUsuarios();
    } catch (error) {}
  };

  const toggleEstado = async (id: string, actual: boolean) => {
    try {
      await updateUsuario(id, { habilitar: !actual });
      toast.success(actual ? "Usuario deshabilitado" : "Usuario habilitado");

      setUsuarios((prev) =>
        prev.map((u) => (u.idUsuario === id ? { ...u, habilitar: !actual } : u))
      );
    } catch (error) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  // ✅ Columnas (se añade botón Teléfonos como DIV onClick)
  const columns: TableColumn<DataUsuario>[] = useMemo(
    () => [
      {
        name: "Nombre",
        selector: (row) => `${row.nombre ?? ""} ${row.apellido ?? ""}`,
        sortable: true,
      },
      {
        name: "Documento",
        selector: (row) => row.numeroDocumento || "-",
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row.email || "-",
        sortable: true,
      },
      {
        name: "Rol",
        selector: (row) => row.rol?.nombreRol ?? "-",
        sortable: true,
      },

      {
        name: "Estado",
        selector: (row) => (row.habilitar ? "SI" : "NO"), // ✅ texto simple
        sortable: true,
        cell: (row) => (
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                row.habilitar ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span>{row.habilitar ? "SI" : "NO"}</span>
          </div>
        ), // ✅ JSX aquí sí está permitido
      },
      {
        name: "Acciones",
        // damos espacio para que no se oculte el botón
        minWidth: "260px",
        cell: (row) => (
          <div className="flex gap-2 justify-center items-center">
            <div onClick={() => setViewing(row)}>
              <BtnLeer />
            </div>
            <div
              onClick={() => {
                setEditing(row);
                setShowForm(true);
              }}
            >
              <BtnEditar />
            </div>
            <BtnEstado
              habilitado={row.habilitar}
              onClick={() => toggleEstado(row.idUsuario!, row.habilitar)}
            />

            {/* Telefonos */}
            <div
              onClick={() => {
                if (!row.idUsuario) return;
                navigate(`/usuarios/${row.idUsuario}/telefonos`, {
                  state: { nombre: `${row.nombre} ${row.apellido}` },
                });
              }}
              className="cursor-pointer select-none px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 active:scale-[0.98] transition"
              title="Gestionar teléfonos del usuario"
            >
              📞 Teléfonos
            </div>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [navigate]
  );

  const filteredData = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return usuarios.filter((u) => {
      const nombreCompleto = `${u.nombre ?? ""} ${u.segundoNombre ?? ""} ${
        u.apellido ?? ""
      } ${u.segundoApellido ?? ""}`.toLowerCase();
      const documento = (u.numeroDocumento ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      return (
        nombreCompleto.includes(searchTerm) ||
        documento.includes(searchTerm) ||
        email.includes(searchTerm)
      );
    });
  }, [usuarios, search]);

  return (
    <div className="p-6 bg-blue-50">
      {/* Header con botón y buscador */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestión de Usuarios
        </h1>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre, documento o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          />
          <div
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
          >
            <BtnAgregar />
          </div>
        </div>
      </div>

      {/* Contenedor con scroll horizontal para la tabla */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 shadow-lg bg-white">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          noDataComponent="No hay usuarios registrados"
        />
      </div>

      {/* Modal con Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl p-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ✍️ {editing ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <UsuarioForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
              initialData={editing ?? undefined}
              isEditing={!!editing}
            />
          </div>
        </div>
      )}

      {/* Modal de Ver Usuario */}
      {viewing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl p-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              👤 Detalles del Usuario
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>Nombre:</strong> {viewing.nombre}{" "}
                {viewing.segundoNombre}
              </p>
              <p>
                <strong>Apellidos:</strong> {viewing.apellido}{" "}
                {viewing.segundoApellido}
              </p>
              <p>
                <strong>Documento:</strong> {viewing.tipoDocumento}{" "}
                {viewing.numeroDocumento}
              </p>
              <p>
                <strong>Email:</strong> {viewing.email}
              </p>
              <p>
                <strong>Dirección:</strong> {viewing.direccion}
              </p>
              <p>
                <strong>Fecha Nacimiento:</strong> {viewing.fechaNacimiento}
              </p>
              <p>
                <strong>Estado Civil:</strong> {viewing.estadoCivil}
              </p>
              <p>
                <strong>Número Hijos:</strong> {viewing.numeroHijos}
              </p>
              <p>
                <strong>Estrato:</strong> {viewing.estrato}
              </p>
              <p>
                <strong>Género:</strong> {viewing.genero}
              </p>
              <p>
                <strong>EPS:</strong> {viewing.eps.nombreEps}
              </p>
              <p>
                <strong>Rol:</strong> {viewing.rol.nombreRol}
              </p>
              <p>
                <strong>Autorización Datos:</strong>{" "}
                {viewing.autorizacionDatos ? (
                  <p className="text-green-500 font-semibold">SI</p>
                ) : (
                  <p className="text-red-500 font-semibold">NO</p>
                )}
              </p>
              <p>
                <strong>Habilitado:</strong>{" "}
                {viewing.habilitar ? (
                  <p className="text-green-500 font-semibold">SI</p>
                ) : (
                  <p className="text-red-500 font-semibold">NO</p>
                )}
              </p>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setViewing(null)}
                className="bg-gradient-to-r from-blue-500 to-blue-700 
                           text-white px-6 py-2.5 rounded-lg 
                           shadow-md hover:from-blue-600 hover:to-blue-800 
                           transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
