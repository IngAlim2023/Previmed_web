import React from "react";
import { OpcionesBotones } from "../../interfaces/botones";
import { TbUsersGroup } from "react-icons/tb";

const BtnBeneficiarios:React.FC<OpcionesBotones> = ({verText, text}) => {
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
        hover:shadow
        flex items-center gap-2
        `}
    >
        <TbUsersGroup/>
      {verText && "Beneficiarios"}
    </button>
  );
};

export default BtnBeneficiarios;
