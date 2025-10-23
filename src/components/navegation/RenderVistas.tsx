import {useState } from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";


const RenderVistas: React.FC = () => {
  const [cerrado, setCerrado] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-blue-50">
      <SideBar cerrado={cerrado} setCerrado={setCerrado} />

      <main
        className={`flex-1 bg-blue-50 transition-all duration-300 ${
          cerrado ? "ml-20" : "ml-64"
        }`}
      >
        <Outlet/>
      </main>
    </div>
  );
};

export default RenderVistas;
