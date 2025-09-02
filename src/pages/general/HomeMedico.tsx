import React, { useState } from 'react';

const HomeMedico: React.FC = () => {
  const [estadoDisponible, setEstadoDisponible] = useState(true);
  const handleEstadoClick = () => {
    setEstadoDisponible((prev) => !prev);
  };
  //este es un objeto temporal, luego ya toca usar la consulta con ORM
  const temporal = {
    nombre: "Dra. Ana Pérez",
    especialidad: "Cardiología",
    pacientes: 120,
    experiencia: "10 años",
    descripcion: "Recuerda que nuestros pasientes son muy importantes para nosotros, brindar una buena atención es siempre una prioridad.",
    imagenUrl: "https://randomuser.me/api/portraits/women/17.jpg"
  };


  return (
    <div className="flex min-h-screen">
      

      {/* Contenido principal */}
      <div className="flex-1 p-6 flex justify-center items-center bg-gray-300">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row items-center p-6 md:p-10">
          {/* Imagen */}
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
            <img
              src={temporal.imagenUrl}
              alt={`Dr. ${temporal.nombre}`}
              className="rounded-lg object-cover h-60 w-60"
            />
          </div>

          {/* Información */}
          <div className="md:w-2/3 md:pl-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{temporal.nombre}</h2>
            <p className="text-gray-500 text-sm mt-1">{temporal.especialidad}</p>

            {/* Estado */}
            <div className="flex items-center justify-center md:justify-start mt-2">
              <span
                className={`h-3 w-3 rounded-full mr-2 ${estadoDisponible ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <span
                className={`font-semibold ${estadoDisponible ? 'text-green-600' : 'text-red-600'}`}
              >
                {estadoDisponible ? 'Disponible' : 'No disponible'}
              </span>
            </div>

            {/* Pacientes y experiencia */}
            <div className="flex justify-between md:justify-start gap-10 mt-4 text-center">
              <div>
                <p className="text-xl font-semibold">{temporal.pacientes}</p>
                <p className="text-sm text-gray-500">Pacientes</p>
              </div>
              <div>
                <p className="text-xl font-semibold">{temporal.experiencia}</p>
                <p className="text-sm text-gray-500">Experiencia</p>
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-700 mb-1">Acerca de:</h3>
              <p className="text-sm text-gray-600">{temporal.descripcion}</p>
            </div>

            {/* Botón con estado */}
            <div className="mt-6">
              <button
                className={`text-white font-bold py-2 px-6 rounded-full shadow-md transition ${
                  estadoDisponible
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
                onClick={handleEstadoClick}
              >
                ESTADO: {estadoDisponible ? 'DISPONIBLE' : 'NO DISPONIBLE'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMedico;
