import React from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";

const BtnEliminar: React.FC = () => {
  return (
    <button
      className={`
        flex items-center
        justify-center
  relative overflow-hidden
        text-red-600 font-bold p-2 m-1 border-2 border-red-600 rounded-md
        shadow-[5px_5px_5px_rgba(220,38,38,0.99)]
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-gradient-to-r from-red-600 to-red-600
        bg-no-repeat bg-[length:50%_0%] bg-left-bottom
        hover:bg-[length:200%_100%]
        hover:cursor-pointer
        hover:shadow-none
`}
    >
      <MdOutlineDeleteOutline className="mr-1"/>
      Eliminar
    </button>
  );
};

export default BtnEliminar;
