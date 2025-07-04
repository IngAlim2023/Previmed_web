 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import './App.css';  
import {Home} from './pages/home/Home';  
import Login from './pages/login/Login';  
import Dashboard from './pages/dashboard/Dashboard';  
import HomeMedico from './pages/medicos/HomeMedico';
import {Toaster} from 'react-hot-toast';
import VisitasMedico from './pages/medicos/VisitasMedico';
import HomeAsesor from './pages/asesor/HomeAsesor';
import HomePacientes from './pages/paciente/HomePacientes';
import ContratoPaciente from './pages/paciente/ContratoPaciente';
import VisitasPaciente from './pages/paciente/VisitasPaciente';
import PagosPaciente from './pages/paciente/PagosPaciente';
import PagosAdmin from './pages/administrador/PagosAdmin';
import BeneficiariosPaciente from './pages/paciente/BeneficiariosPaciente';
import PagosAsesor from './pages/asesor/PagosAsesor';
import PacientesAsesor from './pages/asesor/PacientesAsesor';
import VisitasAdmin from './pages/administrador/VisitasAdmin';
import Planes from './components/landing/Planes';
import PlanesAdmin from './pages/administrador/PlanesAdmin';
import BarriosAdmin from './pages/administrador/BarriosAdmin';
import PacientesAdmin from './pages/administrador/PacientesAdmin';
import MedicosAdmin from './pages/administrador/MedicosAdmin';
import ContratosAdmin from './pages/administrador/ContratosAdmin';
import TiposPlanAdmin from './pages/administrador/TiposPlanAdmin';
import Solicitudes from './pages/general/Solicitudes';
import FormasPagoAdmin from './pages/administrador/FormasPagoAdmin';
import TiposDocumento from './pages/administrador/TiposDocumento';
import EpsAdmin from './pages/administrador/EpsAdmin';
import EstadosCivilesAdmin from './pages/administrador/EstadosCivilesAdmin';
import GenerosAdmin from './pages/administrador/GenerosAdmin';
import RolesAdmin from './pages/administrador/RolesAdmin';
import HistorialVisitas from './pages/general/HistorialVisitas';

function App() {  
  return (  
    <Router>  
      <Routes>  
        {/*RUTAS GENERALES */}
        <Route path='/' element={<Home />} />  
        <Route path='/login' element={<Login />} />  
        <Route path='/dashboard' element={<Dashboard />} /> 

        {/*RUTAS DEL ROL MEDICO */}
        <Route path='/home/medico' element={<HomeMedico />} />
        <Route path='/medico/visitas' element={<VisitasMedico />} />
        <Route path='/medico/historial/visitas' element={<HistorialVisitas />} />

        {/*RUTAS DEL ROL ASESOR */}
        <Route path='/home/asesor' element={<HomeAsesor/>}/>
        <Route path='/asesor/pagos' element={<PagosAsesor/>}/>
        <Route path='/asesor/pacientes' element={<PacientesAsesor/>}/>
        <Route path='/asesor/planes' element={<Planes/>}/>
        <Route path='/asesor/solicitudes' element={<Solicitudes/>}/>

        {/*RUTAS DEL ROL PACIENTE */}
        <Route path='/home/paciente' element={<HomePacientes/>}/>
        <Route path='/paciente/contrato' element={<ContratoPaciente/>}/>
        <Route path='/paciente/visitas' element={<VisitasPaciente/>}/>
        <Route path='/paciente/historial/visitas' element={<HistorialVisitas/>}/>
        <Route path='/paciente/pagos' element={<PagosPaciente/>}/>
        <Route path='/paciente/beneficiarios' element={<BeneficiariosPaciente/>}/>

        {/*RUTAS DEL ROL ADMINISTRADOR */}
        <Route path='/admin/pagos' element={<PagosAdmin/>}/>
        <Route path='/admin/visitas' element={<VisitasAdmin/>}/>
        <Route path='/admin/planes' element={<PlanesAdmin/>}/>
        <Route path='/admin/barrios' element={<BarriosAdmin/>}/>
        <Route path='/admin/pacientes' element={<PacientesAdmin/>}/>
        <Route path='/admin/medicos' element={<MedicosAdmin/>}/>
        <Route path='/admin/contratos' element={<ContratosAdmin/>}/>
        <Route path='/admin/tipos_plan' element={<TiposPlanAdmin/>}/>
        <Route path='/admin/beneficios_plan' element={<PagosAdmin/>}/>
        <Route path='/admin/solicitudes' element={<Solicitudes/>}/>
        <Route path='/admin/formas_pago' element={<FormasPagoAdmin/>}/>
        <Route path='/admin/tipos_documento' element={<TiposDocumento/>}/>
        <Route path='/admin/eps' element={<EpsAdmin/>}/>
        <Route path='/admin/estados_civiles' element={<EstadosCivilesAdmin/>}/>
        <Route path='/admin/generos' element={<GenerosAdmin/>}/>
        <Route path='/admin/roles' element={<RolesAdmin/>}/>
      </Routes>
      <Toaster/>
    </Router>  
  );  
}  
export default App;  