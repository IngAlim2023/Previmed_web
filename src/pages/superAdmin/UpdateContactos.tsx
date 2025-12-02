import React from "react";
import { useForm } from "react-hook-form";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaXmark,
  FaFloppyDisk,
} from "react-icons/fa6";
import { updateContactoInfo } from "../../services/contactos";

interface Props {
  evento: boolean;
  setEvento: (evento: boolean) => void;
  setOpen: (open: boolean) => void;
}

const UpdateContactos: React.FC<Props> = ({ evento, setEvento, setOpen }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    
    await updateContactoInfo(data);

      setEvento(!evento);
      setOpen(false);

    
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all animate-slideUp">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold">Actualizar Contacto</h2>
              <p className="text-blue-100 text-sm mt-1">
                Modifica la información de contacto
              </p>
            </div>
            <button
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-200 hover:rotate-90"
              type="button"
            >
              <FaXmark className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-5">
            {/* Ubicación */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaLocationDot className="text-blue-600" />
                Ubicación
              </label>
              <input
                type="text"
                {...register("ubicacion")}
                placeholder="Ej: Cali, Valle del Cauca"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* Teléfonos */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FaPhone className="text-blue-600" />
                  Teléfono Principal
                </label>
                <input
                  type="text"
                  {...register("telefonouno")}
                  placeholder="+57 123 456 7890"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FaPhone className="text-blue-600" />
                  Teléfono Secundario
                </label>
                <input
                  type="text"
                  {...register("telefonodos")}
                  placeholder="+57 098 765 4321"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Emails */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FaEnvelope className="text-indigo-600" />
                  Email Principal
                </label>
                <input
                  type="email"
                  {...register("emailuno")}
                  placeholder="contacto@empresa.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FaEnvelope className="text-indigo-600" />
                  Email Secundario
                </label>
                <input
                  type="email"
                  {...register("emaildos")}
                  placeholder="ventas@empresa.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <FaFloppyDisk />
                Actualizar
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UpdateContactos;
