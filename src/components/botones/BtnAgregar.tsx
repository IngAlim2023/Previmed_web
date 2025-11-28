import React from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnAgregar: React.FC<OpcionesBotones> = ({ verText, text, disabled }) => {
  return (
    <button
      disabled={disabled}
      className={`
        ${text}
        flex items-center justify-center gap-2
        px-4 py-2
        rounded-lg
        font-medium
        text-green-700
        border border-green-400
        bg-white
        shadow-sm
        transition-all duration-300 ease-in-out
        hover:bg-green-600 hover:text-white
        hover:border-green-600
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1
        active:scale-95
      `}
    >
      <MdAddCircleOutline className="text-xl" />
      {verText && <span>{disabled? 'Agregando...':'Agregar'}</span>}
    </button>
  );
};

export default BtnAgregar;
