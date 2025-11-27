import { HiOutlineDocumentDownload } from "react-icons/hi";
import React, { useState } from "react";
import { getContratoPdf } from "../../services/contratos";
import toast from "react-hot-toast";

type BtnDescargarPdf = {
  verText?: boolean;
  text?: string;
  idUsuario: string;
}

const BtnDescargarPdf: React.FC<BtnDescargarPdf> = ({ verText, text, idUsuario }) => {
  const [descargando, setDescargando] = useState(false);

  const generarContrato = async (idUsuario: string) => {
    try {
      setDescargando(true);
      const pdfUrl = await getContratoPdf(idUsuario);
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
      onClick={() => generarContrato(idUsuario || "")}
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
