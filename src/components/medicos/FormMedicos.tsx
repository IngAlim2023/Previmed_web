// src/components/medicos/FormMedicos.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { medicoService } from '../../services/medicoService';
import type { CreateMedicoData } from '../../interfaces/medicoInterface';

interface Props {
  medico?: any; // opcional para editar
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FormMedicos({ medico, onSuccess, onCancel }: Props) {
  const { register, handleSubmit, reset, setValue } = useForm<CreateMedicoData>();
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // Traer usuarios (sin crear servicio externo)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL_BACK}/usuarios`)
      .then(r => r.json())
      .then(setUsuarios)
      .catch(console.error);
  }, []);

  // Precarga si editamos
  useEffect(() => {
    if (medico) {
      setValue('usuario_id', medico.usuario_id);
      setValue('disponibilidad', medico.disponibilidad);
      setValue('estado', medico.estado);
    } else {
      reset({ disponibilidad: true, estado: true });
    }
  }, [medico, reset, setValue]);

  const onSubmit = async (data: CreateMedicoData) => {
    try {
      if (medico) {
        await medicoService.update(medico.id_medico, data);
      } else {
        await medicoService.create(data);
      }
      reset();
      onSuccess?.();
    } catch (e) {
      alert('Error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-4">
      <select
        {...register('usuario_id', { required: true })}
        className="w-full border rounded px-2 py-1"
      >
        <option value="">Seleccione un usuario</option>
        {usuarios.map(u => (
          <option key={u.idUsuario} value={u.idUsuario}>
            {u.nombre} {u.apellido}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('disponibilidad')} defaultChecked />
        Disponible
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('estado')} defaultChecked />
        Activo
      </label>

      <div className="flex gap-2">
        <button className="bg-teal-600 text-white px-4 py-2 rounded">
          {medico ? 'Actualizar' : 'Guardar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}