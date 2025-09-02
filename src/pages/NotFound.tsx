import React from "react";
import svg from "../assets/404.svg";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 w-full">
      <img src={svg} alt="404 Not Found" className="w-80 mb-6" />
      <h2 className="text-2xl font-extrabold text-blue-600 mb-4">
        404 - Página no encontrada
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        La página que buscas no existe. Pero no te preocupes, ¡estamos aquí para
        ayudarte!
      </p>
      <Link
        to="/"
        className="text-lg text-blue-500 hover:text-blue-700 font-semibold"
      >
        Regresar a la página de inicio
      </Link>
    </div>
  );
};

export default NotFound;
