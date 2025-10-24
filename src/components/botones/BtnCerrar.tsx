import { ImCancelCircle } from "react-icons/im";
import { OpcionesBotones } from "../../interfaces/botones";

const BtnCerrar: React.FC<OpcionesBotones> = ({ verText, text }) => {
  return (
    <button
      className={`
        ${text}
        flex items-center justify-center gap-2
        px-4 py-2
        rounded-lg
        font-medium
        text-red-700
        border border-red-400
        bg-white
        shadow-sm
        transition-all duration-300 ease-in-out
        hover:bg-red-600 hover:text-white
        hover:border-red-600
        focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
        active:scale-95
      `}
    >
      <ImCancelCircle className="text-xl" />
      {verText && <span>Cerrar</span>}
    </button>
  );
};

export default BtnCerrar;
