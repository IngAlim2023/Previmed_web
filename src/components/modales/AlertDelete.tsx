import toast from "react-hot-toast";
import { IoAlertCircleOutline } from "react-icons/io5";

type PropsAlertDelete = {
  nombre: string;
  setAlert: (value: boolean) => void;
};

const AlertDelete: React.FC<PropsAlertDelete> = ({ nombre, setAlert }) => {
  const eliminarPago = () => {
    setAlert(false);
    toast.success(`${nombre} eliminado correctamente`);
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="w-2/3 lg:w-1/3 bg-white rounded-2xl p-6 border">
          <div className="flex justify-center items-center mb-2">
            <IoAlertCircleOutline className="text-9xl text-red-600" />
          </div>
          <p className="text-2xl text-center">
            ¿ Estás seguro de eliminar {nombre} ?
          </p>
          <div className="flex w-full justify-around mt-6">
            <button
              className="bg-blue-600 text-white text-xl px-4 py-1 rounded-xl cursor-pointer"
              onClick={() => setAlert(false)}
            >
              Cancelar
            </button>
            <button
              className="bg-red-600 text-white text-xl px-4 py-1 rounded-xl cursor-pointer"
              onClick={() => eliminarPago()}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertDelete;
