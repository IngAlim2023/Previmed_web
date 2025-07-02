import React from 'react';
import { useNavigate } from 'react-router-dom';

import asesor_img from '../../assets/asesor_img.png';
import { IoIosDocument } from 'react-icons/io';
import { ImLocation } from 'react-icons/im';
import { FaBookOpen, FaChartLine } from 'react-icons/fa';

const HomeAsesor: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d6ecff] via-white to-[#f0f9ff] flex justify-center items-center px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full flex items-center gap-2 md:gap-4">

        {/* Imagen del asesor */}
        <div className="w-60 md:w-72 aspect-square rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gray-100">
          <img
            src={asesor_img}
            alt="Asesor"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col justify-center items-center text-center w-full px-4 py-8">

          {/* Contenido principal sin tarjeta */}
          <div className="space-y-4 w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-[#003366] text-center">
              Asesor, Alejandro Porras!
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed text-center">
              🤝 Tu contacto de confianza para resolver dudas, trámites y afiliaciones en nuestra red de salud.
            </p>
          </div>

          {/* Experiencia */}
          <div className="flex flex-col items-center space-y-1 mt-4">
            <div className="bg-blue-100 p-3 rounded-full shadow-sm">
              <FaChartLine className="text-blue-600 w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#003366] text-center">
              2 años con nosotros
            </p>
          </div>

          {/* Opciones en línea (horizontal) */}
          <div className="flex flex-row justify-center items-center gap-12 text-[#003366] text-base font-medium mt-6">
            <OptionLink
              icon={<IoIosDocument className="w-5 h-5" />}
              label="Planes"
              onClick={() => navigate('/planes')}
            />
            <OptionLink
              icon={<ImLocation className="w-5 h-5" />}
              label="Barrios"
              onClick={() => navigate('/barrios')}
            />
            <OptionLink
              icon={<FaBookOpen className="w-5 h-5" />}
              label="Contratos"
              onClick={() => navigate('/contratos')}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

// Componente de opción horizontal usando react-icons
// Componente de opción horizontal usando react-icons
type OptionLinkProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const OptionLink: React.FC<OptionLinkProps> = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-2 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-blue-600"
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default HomeAsesor;
