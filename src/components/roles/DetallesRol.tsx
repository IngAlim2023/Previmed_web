import { Rol } from "../../interfaces/roles";
import BtnCerrar from "../botones/BtnCerrar";

type Props = {
  rol: Rol | null;
  setDetalles: (value: boolean) => void;
};

const DetallesRol: React.FC<Props> = ({ rol, setDetalles }) => {
  if (!rol) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gray-100 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📋 <span>Detalles del Rol</span>
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-500">ID:</span>
            <span className="text-gray-900 font-semibold">{rol.id_rol}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-500">Nombre:</span>
            <span className="text-gray-900 font-semibold">
              {rol.nombre_rol}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-500">Estado:</span>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                rol.estado
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {rol.estado ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-100 border-t flex justify-end">
          <div
            onClick={() => setDetalles(false)}
            className="hover:scale-105 transition"
          >
            <BtnCerrar verText={true} text="Cerrar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesRol;
