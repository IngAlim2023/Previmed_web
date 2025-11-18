import React from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnEditar: React.FC<OpcionesBotones> = ({ verText, text }) => {
  return (
    <button
      className={`
        ${text}
        relative overflow-hidden
        text-amber-500 font-bold p-2 m-1 border-1 border-amber-500 rounded-md
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-linear-to-r from-amber-500 to-amber-500
        bg-no-repeat bg-[length:0%_0%] bg-left-bottom
        hover:bg-[length:200%_200%]
        hover:cursor-pointer
        hover:shadow-none
        `}
    >
      <MdOutlineModeEdit />
      {verText && <span>Beneficiarios</span>}
    </button>
  );
};

export default BtnEditar;
