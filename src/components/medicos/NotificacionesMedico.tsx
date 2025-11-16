import React, { useEffect, useState } from "react";
import {
  getNoficacionesMedicos,
  putNoficacionVista,
} from "../../services/notificaciones";

interface Props {
  id: number | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NotificacionesMedico: React.FC<Props> = ({ id, open, setOpen }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Actualizar la información
  const [reLoad, setReLoad] = useState<boolean>(false);

  useEffect(() => {
    if (!id || !open) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getNoficacionesMedicos(id);
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) setError("Error al cargar notificaciones");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id, open, reLoad]);

  if (!open) return null;

  const updateNotificacion = async (id: number | null) => {
    if (!id) return;
    await putNoficacionVista(id);
    return setReLoad(!reLoad);
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-end items-start p-4 z-50"
      onClick={() => setOpen(false)}
    >
      {/* Modal */}
      <div
        className="w-80 max-h-[500px] bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
          <h3 className="font-semibold text-lg">Notificaciones ({data.length})</h3>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="px-4 py-3 max-h-[430px] overflow-y-auto">
          {!id && <p>No se seleccionó ningún médico.</p>}
          {loading && <p>Cargando notificaciones...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {data.length === 0 && !loading && <p>No hay notificaciones.</p>}

          {data.map((val) => (
            <div
              key={val.id}
              className="py-3 border-b border-gray-200 last:border-none"
            >
              <p>
                <span className="font-semibold">
                  {val.nombrePaciente} {val.apellidoPaciente}
                </span>{" "}
                solicitó una visita.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(val.created_at).toLocaleString()}
              </p>
              <div className="flex justify-center items-center">
              <button
                onClick={() => updateNotificacion(val.id)}
                className="
                            ml-4 px-3 py-1 rounded-md text-sm font-medium
                            bg-blue-500 text-white hover:bg-blue-600
                            active:bg-blue-700 transition-colors duration-150
                            shadow-sm
                          "
              >
                Cerrar
              </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificacionesMedico;
