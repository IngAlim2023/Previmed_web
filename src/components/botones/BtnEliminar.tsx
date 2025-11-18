import React from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnEliminar: React.FC<OpcionesBotones> = ({ verText, text }) => {
  return (
    <button
      className={`
        ${text}
        relative overflow-hidden
        text-red-600 font-bold p-2 m-1 border-1 border-red-600 rounded-md
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-gradient-to-r from-red-600 to-red-600
        bg-no-repeat bg-[length:50%_0%] bg-left-bottom
        hover:bg-[length:200%_100%]
        hover:cursor-pointer
        hover:shadow-none
`}
    >
      <MdOutlineDeleteOutline/>
      {verText && "Eliminar"}
    </button>
  );
};

export default BtnEliminar;
