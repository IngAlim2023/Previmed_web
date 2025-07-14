import React from "react";
import { MdAddCircleOutline } from "react-icons/md";

const BtnAgregar: React.FC = () => {
  return (
    <button
      className={`
        flex items-center
        justify-center
  relative overflow-hidden
        text-green-600 font-bold p-2 m-1 border-2 border-green-600 rounded-md
        shadow-[5px_5px_5px_rgba(22,163,74,0.99)]
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-gradient-to-r from-green-600 to-green-600
        bg-no-repeat bg-[length:50%_0%] bg-rigth-bottom
        hover:bg-[length:200%_100%]
        hover:cursor-pointer
        hover:shadow-none
        `}
    >
        <MdAddCircleOutline className="mr-1" />
      Agregar
    </button>
  );
};

export default BtnAgregar;
