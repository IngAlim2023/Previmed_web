import React from "react"
import DataTableEps from "../../components/eps/DataTableEps"
import FormularioEps from "../../components/eps/FormularioEps"

const Eps:React.FC = () => {
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormularioEps/>
        <DataTableEps/>
      </div>
    </div>
  )
}

export default Eps