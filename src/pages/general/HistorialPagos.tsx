import { useEffect, useState } from "react";
import ListPagosPaciente from "../../components/pagos/ListPagosPaciente";
import { getContratoByUserId } from "../../services/contratos";
import { useAuthContext } from "../../context/AuthContext";

const HistorialPagos: React.FC = () => {
  const [id, setId] = useState<number | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const getMembresiaId = async () => {
      const res = await getContratoByUserId(user.id ?? "");
      setId(res.membresiaId);
    };

    getMembresiaId();
  }, [user]);
  return (
    <>
      {id && <ListPagosPaciente membresiaId={id} />}
    </>
  );
};

export default HistorialPagos;
