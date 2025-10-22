// src/components/beneficiarios/ModalCrearBeneficiario.tsx
import React from "react";
import { FaPlus } from "react-icons/fa";
import { generos } from "../../data/generos";
import { estadosCiviles } from "../../data/estadosCiviles";

interface Props {
  onCerrar: () => void;
  onGuardar: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
}

const ModalCrearBeneficiario: React.FC<Props> = ({
  onCerrar,
  onGuardar,
  formData,
  setFormData,
}) => {
  // Validaciones estrictas
  const esEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const esDocumentoValido = /^\d{6,12}$/.test(formData.numero_documento);
  const esPasswordValida = formData.password.length >= 6;
  const esFormularioValido =
    formData.nombre.trim() !== "" &&
    formData.apellido.trim() !== "" &&
    formData.email.trim() !== "" &&
    esEmailValido &&
    esDocumentoValido &&
    esPasswordValida &&
    formData.direccion.trim() !== "" &&
    formData.estrato !== "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onCerrar} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Crear beneficiario</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">Completa los campos requeridos</p>

        <form onSubmit={onGuardar} className="grid grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value.trimStart() })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Juan"
              required
            />
          </div>

          {/* Segundo nombre */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Segundo nombre</label>
            <input
              type="text"
              value={formData.segundo_nombre}
              onChange={(e) => setFormData({ ...formData, segundo_nombre: e.target.value.trimStart() })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Carlos"
            />
          </div>

          {/* Apellido */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value.trimStart() })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Pérez"
              required
            />
          </div>

          {/* Segundo apellido */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Segundo apellido</label>
            <input
              type="text"
              value={formData.segundo_apellido}
              onChange={(e) => setFormData({ ...formData, segundo_apellido: e.target.value.trimStart() })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Documento */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de documento *</label>
            <input
              type="text"
              value={formData.numero_documento}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numero_documento: e.target.value.replace(/\D/g, ""),
                })
              }
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 1032456789"
              required
            />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña * (mín. 6 caracteres)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          {/* Dirección */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value.trim() })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Calle 123 #45-67"
              required
            />
          </div>

          {/* Fecha */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Género */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
            <select
              value={formData.genero}
              onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {generos.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Estado civil */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado civil</label>
            <select
              value={formData.estado_civil}
              onChange={(e) => setFormData({ ...formData, estado_civil: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {estadosCiviles.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          {/* Número de hijos */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de hijos</label>
            <input
              type="number"
              value={formData.numero_hijos}
              onChange={(e) => setFormData({ ...formData, numero_hijos: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Estrato */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estrato *</label>
            <select
              value={formData.estrato}
              onChange={(e) => setFormData({ ...formData, estrato: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione estrato</option>
              <option value="1">Estrato 1</option>
              <option value="2">Estrato 2</option>
              <option value="3">Estrato 3</option>
              <option value="4">Estrato 4</option>
              <option value="5">Estrato 5</option>
              <option value="6">Estrato 6</option>
            </select>
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!esFormularioValido}
              className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition ${
                esFormularioValido
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-400 cursor-not-allowed"
              }`}
            >
              <FaPlus size={14} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearBeneficiario;