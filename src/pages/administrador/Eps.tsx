// src/pages/admin/Eps.tsx
import React, { useState } from "react";
import DataTableEps from "../../components/eps/DataTableEps";
import FormularioEps from "../../components/eps/FormularioEps";
import { Eps } from "../../interfaces/eps";
import { FaPlus, FaTimes } from "react-icons/fa";

const EpsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Eps | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddNew = () => {
    setMode("create");
    setSelected(null);
    setShowModal(true);
  };

  const handleEdit = (eps: Eps) => {
    setSelected(eps);
    setMode("edit");
    setShowModal(true);
  };

  const handleSaved = () => {
    setRefreshKey((k) => k + 1);
    setShowModal(false);
    setMode("create");
    setSelected(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setMode("create");
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con botón de agregar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Gestión de EPS</h1>
            <p className="text-gray-600">Administra las entidades promotoras de salud</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
          >
            <FaPlus />
            <span>Agregar EPS</span>
          </button>
        </div>

        {/* DataTable */}
        <DataTableEps
          refreshKey={refreshKey}
          onEdit={handleEdit}
          onDeleted={() => setRefreshKey((k) => k + 1)}
        />

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
              {/* Header del modal con gradiente */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {mode === "edit" ? "Editar EPS" : "Agregar Nueva EPS"}
                    </h2>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-8">
                <FormularioEps
                  mode={mode}
                  initialEps={selected}
                  onSaved={handleSaved}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpsPage;