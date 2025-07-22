import React from "react";
import FormularioGeneros from "../../components/Administrador/generos/FormularioGeneros";
import DataTableGeneros from "../../components/Administrador/generos/DataTableGeneros";

const GenerosAdmin:React.FC = () => {
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap">
        <FormularioGeneros/>
        <DataTableGeneros/>
      </div>
    </div>
  )
}

export default GenerosAdmin
