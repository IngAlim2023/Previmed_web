import { useNavigate } from "react-router-dom"
import PlanesCards from "../../components/planes/PlanesCards"
import { HiOutlineClipboardList } from "react-icons/hi"
import BtnAgregar from "../../components/botones/BtnAgregar"
import { IoMdOptions } from "react-icons/io"

const PlanesAdmin: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full px-4 py-8 bg-blue-50">
      {/* Contenedor principal blanco */}
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-md p-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <HiOutlineClipboardList className="text-blue-600 text-3xl" />
            <h2 className="text-2xl font-bold text-gray-800">Planes</h2>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={()=> navigate('/beneficios_plan')} 
            className="
              relative overflow-hidden flex items-center gap-2
              text-amber-500 font-bold p-1.5 m-1 border-1 border-amber-500 rounded-md
              transition-all duration-700 ease-in-out hover:text-white
              bg-linear-to-r from-amber-500 to-amber-500
              bg-no-repeat bg-[length:0%_0%] bg-left-bottom
              hover:bg-[length:200%_200%]
              hover:cursor-pointer
              hover:shadow-none">
              <IoMdOptions className="text-lg" />
              Beneficios
            </button>
            {/* Botón personalizado con texto como en Visitas */}
            <div onClick={() => navigate("/planes/crear")}>
              <BtnAgregar verText={true} />
            </div>
          </div>
        </div>

        {/* Cards de planes */}
        <PlanesCards />
      </div>
    </div>
  )
}

export default PlanesAdmin
