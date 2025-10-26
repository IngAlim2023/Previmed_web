import { FiCalendar, FiUser, FiFileText } from "react-icons/fi";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import BtnDescargarPdf from "../../components/botones/BtnDescargarPdf";
import { useEffect, useState } from "react";
import { getContratoByUserId } from "../../services/contratos";
import { useAuthContext } from "../../context/AuthContext";
import { responseContratoUser, Usuario } from "../../interfaces/interfaces";
import { getPacientesId } from "../../services/pacientes";

const ContratoPaciente: React.FC = () => {
  const [contrato, setContrato] = useState<responseContratoUser>();
  const [usuario, setUsuario] = useState<Usuario>()
  console.log(contrato)
  const start = new Date(contrato?.membresia.fechaInicio??'');
  const end = new Date(contrato?.membresia.fechaFin??'');
  const now = new Date();
  const {user} = useAuthContext();

  useEffect(()=>{
    const getData = async() => {
      const res = await getContratoByUserId(user?.id as string);
      const resUser = await getPacientesId(user?.id as string);
      const titular = resUser.find((u:any)=> u.pacienteId == null)
      setUsuario(titular.usuario)
      setContrato(res)
    }
    getData()
  }, [])

  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = Math.min(Math.max(now.getTime() - start.getTime(), 0), Math.max(totalMs, 0));

  let progress = 0;
  if (totalMs > 0) {
    progress = Math.max(0, Math.min(100, (elapsedMs / totalMs) * 100));
  } else {
    progress = now >= end ? 100 : 0;
  }

  let progressColorClass = "bg-green-500";
  if (progress > 70 && progress <= 80) progressColorClass = "bg-yellow-400";
  else if (progress > 80 && progress <= 90)
    progressColorClass = "bg-orange-500";
  else if (progress > 90) progressColorClass = "bg-red-500";

  const formatDate = (d: string | Date): string => new Date(d).toLocaleDateString("es-CO", {year: "numeric",month: "short",day: "numeric"});

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="p-6 rounded-2xl shadow-lg bg-white/70 backdrop-blur border border-gray-100 flex flex-col items-center hover:shadow-xl transition-all duration-300">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <FiCalendar />
          Progreso
        </h2>

        <div className="relative w-full flex items-center justify-between mb-6">
          <div className="flex flex-col items-center text-gray-600 text-sm">
            <div className="w-18 h-18 rounded-full bg-blue-50 p-2 flex items-center justify-center text-center text-xs text-gray-700 shadow-sm">
              {formatDate(contrato?.membresia.fechaInicio??'')}
            </div>
            Fecha inicio
          </div>
          <div className="flex-1 mx-3 h-3 bg-gray-200 rounded-full relative overflow-hidden">
            <div
              className={`${progressColorClass} h-3 rounded-full transition-all duration-700 ease-in-out`}
              style={{ width: `${progress.toFixed(1)}%` }}
            />
          </div>
          <div className="flex flex-col items-center text-gray-600 text-sm">
            <div className="w-18 h-18 rounded-full bg-blue-50 p-2 flex items-center justify-center text-xs text-center text-gray-700 shadow-sm">
              {formatDate(contrato?.membresia.fechaFin??'')}
            </div>
            Fecha fin
          </div>
        </div>

        <div className="text-sm font-medium text-gray-700 text-center mb-4">
          {progress.toFixed(1)}% del tiempo transcurrido
        </div>
        <BtnDescargarPdf verText={true} />
      </div>

      <div className="p-6 rounded-2xl shadow-lg bg-white/70 backdrop-blur border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <FiFileText className="text-2xl" /> Detalles del contrato
          </h2>

          <span className="flex items-center gap-2">
            {contrato?.membresia.estado ? (
              <span className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full">
                <HiCheckCircle className="w-5 h-5" />
                Activo
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-full">
                <HiXCircle className="w-5 h-5" />
                Inactivo
              </span>
            )}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Numero de contrato</span>
            <span className="font-medium">
              {contrato?.membresia.numeroContrato}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Empresa</span>
            <span className="font-medium">
              PREVIMED TU MÉDICO EN CASA S.A.S
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Titular</span>
            <span className="font-medium flex items-center gap-2">
              <FiUser /> {`${usuario?.nombre} ${usuario?.segundoNombre??''} ${usuario?.apellido} ${usuario?.segundoApellido??''}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Plan</span>
            <span className="font-medium">{contrato?.membresia.plan?.tipoPlan}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Valor</span>
            <span className="font-medium">$ {contrato?.membresia.plan?.precio} COP</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Inicio</span>
            <span className="font-medium">{formatDate(contrato?.membresia.fechaInicio??'')}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Fin</span>
            <span className="font-medium">{formatDate(contrato?.membresia.fechaFin??'')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratoPaciente;
