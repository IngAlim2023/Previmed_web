import React from 'react';
import { FaUserFriends, FaClock } from 'react-icons/fa'

const HomePacientes:React.FC = ()=>{
const hora = new Date().getHours()

  const saludo =
    hora >= 5 && hora < 12
      ? 'Buenos días'
      : hora >= 12 && hora < 18
      ? 'Buenas tardes'
      : 'Buenas noches'

  const nombre = 'Edinson'

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        {/* Reloj */}
        <div className="flex justify-end items-center text-sm text-gray-500 mb-4">
          <FaClock className="mr-2" />
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Saludo */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          ¡{saludo}, {nombre}!
        </h2>
        <p className="text-green-600 font-medium mb-6 flex items-center">
          Te encuentras activo
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full ml-2 animate-pulse" />
        </p>

        {/* Visitas asignadas */}
        <div className="bg-white border rounded-xl p-4 mb-4 shadow-sm">
          <p className="font-semibold text-gray-700 mb-1">Visitas asignadas:</p>
          <p className="text-gray-500 text-sm">No tienes visitas asignadas</p>
        </div>

        {/* Plan */}
        <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm">
          <p className="font-semibold text-gray-700 mb-1">Plan:</p>
          <p className="text-gray-500 text-sm">
            Tu plan es <span className="text-teal-600 font-semibold">Premium</span>
          </p>
        </div>

        {/* Botón */}
        <button className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium shadow hover:bg-teal-600 transition-all duration-300 flex items-center justify-center gap-2">
          <FaUserFriends />
          MIS BENEFICIARIOS
        </button>

        <p className="text-center mt-6 text-sm text-gray-500 italic">
          ¿En qué podemos ayudarte hoy? 😊
        </p>
      </div>
    </div>
  )
}

export default HomePacientes;