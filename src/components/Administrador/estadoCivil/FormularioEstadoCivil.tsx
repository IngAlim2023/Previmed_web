import React from 'react';
import logo from '../../../assets/logo.png';
import { useForm, SubmitHandler } from 'react-hook-form';
import { HookFormEstadoCivil } from '../../../interfaces/estadoCivil.ts';

const FormularioEstadoCivil:React.FC = () => {
    const {register, handleSubmit, formState:{errors}} = useForm<HookFormEstadoCivil>()
    const onsubmit:SubmitHandler<HookFormEstadoCivil> = async (data) =>{
        console.log(data)
    }
  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Previmed" className="h-22 object-contain" />
        </div>
        <div className="text-left mb-8">
          <p className="text-gray-600 font-bold">Formulario estado civil</p>
        </div>
        <form
        onSubmit={handleSubmit(onsubmit)}
        className='space-y-4'
        >
            <div className="mb-4">
            <label
              htmlFor="nombre_eps"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Nombre del estado civil:
            </label>
            <input
              id="nombre_eps"
              {...register("estado_civil", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 2,
                  message: "El nombre del estado civil debe contener mínimo 2 caracteres.",
                },
                maxLength: {
                  value: 25,
                  message: "El nombre del estado civil debe contener máximo 25 caracteres.",
                },
              })}
              placeholder="Ejemplo: Casado"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            {errors.estado_civil && (
              <p className="text-red-500 text-xs mt-1">
                {errors.estado_civil.message}
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
  )
}

export default FormularioEstadoCivil