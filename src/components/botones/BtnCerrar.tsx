import { ImCancelCircle } from "react-icons/im";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnCerrar: React.FC<OpcionesBotones> = ({ verText, text }) => {
  return (
    <button
      className={`
        flex items-center
        justify-center
        ${text}
        relative overflow-hidden
        text-gray-600 font-bold p-2 m-1 border-1 border-gray-600 rounded-md
        shadow-[2px_2px_2px_rgba(75,85,99,0.99)]
        transition-all duration-700 ease-in-out
        hover:text-white
        bg-gradient-to-r from-gray-600 to-gray-600
        bg-no-repeat bg-[length:50%_0%] bg-right-bottom
        hover:bg-[length:200%_100%]
        hover:cursor-pointer
        hover:shadow-none
      `}
    >
      <ImCancelCircle className="mr-1" />
      {verText && "Cerrar"}
    </button>
  );
};

export default BtnCerrar;
