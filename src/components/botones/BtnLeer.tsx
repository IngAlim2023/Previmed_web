import React from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnLeer:React.FC<OpcionesBotones> = ({verText, text}) => {
  return (
    <button
      className={`
        ${text}
        relative overflow-hidden
        text-sky-600 font-bold p-2 m-1 border-1 border-sky-600 rounded-md
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-linear-to-r from-sky-600 to-sky-600
        bg-no-repeat bg-[length:0%_0%] bg-right-top
        hover:bg-[length:200%_200%]
        hover:cursor-pointer
        hover:shadow-none
        `}
    >
        <MdOutlineRemoveRedEye className='mr-1'/>
      {verText && "Ver"}
    </button>
  );
};

export default BtnLeer;
