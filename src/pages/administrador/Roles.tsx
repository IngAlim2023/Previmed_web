import React, { useEffect, useState } from 'react';
import { Rol } from '../../interfaces/roles';

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [nombreRol, setNombreRol] = useState('');
  const [estadoRol, setEstadoRol] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string>('');

  const baseUrl = 'http://localhost:3333/roles';

  // Listar roles
  const listarRoles = async () => {
  try {
    const respuesta = await fetch(baseUrl)
    const data = await respuesta.json()
    setRoles(data.data)
  } catch (error) {
    console.error(error)
  }
}

  useEffect(() => {
    listarRoles();
  }, []);

  // Crear o actualizar rol
  const guardarRol = async () => {
    if (!nombreRol.trim()) {
      setMensaje('El nombre del rol no puede estar vacío');
      return;
    }

    try {
      const metodo = editId === null ? 'POST' : 'PUT';
      const url = editId === null ? baseUrl : `${baseUrl}/${editId}`;

      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        // Enviar en snake_case
        body: JSON.stringify({ nombre_rol: nombreRol, estado: estadoRol }),
      });

      if (!respuesta.ok) throw new Error('Error al guardar rol');

      setNombreRol('');
      setEstadoRol(true);
      setMensaje(editId === null ? 'Rol creado con éxito' : 'Rol actualizado con éxito');

      await listarRoles();

      setEditId(null);
    } catch (error) {
      console.error(error);
      setMensaje('Error al guardar rol');
    }
  };

  // Eliminar rol
  const eliminarRol = async (id: number) => {
    try {
      await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
      setRoles((prevRoles) => prevRoles.filter((r) => r.id_rol !== id));
      setMensaje('Rol eliminado con éxito');
    } catch (error) {
      console.error(error);
      setMensaje('Error al eliminar rol');
    }
  };

  // Preparar rol para editar
  const editarRol = (rol: Rol) => {
    setEditId(rol.id_rol);
    setNombreRol(rol.nombre_rol);
    setEstadoRol(rol.estado);
  };

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Gestión de Roles</h2>

      {mensaje && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded">
          {mensaje}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          guardarRol();
        }}
        className="bg-white p-6 rounded shadow mb-8 flex flex-col md:flex-row md:items-end gap-4"
      >
        <input
          type="text"
          placeholder="Nombre del rol"
          value={nombreRol}
          onChange={(e) => setNombreRol(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />

        <select
          value={estadoRol ? 'true' : 'false'}
          onChange={(e) => setEstadoRol(e.target.value === 'true')}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {editId === null ? 'Agregar' : 'Guardar'}
          </button>

          {editId !== null && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setNombreRol('');
                setEstadoRol(true);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((rol) => (
              <tr key={rol.id_rol} className="hover:bg-gray-50">
                <td className="px-6 py-4">{rol.id_rol}</td>
                <td className="px-6 py-4">{rol.nombre_rol}</td>
                <td className="px-6 py-4">{rol.estado ? 'Activo' : 'Inactivo'}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => editarRol(rol)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarRol(rol.id_rol)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;
