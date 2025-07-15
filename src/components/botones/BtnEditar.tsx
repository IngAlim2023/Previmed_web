import React from 'react'
import { MdOutlineModeEdit } from "react-icons/md";


const BtnEditar:React.FC = () => {
  return (
    <button
      className={`
        flex items-center
        justify-center
  relative overflow-hidden
        text-amber-500 font-bold p-2 m-1 border-2 border-amber-500 rounded-md
        shadow-[5px_5px_5px_rgba(245,158,11,0.99)]
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-linear-to-r from-amber-500 to-amber-500
        bg-no-repeat bg-[length:0%_0%] bg-left-bottom
        hover:bg-[length:200%_200%]
        hover:cursor-pointer
        hover:shadow-none
        `}
    >
        <MdOutlineModeEdit className='mr-1' />
      Editar
    </button>
  )
}

export default BtnEditar
