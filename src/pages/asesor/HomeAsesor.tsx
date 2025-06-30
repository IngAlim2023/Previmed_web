import React from 'react';
import asesor_img from '../../assets/asesor_img.png';
import { IoIosDocument } from "react-icons/io";
import { ImLocation } from "react-icons/im";
import { FaBookOpen, FaChartLine } from "react-icons/fa";

const HomeAsesor: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
      {/* Header estilo Previmed con solo Planes, Barrios, Contratos */}
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4 bg-white rounded-b-2xl shadow-md">
        <div className="text-xl font-bold text-gray-700">Previmed</div>
        <div className="flex gap-6 text-gray-600">
          <button className="hover:text-blue-600 transition flex items-center gap-1">
            <IoIosDocument className="w-5 h-5" />
            Planes
          </button>
          <button className="hover:text-blue-600 transition flex items-center gap-1">
            <ImLocation className="w-5 h-5" />
            Barrios
          </button>
          <button className="hover:text-blue-600 transition flex items-center gap-1">
            <FaBookOpen className="w-5 h-5" />
            Contratos
          </button>
        </div>
      </div>

      {/* Main contenido, estilo hero */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12">
        
        {/* Texto a la izquierda */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Asesor <span className="text-blue-600">Alejandro Porras</span>
          </h1>
          <p className="text-gray-600 max-w-md">
            Tu contacto de confianza para resolver dudas, trámites y afiliaciones en nuestra red de salud.
          </p>
          
          <div className="flex items-center gap-2 mt-4">
            <FaChartLine className="text-blue-600 w-6 h-6" />
            <span className="text-gray-800 font-medium">2 años con nosotros</span>
          </div>
        </div>

        {}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <div className="w-[300px] h-[400px] bg-white-100 rounded-lg  flex items-center justify-center">
            <img src={asesor_img} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeAsesor;
