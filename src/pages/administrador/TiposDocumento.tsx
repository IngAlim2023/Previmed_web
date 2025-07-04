import React from "react";
import DataTableDocumento from "../../components/Administrador/documentos/DataTableDocumento";
import FormularioDocumento from "../../components/Administrador/documentos/FormularioDocumento";
const TiposDocumento: React.FC = () => {
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormularioDocumento />
        <DataTableDocumento />
      </div>
    </div>
  );
};

export default TiposDocumento;
