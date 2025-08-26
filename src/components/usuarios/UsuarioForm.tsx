import React, { useEffect, useState } from "react";
import {DataUsuario} from "../../interfaces/Usuario";
import BtnAgregar from "../botones/BtnAgregar";
import BtnCancelar from "../botones/BtnCancelar";
import { UsuarioFormProps } from "../../interfaces/Usuario";

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<DataUsuario>>(
    initialData || {
      nombre: "",
      segundoNombre: "",
      apellido: "",
      segundoApellido: "",
      email: "",
      password: "",
      direccion: "",
      numeroDocumento: "",
      fechaNacimiento: "",
      numeroHijos: "",
      estrato: "",
      autorizacionDatos: false,
      habilitar: true,
      genero: "Otro",
      estadoCivil: "Soltero",
      tipoDocumento: "Cédula de Ciudadanía",
      epsId: null,
      rolId: 0,
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <form
      className="grid grid-cols-2 gap-4 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      {/* Nombre */}
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre || ""}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      {/* Segundo Nombre */}
      <input
        type="text"
        name="segundoNombre"
        placeholder="Segundo Nombre"
        value={formData.segundoNombre || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Apellido */}
      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={formData.apellido || ""}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      {/* Segundo Apellido */}
      <input
        type="text"
        name="segundoApellido"
        placeholder="Segundo Apellido"
        value={formData.segundoApellido || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email || ""}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      {/* Password */}
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password || ""}
        onChange={handleChange}
        className="border p-2 rounded"
        required={!initialData} // requerido solo al crear
      />

      {/* Dirección */}
      <input
        type="text"
        name="direccion"
        placeholder="Dirección"
        value={formData.direccion || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Número Documento */}
      <input
        type="text"
        name="numeroDocumento"
        placeholder="Número de documento"
        value={formData.numeroDocumento || ""}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      {/* Tipo Documento */}
      <select
        name="tipoDocumento"
        value={formData.tipoDocumento || "Cédula de Ciudadanía"}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option>Registro Civil</option>
        <option>Tarjeta de Identidad</option>
        <option>Cédula de Ciudadanía</option>
        <option>Tarjeta de Extranjería</option>
        <option>Cédula de Extranjería</option>
        <option>Pasaporte</option>
        <option>Documento de Identificación Extranjero (DIE)</option>
        <option>Permiso Especial de Permanencia (PEP)</option>
      </select>

      {/* Fecha Nacimiento */}
      <input
        type="date"
        name="fechaNacimiento"
        value={formData.fechaNacimiento || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Número Hijos */}
      <input
        type="number"
        name="numeroHijos"
        placeholder="Número de hijos"
        value={formData.numeroHijos || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Estrato */}
      <input
        type="number"
        name="estrato"
        placeholder="Estrato"
        value={formData.estrato || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Género */}
      <select
        name="genero"
        value={formData.genero || "Otro"}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option>Masculino</option>
        <option>Femenino</option>
        <option>Otro</option>
      </select>

      {/* Estado Civil */}
      <select
        name="estadoCivil"
        value={formData.estadoCivil || "Soltero"}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option>Soltero</option>
        <option>Casado</option>
        <option>Viudo</option>
        <option>Divorciado</option>
        <option>Unión marital</option>
      </select>

      {/* EPS */}
      <input
        type="number"
        name="epsId"
        placeholder="EPS Id"
        value={formData.epsId ?? ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Rol */}
      <input
        type="number"
        name="rolId"
        placeholder="Rol Id"
        value={formData.rolId || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Autorización Datos */}
      <label className="flex items-center gap-2 col-span-2">
        <input
          type="checkbox"
          name="autorizacionDatos"
          checked={formData.autorizacionDatos || false}
          onChange={handleChange}
        />
        Autorizo el uso de mis datos
      </label>

      {/* Habilitar */}
      <label className="flex items-center gap-2 col-span-2">
        <input
          type="checkbox"
          name="habilitar"
          checked={formData.habilitar || false}
          onChange={handleChange}
        />
        Usuario habilitado
      </label>

      {/* Botones */}
      <div className="flex justify-end gap-2 col-span-2 mt-4">
        <BtnAgregar verText={true} text="Guardar" />
        <div onClick={onCancel}>
          <BtnCancelar verText={true} text="Cancelar" />
        </div>
      </div>
    </form>
  );
};

export default UsuarioForm;
