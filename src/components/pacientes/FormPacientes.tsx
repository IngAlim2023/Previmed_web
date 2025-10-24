import React from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const FormPacientes: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm();

  const handleForm = (data: any) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[95%] max-w-2xl shadow-lg relative">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">Registrar Paciente</h3>
        <form onSubmit={handleSubmit(handleForm)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input {...register('nombre')} placeholder="Nombre" className="input" />
          <input {...register('segundo_nombre')} placeholder="Segundo nombre" className="input" />
          <input {...register('apellido')} placeholder="Apellido" className="input" />
          <input {...register('segundo_apellido')} placeholder="Segundo apellido" className="input" />
          <input {...register('email')} placeholder="Email" type="email" className="input" />
          <input {...register('telefono')} placeholder="Teléfono" className="input" />
          <input {...register('direccion')} placeholder="Dirección" className="input" />
          <input {...register('numero_documento')} placeholder="Número de documento" className="input" />
          <input {...register('fecha_nacimiento')} placeholder="Fecha de nacimiento" type="date" className="input" />
          <input {...register('numero_hijos')} placeholder="Número de hijos" type="number" className="input" />
          <input {...register('password')} placeholder="Contraseña" type="password" className="input" />
          <input {...register('estrato')} placeholder="Estrato" type="number" className="input" />

          <div className="flex items-center gap-2 col-span-2">
            <input type="checkbox" {...register('autorizacion_datos')} />
            <label className="text-sm">Autorización de tratamiento de datos</label>
          </div>

          <div className="flex items-center gap-2 col-span-2">
            <input type="checkbox" {...register('esTitular')} />
            <label className="text-sm">¿Es titular?</label>
          </div>

          <div className="flex justify-end gap-2 col-span-2 pt-2">
            <button type="button" onClick={onClose} className="text-sm px-4 py-2 bg-gray-200 rounded-md">
              Cancelar
            </button>
            <button type="submit" className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPacientes;