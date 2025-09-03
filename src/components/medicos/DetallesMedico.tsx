import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { medicoService } from '../../services/medicoService';
import type { MedicoResponse } from '../../interfaces/medicoInterface';

export default function DetallesMedico() {
  const { id } = useParams<{ id: string }>();
  const [medico, setMedico] = useState<MedicoResponse | null>(null);

  useEffect(() => {
    if (!id) return;
    medicoService
      .getById(Number(id))
      .then(setMedico)
      .catch(() => setMedico(null));
  }, [id]);

  if (!medico) return <p className="text-center">Médico no encontrado.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        {medico.usuario.nombre} {medico.usuario.apellido}
      </h1>
      <p>Email: {medico.usuario.email}</p>
      <p>Documento: {medico.usuario.numero_documento}</p>
      <p>
        Estado:
        <span className={medico.estado ? 'text-green-600' : 'text-red-600'}>
          {medico.estado ? ' Activo' : ' Inactivo'}
        </span>
      </p>
      <p>
        Disponible:
        <span className={medico.disponibilidad ? 'text-green-600' : 'text-red-600'}>
          {medico.disponibilidad ? ' Sí' : ' No'}
        </span>
      </p>
    </div>
  );
}