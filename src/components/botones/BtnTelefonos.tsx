import React from "react";
import { MdPhoneInTalk } from "react-icons/md";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnTelefonos: React.FC<OpcionesBotones> = ({ verText, text }) => {
  return (
    <button
      className={`
        ${text}
        relative overflow-hidden
        text-blue-500 font-bold p-2 m-1 border-1 border-blue-500 rounded-md
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-linear-to-r from-blue-500 to-blue-500
        bg-no-repeat bg-[length:0%_0%] bg-left-bottom
        hover:bg-[length:200%_200%]
        hover:cursor-pointer
        hover:shadow-none
        `}
    >
      <MdPhoneInTalk />
      {verText && <span>Telefonos</span>}
    </button>
  );
};

export default BtnTelefonos;
