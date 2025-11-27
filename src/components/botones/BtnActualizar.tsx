import React from "react";
import { MdUpdate } from "react-icons/md";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnActualizar: React.FC<OpcionesBotones> = ({ verText, text }) => {
  return (
    <button
      className={`
        ${text}
        text-green-600 font-bold p-2 m-1 border-1 border-green-600 rounded-md
        shadow-[2px_2px_2px_rgba(22,163,74,0.99)]
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-gradient-to-r from-green-600 to-green-600
        bg-no-repeat bg-[length:50%_0%] bg-right-bottom
        hover:bg-[length:200%_100%]
        hover:cursor-pointer
        hover:shadow-none
        flex items-center gap-1
      `}
    >
      <MdUpdate className="text-base" />
      {verText && <span>Actualizar</span>}
    </button>
  );
};

export default BtnActualizar;
