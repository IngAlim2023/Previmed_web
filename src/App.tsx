 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import './App.css';  
import {Home} from './pages/home/Home';  
import Login from './pages/login/Login';  
import Dashboard from './pages/dashboard/Dashboard';  
import HomeMedico from './pages/medicos/HomeMedico';
import {Toaster} from 'react-hot-toast';
import VisitasMedico from './pages/medicos/VisitasMedico';
import HomeAsesor from './pages/asesor/HomeAsesor';

function App() {  
  return (  
    <Router>  
      <Routes>  
        <Route path='/' element={<Home />} />  
        <Route path='/login' element={<Login />} />  
        <Route path='/dashboard' element={<Dashboard />} /> 
        <Route path='/homemedico' element={<HomeMedico />} />
        <Route path='/medico/visitas' element={<VisitasMedico />} />
        <Route path='/home/asesor' element={<HomeAsesor/>}/>
      </Routes>
      <Toaster/>
    </Router>  
  );  
}  

export default App;  