import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/landing/Home";
import Login from "./pages/login/Login";
import HomeMedico from "./pages/general/HomeMedico";
import { Toaster } from "react-hot-toast";
import HomeAsesor from "./pages/general/HomeAsesor";
import HomePacientes from "./pages/general/HomePacientes";
import ContratoPaciente from "./pages/general/ContratoPaciente";
import Pagos from "./pages/general/Pagos";
import Beneficiarios from "./pages/general/Beneficiarios";
import Visitas from "./pages/general/Visitas";
import PlanesAdmin from "./pages/administrador/PlanesAdmin";
import Pacientes from "./pages/general/Pacientes";
import Medicos from "./pages/general/Medicos";
import Solicitudes from "./pages/general/Solicitudes";
import Eps from "./pages/administrador/Eps";
import Roles from "./pages/administrador/Roles";
import HistorialVisitas from "./pages/general/HistorialVisitas";
import Contratos from "./pages/general/Contratos";
import FormasPago from "./pages/administrador/FormasPago";
import BeneficiosPlan from "./pages/administrador/BeneficiosPlan";
import FormularioPacientes from "./pages/general/FormularioPacientes";
import RenderVistas from "./components/navegation/RenderVistas";
import Usuarios from "./pages/administrador/Usuarios";
import NotFound from "./pages/NotFound";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";
import Barrios from "./pages/administrador/Barrios";
import TelefonosUsuario from "./pages/administrador/TelefonosUsuario";
import FormPlan from "./components/planes/FormPlan";
import FormBeneficioPage from "./pages/administrador/FormBeneficioPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<RenderVistas />}>
            <Route path="/home/medico" element={<HomeMedico />} />
            <Route path="/home/asesor" element={<HomeAsesor />} />
            <Route path="/home/paciente" element={<HomePacientes />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/visitas" element={<Visitas />} />
            <Route path="/historial/visitas" element={<HistorialVisitas />} />
            <Route path="/usuarios/:id/telefonos" element={<TelefonosUsuario />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/contrato" element={<ContratoPaciente />} />
            <Route path="/historial/visitas" element={<HistorialVisitas />} />
            <Route path="/beneficiarios" element={<Beneficiarios />} />
            <Route path="/planes" element={<PlanesAdmin />} />
            <Route path="/planes/crear" element={<FormPlan />} />
            <Route path="/planes/editar/:idPlan" element={<FormPlan />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/visitas" element={<Visitas />} />
            <Route path="/medicos" element={<Medicos />} />
            <Route path="/contratos" element={<Contratos />} />
            <Route path="/beneficios_plan" element={<BeneficiosPlan />} />
            <Route path="/beneficios_plan/nuevo" element={<FormBeneficioPage />} />
            <Route path="/solicitudes" element={<Solicitudes />} />
            <Route path="/formas_pago" element={<FormasPago />} />
            <Route path="/eps" element={<Eps />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/panel_control" element={<Roles />} />
            <Route path="/barrios" element={<Barrios />} />
            <Route path="/beneficiarios" element={<Beneficiarios/>}/>
            <Route
              path="/formularioPacientes"
              element={<FormularioPacientes />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
export default App;
