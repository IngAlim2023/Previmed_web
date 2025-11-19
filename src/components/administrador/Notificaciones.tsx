import React, { useEffect, useState } from "react";
import {
  deleteNoficacionesAdmin,
  getNoficacionesAdminVisitas,
} from "../../services/notificaciones";
import { IoMdNotifications, IoMdClose, IoMdTrash } from "react-icons/io";
import toast from "react-hot-toast";
import socket from "../../services/socket";

const Notificaciones: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await getNoficacionesAdminVisitas();
      setNotificaciones(res.data);
    };
    loadData();
  }, [update]);

  useEffect(()=>{
    socket.on('solicitudVisita',(data)=>{
      toast.success(`el usuario ${data.nombre} solicito una visita`)
      setUpdate(!update)
    })
    return ()=>{
      socket.off('solicitudVisita')
    }
  },[])

  const handleDelete = async (id: number | number) => {
    const res = await deleteNoficacionesAdmin(id);

    if (res.message === "Exito") {
      setUpdate(!update);
      return toast.success("Notificación eliminada");
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-5 right-5 z-50
          w-14 h-14 rounded-full
          bg-cyan-600 hover:bg-cyan-700
          shadow-2xl text-white text-3xl
          flex items-center justify-center
          transition
        "
      >
        <IoMdNotifications />

        {notificaciones.length > 0 && (
          <span
            className="
              absolute -top-1 -right-1 
              bg-red-600 text-white text-xs
              px-2 py-[2px] rounded-full shadow-md
            "
          >
            {notificaciones.length}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="
            fixed inset-0 bg-black/40 backdrop-blur-sm
            flex items-center justify-center
            z-40 animate-fade
          "
          onClick={() => setOpen(false)}
        >
          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white rounded-xl shadow-2xl
              w-80 sm:w-96 max-h-[75vh]
              p-6 overflow-y-auto
              animate-scale relative
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <IoMdNotifications className="text-blue-600" />
                Notificaciones
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="
                  text-gray-600 hover:text-gray-900
                  text-2xl transition
                "
              >
                <IoMdClose />
              </button>
            </div>

            {/* Lista */}
            {notificaciones.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No hay notificaciones.
              </p>
            ) : (
              <div className="space-y-3">
                {notificaciones.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex justify-between gap-3 items-center
                      border border-gray-200 rounded-lg p-4
                      shadow-sm bg-gray-50
                      hover:bg-gray-100 transition
                    "
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {item.nombrePaciente} {item.apellidoPaciente}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                      <span
                        className={`
                          text-xs px-2 py-1 rounded-full mt-1 inline-block
                          ${
                            item.estado
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {item.estado ? "Vista" : "Sin leer"}
                      </span>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="
                        text-red-600 hover:text-red-800
                        text-xl p-2 transition
                      "
                    >
                      <IoMdTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <button
              onClick={() => setOpen(false)}
              className="
                w-full mt-5 py-2
                bg-blue-600 text-white font-semibold
                rounded-lg shadow-md
                hover:bg-blue-700 transition
              "
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notificaciones;
