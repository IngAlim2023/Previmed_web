// src/pages/admin/Eps.tsx
import React, { useState } from "react";
import DataTableEps from "../../components/eps/DataTableEps";
import FormularioEps from "../../components/eps/FormularioEps";
import { Eps } from "../../interfaces/eps";

const EpsPage: React.FC = () => {
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Eps | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    // después de crear/editar, refrescar tabla y volver a modo crear
    setRefreshKey((k) => k + 1);
    setMode("create");
    setSelected(null);
  };

  const handleCancel = () => {
    setMode("create");
    setSelected(null);
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormularioEps
          mode={mode}
          initialEps={selected}
          onSaved={handleSaved}
          onCancel={mode === "edit" ? handleCancel : undefined}
        />
        <DataTableEps
          refreshKey={refreshKey}
          onEdit={(eps) => {
            setSelected(eps);
            setMode("edit");
          }}
          onView={(eps) => {
            // por ahora solo selección visual; puedes abrir modal si luego quieres
            setSelected(eps);
          }}
          onDeleted={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
};

export default EpsPage;
