import React from "react";
import { Link, useLocation } from "react-router-dom";

// Este es el componente de la barra lateral para el médico
const SideBarMedico: React.FC = () => {
  // useLocation dice en qué ruta estás parado
  const location = useLocation();

  // Aquí se definen las opciones del menú de la barra lateral
  const navItems = [
    { path: "/home/medico", label: "Inicio" },
    { path: "/medico/visitas", label: "Visitas" },
    { path: "/medico/historial", label: "Historial" },
    { path: "/", label: "Salir" }
  ];

  return (
    // barra lateral
    <aside className="h-screen w-64 bg-white border-r border-gray-200 shadow-md flex flex-col py-6">
      {/* nombre */}
      <div className="px-6 pb-6 text-2xl font-bold text-teal-700 tracking-tight">
        Previmed
      </div>

      {/* Aqui estan los items*/}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            // se resalta el botón cuando está seleccionado
            className={`px-6 py-3 text-left rounded-r-full text-gray-700 text-base font-medium transition-colors duration-200
              hover:bg-teal-50 hover:text-teal-700
              ${
                location.pathname === item.path
                  ? "bg-teal-100 text-teal-800 font-semibold"
                  : ""
              }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SideBarMedico;
