import React from 'react'
import { MdOutlineRemoveRedEye } from "react-icons/md";

const BtnLeer:React.FC = () => {
  return (
    <button
      className={`
        flex items-center
        justify-center
  relative overflow-hidden
        text-sky-600 font-bold p-2 m-1 border-2 border-sky-600 rounded-md
        shadow-[5px_5px_5px_rgba(2,132,199,0.99)]
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
      Ver
    </button>
  )
}

export default BtnLeer
