import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { HookFormDocumento } from "../../../interfaces/formularios.ts";
import logo from "../../../assets/logo.png";

const FormularioDocumento: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HookFormDocumento>();

  const onSubmit: SubmitHandler<HookFormDocumento> = (data) => {
    return console.log(data);
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Previmed" className="h-22 object-contain" />
        </div>
        <div className="text-left mb-8">
          <p className="text-gray-600 font-bold">Formulario Documento</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="mb-4">
            <label
              htmlFor="nombre_documento"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Nombre del documento:
            </label>
            <input
              id="nombre_documento"
              {...register("nombre_documento", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 2,
                  message: "El Documento debe contener mínimo 2 caracteres.",
                },
                maxLength: {
                  value: 25,
                  message: "El Documento debe contener máximo 25 caracteres.",
                },
              })}
              placeholder="Ejemplo: Cédula de ciudadanía"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            {errors.nombre_documento && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombre_documento.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-lgreen to-lblue text-white py-2 rounded-md hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioDocumento;
