import { ImCancelCircle } from "react-icons/im";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnCancelar: React.FC<OpcionesBotones> = ({ verText, text }) => {
  return (
    <button
      className={`
        ${text}
        flex items-center gap-2 justify-center
        px-5 py-2.5
        text-sm font-semibold
        rounded-lg
        border border-gray-500
        text-gray-600
        bg-gradient-to-r from-gray-100 to-gray-200
        shadow-sm
        transition-all duration-300 ease-in-out
        hover:from-gray-600 hover:to-gray-700 hover:text-white
        hover:shadow-md hover:scale-[1.03]
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1
      `}
    >
      <ImCancelCircle className="text-base" />
      {verText && <span>Cancelar</span>}
    </button>
  );
};

export default BtnCancelar;
