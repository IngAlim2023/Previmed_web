import { DataUsuario } from "../interfaces/Usuario";

const API_URL = "http://localhost:3333/usuarios";

const toSnake = (u: Partial<DataUsuario>) => ({
  nombre: u.nombre,
  segundo_nombre: u.segundoNombre,
  apellido: u.apellido,
  segundo_apellido: u.segundoApellido,
  email: u.email,
  password: u.password,
  direccion: u.direccion,
  numero_documento: u.numeroDocumento,
  fecha_nacimiento: u.fechaNacimiento,
  numero_hijos: u.numeroHijos,
  estrato: u.estrato,
  autorizacion_datos: u.autorizacionDatos,
  habilitar: u.habilitar,
  genero: u.genero,
  estado_civil: u.estadoCivil,
  tipo_documento: u.tipoDocumento,
  eps_id: u.epsId,
  rol_id: u.rolId,
});

export const getUsuarios = async (): Promise<DataUsuario[]> => {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
};

export const getUsuario = async (id: string): Promise<DataUsuario> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener usuario");
  return await res.json();
};

export const createUsuario = async (
  usuario: Partial<DataUsuario>
): Promise<DataUsuario> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSnake(usuario)),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error al crear usuario: ${t}`);
  }
  return await res.json();
};

export const updateUsuario = async (
  id: string,
  usuario: Partial<DataUsuario>
): Promise<DataUsuario> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSnake(usuario)),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error al actualizar usuario: ${t}`);
  }
  return await res.json();
};

export const deleteUsuario = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error al eliminar usuario: ${t}`);
  }
};
