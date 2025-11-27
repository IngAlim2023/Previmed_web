import React from "react";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";

interface Props {
  habilitado: boolean;
  onClick: () => void;
}

const BtnEstado: React.FC<Props> = ({ habilitado, onClick }) => {
  const baseStyles = `
    p-2 m-1 border-1 rounded-md
    relative overflow-hidden
    font-bold
    transition-all duration-700 ease-in-out
    hover:text-white
    bg-no-repeat bg-[length:0%_0%] bg-right-top
    hover:bg-[length:200%_200%]
    hover:cursor-pointer
    hover:shadow-none
  `;

  const habilitadoStyles = `
    text-green-600 border-green-600
    hover:bg-gradient-to-r hover:from-green-600 hover:to-green-600
  `;

  const deshabilitadoStyles = `
    text-red-600 border-red-600
    hover:bg-gradient-to-r hover:from-red-600 hover:to-red-600
  `;

  return (
    <button
      onClick={onClick}
      title={habilitado ? "Deshabilitar" : "Habilitar"}
      className={`${baseStyles} ${habilitado ? habilitadoStyles : deshabilitadoStyles}`}
    >
      {habilitado ? <FiToggleRight className="mr-1" /> : <FiToggleLeft className="mr-1" />}
    </button>
  );
};

export default BtnEstado;