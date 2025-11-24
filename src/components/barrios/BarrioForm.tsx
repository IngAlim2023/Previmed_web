// src/components/barrios/BarrioForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { BarrioFormProps, DataBarrio } from "../../interfaces/Barrio";
import BtnAgregar from "../botones/BtnAgregar";
import BtnCerrar from "../botones/BtnCerrar";

const BarrioForm: React.FC<BarrioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataBarrio>({
    defaultValues: initialData || {
      nombreBarrio: "",
      latitud: null,
      longitud: null,
      habilitar: true,
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Permitir Enter solo en el botón submit, no en inputs
    if (e.key === "Enter" && e.currentTarget.tagName !== "BUTTON") {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData?.idBarrio ? "Editar barrio" : "Agregar barrio"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-4">
        {/* Nombre barrio */}
        <div>
          <label className="text-gray-700 font-semibold text-sm mb-1 block">
            Nombre del barrio *
          </label>
          <input
            {...register("nombreBarrio", {
              required: "El nombre es obligatorio",
            })}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. San José"
          />
          {errors.nombreBarrio && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nombreBarrio.message}
            </p>
          )}
        </div>

        {/* Latitud */}
        <div>
          <label className="text-gray-700 font-semibold text-sm mb-1 block">
            Latitud
          </label>
          <input
            type="number"
            step="any"
            {...register("latitud")}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="Ej. 2.4460"
          />
        </div>

        {/* Longitud */}
        <div>
          <label className="text-gray-700 font-semibold text-sm mb-1 block">
            Longitud
          </label>
          <input
            type="number"
            step="any"
            {...register("longitud")}
            className="w-full border border-gray-300 rounded-lg p-3"
            placeholder="Ej. -76.6060"
          />
        </div>

        {/* Estado (habilitar) */}
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("habilitar")} />
          <span>Habilitado</span>
        </label>

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <div onClick={onCancel}>
            <BtnCerrar text="px-4" verText />
          </div>
          <button type="submit">
            <BtnAgregar text="px-4" verText />
          </button>
        </div>
      </form>
    </div>
  );
};

export default BarrioForm;