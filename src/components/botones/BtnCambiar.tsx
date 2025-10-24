import React from "react";
import { TbArrowsExchange2 } from "react-icons/tb";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnCambiar: React.FC<OpcionesBotones> = ({ verText, text }) => {
  return (
    <>
          <button
            className={`
              flex items-center
              justify-center
              ${text}
              relative overflow-hidden
              text-green-500 font-bold p-2 m-1 border-1 border-green-600 rounded-md
              shadow-[2px_2px_2px_rgba(22,163,74,0.99)]
              transition-all duration-700 ease-in-out
              hover:text-white
              bg-gradient-to-r from-green-500 to-green-500
              bg-no-repeat bg-[length:50%_0%] bg-right-bottom
              hover:bg-[length:200%_100%]
              hover:cursor-pointer
              hover:shadow-none
              `}
          >
              <TbArrowsExchange2 className="mr-1" />
            {verText && "Cambiar"}
          </button>
    </>
  )
}

export default BtnCambiar;
