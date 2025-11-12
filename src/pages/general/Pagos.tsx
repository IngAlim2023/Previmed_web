import DataTablePagos from "../../components/pagos/DataTablePagos";
import PagosAsignados from "../../components/pagos/PagosAsignados";

const PagosAdmin: React.FC = () => {
  return (
    <div className="py-4 bg-blue-50">
      <PagosAsignados/>
      <DataTablePagos/>
    </div>
  );
};

export default PagosAdmin;
