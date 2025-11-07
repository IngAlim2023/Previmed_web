import { HiOutlineDocumentDownload } from "react-icons/hi";
import { OpcionesBotones } from "../../interfaces/botones";
import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getPacientesId } from "../../services/pacientes";
import { Paciente } from "../../interfaces/interfaces";
import { getContratoPdf } from "../../services/contratos";
import toast from "react-hot-toast";

const BtnDescargarPdf: React.FC<OpcionesBotones> = ({ verText, text }) => {
  const { user } = useAuthContext();
  const [descargando, setDescargando] = useState(false);

  const generarContrato = async (idUsuario: string) => {
    try {
      setDescargando(true);
      const res = await getPacientesId(idUsuario);
      const titular = res.find((p: Paciente) => p.pacienteId == null);
      if (!titular) throw new Error("No se encontró titular.");
      const pdfUrl = await getContratoPdf({
        direccionPrevimed: "Cra 9 # 9n-19, Popayán, Colombia",
        telefonoPrevimed: "310 6236219",
        beneficiarios: [],
        titularNombre: `${titular.usuario.nombre} ${titular.usuario.segundoNombre ?? ""} ${titular.usuario.apellido} ${titular.usuario.segundoApellido ?? ""}`,
        titularEmail: titular.usuario.email ?? "",
        titularDocumento: titular.usuario.numeroDocumento ?? "",
        membresia: "1234",
      });
      toast.success('Contrato generado correctamente.')
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "contratoPrevimed.pdf";
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Error al generar el contrato')
    } finally {
      setDescargando(false);
    }
  };

  return (
    <button
      onClick={() => generarContrato(user.id || "")}
      disabled={descargando}
      className={`
        flex items-center justify-center
        ${text}
        relative overflow-hidden
        font-bold p-1.5 m-1 border border-green-500 rounded-md
        transition-all duration-700 ease-in-out
        ${descargando
          ? "bg-gray-300 text-gray-600"
          : "text-green-500 hover:text-white hover:bg-gradient-to-r from-green-500 to-green-600"
        }
      `}
    >
      <HiOutlineDocumentDownload className="mr-1 text-lg" />
      {verText && (descargando ? "Generando..." : "Descargar Contrato")}
    </button>
  );
};

export default BtnDescargarPdf;
