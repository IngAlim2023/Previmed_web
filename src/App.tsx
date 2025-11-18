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
import VisitasPorMedico from "./pages/general/VisitasPorMedico";
import HistorialVisitasMedico from "./pages/general/HistorialVisitasMedico";
import HistorialVisitasPaciente from "./pages/general/HistorialVisitasPaciente";
import SolicitarVisitaPaciente from "./pages/general/SolicitarVisitaPaciente";
import AdminHome from "./pages/administrador/HomeAdmin";
import HistorialPagos from "./pages/general/HistorialPagos";
import SolicitudesVistaPaciente from "./pages/general/SolicitudesVistaPaciente";
import ProtectedPacientes from "./protectedRoutes/ProtectedPacientes";
import ProtectedAdministrador from "./protectedRoutes/ProtectedAdministrador";
import ProtectedAsesor from "./protectedRoutes/ProtectedAsesor";
import ProtectedAdminAsesor from "./protectedRoutes/ProtectedAdminAsesor";
import Beneficiarios from "./pages/general/Beneficiarios";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<RenderVistas />}>
            <Route path="/home/medico" element={<HomeMedico />} />
            
            {/* Rutas para el Administrador */}
            <Route element={<ProtectedAdministrador/>}>
              <Route path="/home/admin" element={<AdminHome />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/medicos" element={<Medicos />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/planes" element={<PlanesAdmin />} />
              <Route path="/visitas" element={<Visitas />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/contratos" element={<Contratos />} />
              <Route path="/beneficios_plan" element={<BeneficiosPlan />} />
              <Route path="/solicitudes" element={<Solicitudes />} />
              <Route path="/formas_pago" element={<FormasPago />} />
              <Route path="/eps" element={<Eps />} />
              <Route path="/barrios" element={<Barrios />} />
            </Route>


            {/* Rutas para el Paciente */}
            <Route element={<ProtectedPacientes/>}>
              <Route path="/home/paciente" element={<HomePacientes />} />
              <Route path="/solicitar-visita" element={<SolicitarVisitaPaciente />} />
              <Route path="/contrato" element={<ContratoPaciente />} />
              <Route path="/historial/paciente" element={<HistorialVisitasPaciente />} />
              <Route path="/historial/pagos" element={<HistorialPagos/>}/>
              <Route path="/solicitudes/usuario" element={<SolicitudesVistaPaciente/>}/>
            </Route>
            
            {/* Rutas para el Asesor */}
            <Route element={<ProtectedAsesor/>}>
              <Route path="/home/asesor" element={<HomeAsesor />} />
              <Route path="/pacientes/asesor" element={<Pacientes />} />
              <Route path="/contratos/asesor" element={<Contratos />} />
              <Route path="/pagos/asesor" element={<Pagos />} />
              <Route path="/barrios/asesor" element={<Barrios />} />
            </Route>
            {/**Administrador y asesor */} 
            <Route element={<ProtectedAdminAsesor/>}>
            </Route>


            <Route path="/historial/visitas" element={<HistorialVisitas />} />
            <Route path="/usuarios/:id/telefonos" element={<TelefonosUsuario />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/historial/visitas" element={<HistorialVisitas />} />
            <Route path="/planes/crear" element={<FormPlan />} />
            <Route path="/planes/editar/:idPlan" element={<FormPlan />} />
            <Route path="/visitas" element={<Visitas />} />
            <Route path="/visitas/medico" element={<VisitasPorMedico />} />
            <Route path="/historial/medico" element={<HistorialVisitasMedico/>} /> 
            <Route path="/beneficios_plan/nuevo" element={<FormBeneficioPage />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/panel_control" element={<Roles />} />
            <Route path="/formularioPacientes" element={<FormularioPacientes />}/>
            <Route path="/beneficiarios" element={<Beneficiarios />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
export default App;
