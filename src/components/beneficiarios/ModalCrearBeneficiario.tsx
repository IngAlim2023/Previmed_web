// src/components/beneficiarios/ModalCrearBeneficiario.tsx
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import BtnCancelar from "../botones/BtnCancelar";
import BtnAgregar from "../botones/BtnAgregar";
import BtnCerrar from "../botones/BtnCerrar";
import { generos } from "../../data/generos";
import { estadosCiviles } from "../../data/estadosCiviles";
import { tiposDocumento } from "../../data/tiposDocumento";
import { epsService } from "../../services/epsService";
import type { Eps } from "../../interfaces/eps";

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
  const hoy = new Date().toISOString().split("T")[0];

  const [eps, setEps] = useState<Eps[]>([]);
  useEffect(() => {
    let active = true;
    epsService
      .getAll()
      .then((data) => {
        if (!active) return;
        setEps((data || []).filter((x: Eps) => x.estado));
      })
      .catch(() => {
        setEps([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setFormData({
      nombre: "",
      segundo_nombre: "",
      apellido: "",
      segundo_apellido: "",
      numero_documento: "",
      tipo_documento: "",
      email: "",
      password: "",
      direccion: "",
      fecha_nacimiento: "",
      genero: formData?.genero === undefined ? "" : "",
      estado_civil: formData?.estado_civil === undefined ? "" : "",
      numero_hijos: "",
      estrato: "",
      epsId: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showErrors, setShowErrors] = useState(false);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50/90 via-sky-50/90 to-indigo-100/90 backdrop-blur-[1px] flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative overflow-y-auto max-h-[90vh]">
        <div className="absolute top-3 right-3" onClick={onCerrar}>
          <BtnCerrar verText={false} text="p-2" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Crear beneficiario</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">Completa los campos requeridos</p>

        <form
          onSubmit={(e) => {
            if (!esFormularioValido) {
              e.preventDefault();
              setShowErrors(true);
              const faltantes: string[] = [];
              if (formData.nombre.trim() === "") faltantes.push("Nombre");
              if (formData.apellido.trim() === "") faltantes.push("Apellido");
              if (formData.email.trim() === "" || !esEmailValido) faltantes.push("Email válido");
              if (!esDocumentoValido) faltantes.push("Documento válido");
              if (!esPasswordValida) faltantes.push("Contraseña (mín. 6)");
              if (formData.direccion.trim() === "") faltantes.push("Dirección");
              if (formData.estrato === "") faltantes.push("Estrato");
              const msg = faltantes.length
                ? `Completa los campos: ${faltantes.join(", ")}`
                : "Completa los campos obligatorios";
              toast.error(msg);
              return;
            }
            onGuardar(e);
          }}
          autoComplete="off"
          className="grid grid-cols-2 gap-5"
        >
          {/* Autofill blockers */}
          <input type="text" name="fake-username" autoComplete="username" className="hidden absolute opacity-0 pointer-events-none" tabIndex={-1} aria-hidden="true" />
          <input type="password" name="fake-password" autoComplete="new-password" className="hidden absolute opacity-0 pointer-events-none" tabIndex={-1} aria-hidden="true" />
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
            {showErrors && formData.nombre.trim() === "" && (
              <p className="text-red-500 text-xs mt-1">Nombre es obligatorio</p>
            )}
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
            {showErrors && formData.apellido.trim() === "" && (
              <p className="text-red-500 text-xs mt-1">Apellido es obligatorio</p>
            )}
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

          {/* Tipo de documento */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
            <select
              value={formData.tipo_documento}
              onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Seleccionar --</option>
              {tiposDocumento.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
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
            {showErrors && !esDocumentoValido && (
              <p className="text-red-500 text-xs mt-1">Número de documento inválido</p>
            )}
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
              autoComplete="new-email"
              name="beneficiario-new-email"
              spellCheck={false}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
              required
            />
            {showErrors && !esEmailValido && (
              <p className="text-red-500 text-xs mt-1">Email inválido</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña * (mín. 6 caracteres)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              autoComplete="new-password"
              name="beneficiario-new-password"
              spellCheck={false}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
              required
            />
            {showErrors && !esPasswordValida && (
              <p className="text-red-500 text-xs mt-1">Contraseña mínima de 6 caracteres</p>
            )}
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
            {showErrors && formData.direccion.trim() === "" && (
              <p className="text-red-500 text-xs mt-1">Dirección es obligatoria</p>
            )}
          </div>

          {/* Fecha */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => {
                const v = e.target.value;
                const val = v && v > hoy ? hoy : v;
                setFormData({ ...formData, fecha_nacimiento: val });
              }}
              max={hoy}
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

          {/* EPS */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">EPS</label>
            <select
              value={formData.epsId || ""}
              onChange={(e) => setFormData({ ...formData, epsId: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Seleccionar EPS --</option>
              {eps.length > 0 ? (
                eps.map((e) => (
                  <option key={e.idEps} value={e.idEps}>
                    {e.nombreEps}
                  </option>
                ))
              ) : (
                <option disabled>Cargando EPS...</option>
              )}
            </select>
          </div>

          {/* Número de hijos */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de hijos</label>
            <input
              type="number"
              value={formData.numero_hijos}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") {
                  setFormData({ ...formData, numero_hijos: "" });
                  return;
                }
                const n = Math.max(0, Math.floor(Number(v)));
                setFormData({ ...formData, numero_hijos: String(n) });
              }}
              min={0}
              step={1}
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
            <div onClick={onCerrar}>
              <BtnCancelar verText text="" />
            </div>
            <div>
              <BtnAgregar
                verText
                text=""
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearBeneficiario;