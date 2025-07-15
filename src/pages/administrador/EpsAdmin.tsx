import React from "react"
import DataTableEps from "../../components/Administrador/eps/DataTableEps"
import FormularioEps from "../../components/Administrador/eps/FormularioEps"

const EpsAdmin:React.FC = () => {
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormularioEps/>
        <DataTableEps/>
      </div>
    </div>
  )
}

export default EpsAdmin
