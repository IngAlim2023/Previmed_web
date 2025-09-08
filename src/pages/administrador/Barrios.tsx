// src/pages/administrador/Barrios.tsx
import React from "react";
import DataTableBarrios from "../../components/barrios/DataTableBarrios";

const Barrios: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Barrios</h1>
      <DataTableBarrios />
    </div>
  );
};

export default Barrios;
