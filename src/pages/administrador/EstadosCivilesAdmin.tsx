import React from "react"
import FormularioEstadoCivil from "../../components/Administrador/estadoCivil/FormularioEstadoCivil"
import DataTableEstadoCivil from "../../components/Administrador/estadoCivil/DataTableEstadoCivil"

const EstadosCivilesAdmin:React.FC = () => {
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormularioEstadoCivil/>
      <DataTableEstadoCivil/>
      </div>
    </div>
  )
}

export default EstadosCivilesAdmin
