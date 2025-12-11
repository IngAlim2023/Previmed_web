import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import PagosAsignados from '../../components/pagos/PagosAsignados';

const asesor_img = 'https://res.cloudinary.com/dudqqzt1k/image/upload/v1761411224/asesor_img_nls11f.png';
const HomeAsesor: React.FC = () => {
  const {user} = useAuthContext()

  return (
    <div className="min-h-screen bg-blue-50 grid justify-center px-4 py-12 gap-6">
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
              Asesor, {user.nombre??'---.---'}!
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed text-center">
              🤝 Tu contacto de confianza para resolver dudas, trámites y afiliaciones en nuestra red de salud.
            </p>
          </div>
        </div>
      </div>

      <PagosAsignados/>
    </div>

  );
};

export default HomeAsesor;
