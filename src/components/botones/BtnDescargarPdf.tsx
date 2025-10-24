import { HiOutlineDocumentDownload } from "react-icons/hi";
import { OpcionesBotones } from "../../interfaces/botones";
import React from 'react'

const BtnDescargarPdf: React.FC<OpcionesBotones> = ({verText, text}) => {
  return (
    <button
      className={`
        flex items-center
        justify-center
        ${text}
        relative overflow-hidden
        text-green-500 font-bold p-1.5 m-1 border-1 border-green-500 rounded-md
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-gradient-to-r from-green-500 to-green-600
        bg-no-repeat bg-[length:50%_0%] bg-rigth-bottom
        hover:bg-[length:200%_100%]
        hover:cursor-pointer
        hover:shadow-none
        `}
    >
        <HiOutlineDocumentDownload className="mr-1 text-lg" />
      {verText && "Descargar"}
    </button>
  )
}

export default BtnDescargarPdf
