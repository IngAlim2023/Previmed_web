import { DataUsuario } from "../interfaces/usuario";

const RAW = String(import.meta.env.VITE_URL_BACK || "");
const BASE = RAW.replace(/\/+$/, "");
const API_URL = `${BASE}/usuarios`;
const url = (path: string) => `${BASE}/${String(path).replace(/^\/+/, "")}`;

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
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
};

export const getUsuarioById = async (id: string): Promise<any> => {
  const res = await fetch(url(`/usuarios/${id}`));
  if (!res.ok) throw new Error("Error al obtener usuario por id");
  return res.json();
};

export const createUsuario = async (usuario: Partial<DataUsuario>) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSnake(usuario)),
  });
  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
};

export const updateUsuario = async (id: string, usuario: Partial<DataUsuario>) => {
  const res = await fetch(`${API_URL}/${id}`.replace(/([^:]\/)\/+/g, "$1"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSnake(usuario)),
  });
  if (!res.ok) throw new Error("Error al actualizar usuario");
  return res.json();
};

export const deleteUsuario = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`.replace(/([^:]\/)\/+/g, "$1"), { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar usuario");
};

export const getAsesores = async () => {
  const res = await fetch(`${BASE}/usuarios`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Error al obtener asesores");
  const data = await res.json();

  // 👇 Ajusta el filtro según tu estructura
  const asesores = data.filter(
    (u: any) =>
      u.rol?.nombre?.toLowerCase() === "asesor" ||
      u.rol_id === 2 ||
      u.rolId === 2
  );

  return asesores;
};
