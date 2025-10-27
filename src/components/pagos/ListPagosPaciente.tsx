import { useEffect, useState } from "react";
import { getPagosMembresia } from "../../services/pagosService";

const ListPagosPaciente: React.FC<{ membresiaId: number }> = ({
  membresiaId,
}) => {
  const [pagos, setPagos] = useState<any[]>([]);
  useEffect(() => {
    const getPagos = async () => {
      const res = await getPagosMembresia(membresiaId);
      setPagos(res.data);
    };
    getPagos();
  }, []);

  return (
    <div>
      {pagos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6 px-2">
          {pagos.map((item) => (
            <div
              key={item.idRegistro}
              className="bg-white shadow-md hover:shadow-lg transition rounded-2xl overflow-hidden border border-gray-200 max-w-sm"
            >
              {/* Imagen o marcador */}
              {item.foto ? (
                <img
                  src={item.foto}
                  alt="Foto membresía"
                  className="w-full h-48 object-contain"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 text-sm italic">
                  Sin imagen
                </div>
              )}

              {/* Contenido */}
              <div className="p-4 space-y-2 text-sm">
                <p className="font-semibold text-gray-700">
                  Monto:{" "}
                  <span className="text-blue-500 font-bold tracking-wide">
                    ${item.monto} COP
                  </span>
                </p>
                <p className="font-semibold text-gray-700">
                  Forma de pago:{" "}
                  <span className="font-bold text-gray-900">
                    {item.formaPago?.tipoPago || "N/A"}
                  </span>
                </p>
                <div className="border-t border-gray-100 pt-2 space-y-1">
                  <p className="font-medium text-gray-600">
                    Inicio: {new Date(item.fechaInicio).toLocaleDateString()}
                  </p>
                  <p className="font-medium text-gray-600">
                    Fin: {new Date(item.fechaFin).toLocaleDateString()}
                  </p>
                  <p className="font-medium text-gray-600">
                    Pago: {new Date(item.fechaPago).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-2xl text-center mt-8 font-semibold">Todavia no hay pagos asosiados a la membresia actual</div>
      )}
    </div>
  );
};

export default ListPagosPaciente;
